import React, { useState, useEffect, useCallback } from "react";
import {
  CloseOutlined,
  EditOutlined,
  SaveOutlined,
  StarFilled,
  StarOutlined,
  MessageOutlined,
  CameraOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { FeedbackRequest, FeedbackResponse } from "common/models/feedback";
import { uploadToCloudinary } from "../utils/CloudinaryImageUploader";

interface FeedbackInfo {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  comment: string;
  rating: number;
  image: string; // Comma-separated URLs
  orderInfo?: {
    orderId: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    currency: string;
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  feedbackResponse: FeedbackResponse | null;
  onUpdate: (updatedFeedback: FeedbackRequest) => Promise<void>;
  onDelete?: (feedbackId: number) => Promise<void>;
}

interface FormErrors {
  comment?: string;
  rating?: string;
}

interface EditableFeedback {
  comment: string;
  rating: number;
  existingImages: string[]; // URLs of existing images
  newFiles: File[]; // New files to upload
}

const RATING_LABELS = {
  5: "🎉 Excellent!",
  4: "👍 Very Good!",
  3: "😊 Good!",
  2: "😐 Fair",
  1: "😞 Poor",
} as const;

const MAX_IMAGES_TOTAL = 3;
const CLOUDINARY_FOLDER = "E-commerce/feedback";

const FeedbackEditModal: React.FC<Props> = ({ 
  open, 
  onClose, 
  feedbackResponse, 
  onUpdate, 
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<EditableFeedback | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Initialize form data when feedbackInfo changes
  useEffect(() => {
    if (feedbackResponse) {
      const existingImages = feedbackResponse.image 
        ? feedbackResponse.image.split(',').filter(url => url.trim()) 
        : [];
      
      setFormData({
        comment: feedbackResponse.comment,
        rating: feedbackResponse.rating,
        existingImages,
        newFiles: [],
      });
    }
  }, [feedbackResponse]);

  // Reset modal state when closed
  useEffect(() => {
    if (!open) {
      setIsEditing(false);
      setErrors({});
      setIsSubmitting(false);
      setIsDeleting(false);
    }
  }, [open]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const validateForm = useCallback((data: EditableFeedback): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.rating || data.rating < 1 || data.rating > 5) {
      newErrors.rating = "Please provide a rating between 1 and 5 stars";
    }

    if (data.comment.trim().length > 1000) {
      newErrors.comment = "Comment must be less than 1000 characters";
    }

    // Check if there's any content
    const hasContent = data.rating > 0 || 
                      data.comment.trim().length > 0 || 
                      data.existingImages.length > 0 || 
                      data.newFiles.length > 0;

    if (!hasContent) {
      newErrors.rating = "Please provide at least a rating, comment, or image";
    }

    return newErrors;
  }, []);

  const handleRatingChange = useCallback((rating: number): void => {
    if (!formData) return;

    setFormData(prev => prev ? { ...prev, rating } : null);
    
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: undefined }));
    }
  }, [formData, errors.rating]);

  const handleCommentChange = useCallback((comment: string): void => {
    if (!formData) return;

    setFormData(prev => prev ? { ...prev, comment } : null);
    
    if (errors.comment) {
      setErrors(prev => ({ ...prev, comment: undefined }));
    }
  }, [formData, errors.comment]);

  const handleNewImageUpload = useCallback((files: FileList): void => {
    if (!formData) return;

    const filesArray = Array.from(files);
    const currentTotal = formData.existingImages.length + formData.newFiles.length;
    
    if (currentTotal + filesArray.length > MAX_IMAGES_TOTAL) {
      alert(`You can only have a maximum of ${MAX_IMAGES_TOTAL} images total!`);
      return;
    }

    const newFiles = [...formData.newFiles, ...filesArray]
      .slice(0, MAX_IMAGES_TOTAL - formData.existingImages.length);
    
    setFormData(prev => prev ? { ...prev, newFiles } : null);
  }, [formData]);

  const removeExistingImage = useCallback((imageIndex: number): void => {
    if (!formData) return;

    const newExistingImages = formData.existingImages.filter((_, index) => index !== imageIndex);
    setFormData(prev => prev ? { ...prev, existingImages: newExistingImages } : null);
  }, [formData]);

  const removeNewFile = useCallback((fileIndex: number): void => {
    if (!formData) return;

    const newFiles = formData.newFiles.filter((_, index) => index !== fileIndex);
    setFormData(prev => prev ? { ...prev, newFiles } : null);
  }, [formData]);

  const uploadNewImages = useCallback(async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    try {
      const uploadResults = await Promise.all(
        files.map(async (file) => {
          try {
            return await uploadToCloudinary(file, "user", CLOUDINARY_FOLDER);
          } catch (error) {
            console.error(`Failed to upload file ${file.name}:`, error);
            return null;
          }
        })
      );

      const successfulUrls = uploadResults.filter((url): url is string => url !== null);
      
      if (uploadResults.some(url => url === null)) {
        console.warn("Some images failed to upload");
      }

      return successfulUrls;
    } catch (error) {
      console.error("Error in batch image upload:", error);
      return [];
    }
  }, []);

  const handleEdit = useCallback((): void => {
    setIsEditing(true);
  }, []);

  const handleCancel = useCallback((): void => {
    if (feedbackResponse) {
      const existingImages = feedbackResponse.image 
        ? feedbackResponse.image.split(',').filter(url => url.trim()) 
        : [];
      
      setFormData({
        comment: feedbackResponse.comment,
        rating: feedbackResponse.rating,
        existingImages,
        newFiles: [],
      });
    }
    setErrors({});
    setIsEditing(false);
  }, [feedbackResponse]);

  const handleSave = useCallback(async (): Promise<void> => {
    if (!formData || !feedbackResponse || isSubmitting) return;

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload new images
      const newImageUrls = await uploadNewImages(formData.newFiles);
      
      // Combine existing and new image URLs
      const allImageUrls = [...formData.existingImages, ...newImageUrls];
      
      const updatedFeedback: FeedbackRequest = {
        id: feedbackResponse.id,
        productId: feedbackResponse.product.id,
        comment: formData.comment.trim(),
        rating: formData.rating,
        image: allImageUrls.join(','),
      };

      await onUpdate(updatedFeedback);
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      console.error("Failed to update feedback:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to update feedback: ${errorMessage}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, feedbackResponse, isSubmitting, validateForm, onUpdate, uploadNewImages]);

  const handleDelete = useCallback(async (): Promise<void> => {
    if (!feedbackResponse || !onDelete || isDeleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this feedback? This action cannot be undone."
    );
    
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDelete(feedbackResponse.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete feedback:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to delete feedback: ${errorMessage}. Please try again.`);
    } finally {
      setIsDeleting(false);
    }
  }, [feedbackResponse, onDelete, isDeleting, onClose]);

  const getRatingLabel = (rating: number): string => {
    return RATING_LABELS[rating as keyof typeof RATING_LABELS] || "";
  };

  const formatPrice = (price: number, currency: string): string => {
    return `${price.toLocaleString()}${currency}`;
  };

  if (!open || !feedbackResponse || !formData) return null;

  const totalImages = formData.existingImages.length + formData.newFiles.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-orange-50 to-yellow-50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={feedbackResponse.product.image.split(',')[0]}
                alt={feedbackResponse.product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditing ? "Edit Review" : "Your Review"}
              </h2>
              <p className="text-sm text-gray-600 font-medium">
                {feedbackResponse.product.name}
              </p>
              {/* {feedbackResponse. && (
                <p className="text-xs text-gray-500">
                  Order #{feedbackInfo.orderInfo.orderId} • Qty: {feedbackInfo.orderInfo.quantity} • {formatPrice(feedbackInfo.orderInfo.totalPrice, feedbackInfo.orderInfo.currency)}
                </p>
              )} */}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
            type="button"
            aria-label="Close modal"
          >
            <CloseOutlined className="text-xl text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Rating */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <StarOutlined />
                Product Quality
              </label>
              {isEditing ? (
                <div>
                  <div className="flex gap-2">
                    {([1, 2, 3, 4, 5] as const).map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(star)}
                        disabled={isSubmitting}
                        className="text-3xl transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        type="button"
                        aria-label={`Rate ${star} stars`}
                      >
                        {star <= formData.rating ? (
                          <StarFilled className="text-yellow-400 drop-shadow-lg" />
                        ) : (
                          <StarOutlined className="text-gray-300 hover:text-yellow-300" />
                        )}
                      </button>
                    ))}
                  </div>
                  {formData.rating > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      {getRatingLabel(formData.rating)}
                    </p>
                  )}
                  {errors.rating && (
                    <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-2xl">
                        {star <= formData.rating ? (
                          <StarFilled className="text-yellow-400" />
                        ) : (
                          <StarOutlined className="text-gray-300" />
                        )}
                      </span>
                    ))}
                  </div>
                  <span className="text-lg font-medium text-gray-700">
                    {formData.rating}/5
                  </span>
                  {formData.rating > 0 && (
                    <span className="text-sm text-gray-600">
                      {getRatingLabel(formData.rating)}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <MessageOutlined />
                Your Review
              </label>
              {isEditing ? (
                <div>
                  <textarea
                    placeholder="Share your experience with this product..."
                    value={formData.comment}
                    onChange={(e) => handleCommentChange(e.target.value)}
                    disabled={isSubmitting}
                    rows={4}
                    maxLength={1000}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                      errors.comment
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <div>
                      {errors.comment && (
                        <p className="text-sm text-red-600">{errors.comment}</p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {formData.comment.length}/1000 characters
                    </p>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  {formData.comment ? (
                    <p className="text-gray-800 whitespace-pre-line">{formData.comment}</p>
                  ) : (
                    <p className="text-gray-500 italic">No written review provided</p>
                  )}
                </div>
              )}
            </div>

            {/* Images */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <CameraOutlined />
                Photos ({totalImages}/{MAX_IMAGES_TOTAL})
              </label>
              
              <div className="flex gap-3 flex-wrap">
                {/* Existing Images */}
                {formData.existingImages.map((imageUrl, idx) => (
                  <div
                    key={`existing-${idx}`}
                    className="relative group w-32 h-48 border-2 border-blue-200 rounded-lg overflow-hidden"
                  >
                    <img
                      src={imageUrl}
                      alt={`Review image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Saved
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => removeExistingImage(idx)}
                        disabled={isSubmitting}
                        className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        type="button"
                        aria-label={`Remove saved image ${idx + 1}`}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

                {/* New Files */}
                {formData.newFiles.map((file, idx) => (
                  <div
                    key={`new-${idx}`}
                    className="relative group w-32 h-48 border-2 border-orange-200 rounded-lg overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                      New
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => removeNewFile(idx)}
                        disabled={isSubmitting}
                        className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        type="button"
                        aria-label={`Remove new image ${idx + 1}`}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

                {/* Upload Area */}
                {isEditing && totalImages < MAX_IMAGES_TOTAL && !isSubmitting && (
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center gap-3 w-32 h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                      <CameraOutlined className="text-3xl text-gray-400" />
                      <span className="text-sm text-gray-600 font-medium text-center px-2">
                        Add Photo
                      </span>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleNewImageUpload(e.target.files);
                          e.target.value = "";
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {totalImages === 0 && !isEditing && (
                <div className="text-center py-8 text-gray-500">
                  <CameraOutlined className="text-4xl text-gray-300 mb-2" />
                  <p>No photos added to this review</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t bg-gray-50">
          <div>
            {onDelete && !isEditing && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                type="button"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <DeleteOutlined />
                    Delete Review
                  </>
                )}
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  type="button"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <SaveOutlined />
                      Save Changes
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                type="button"
              >
                <EditOutlined />
                Edit Review
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default FeedbackEditModal;