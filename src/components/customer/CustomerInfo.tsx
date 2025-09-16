import React, { useState, useEffect, useContext } from "react";
import { uploadToCloudinary } from "../../utils/CloudinaryImageUploader";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { updateInfoThunk } from "@redux/thunk/userThunk";
import { EntityStatus } from "common/enums/EntityStatus";
import { getInfoThunk } from "@redux/thunk/authThunk";
import { formatPhone, isValidPhone, unFormatPhone } from "../../utils/FormatPhone";
import { fetchAddressSuggestions } from "../../utils/GoongLocation";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  EnvironmentOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Suggestion } from "common/models/location";
import { formatAddressPart } from "../../utils/FormatAddressPart";
import { getOrderInfoOfCustomerThunk } from "@redux/thunk/orderThunk";
import { formatPrice } from "../../utils/FormatPrice";
import { ShopContext } from "../../context/ShopContext";
import LoadingSpinner from "components/LoadingSpinner";

interface CustomerInfoProps {
  fullname: string | null;
  phone: string | null;
  address: string | null;
  image?: string | null;
  status?: EntityStatus;
}

const statusStyles: Record<EntityStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-yellow-100 text-yellow-700",
  DISABLED: "bg-red-100 text-red-700",
};

const CustomerInfo: React.FC<CustomerInfoProps> = ({
  fullname,
  phone,
  address,
  image,
  status = EntityStatus.ACTIVE,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File>();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [addressSelected, setAddressSelected] = useState<Suggestion>();
    const { currency } = useContext(ShopContext);

  // normalize initial form state to avoid nulls
  const [form, setForm] = useState({
    fullname: fullname ?? "",
    phone: phone ?? "",
    address: address ?? "",
    image: image ?? "",
  });

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { loadingUser, userUpdated } = useSelector(
    (state: RootState) => state.user
  );
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { orderAdded, orderInfo } = useSelector((state: RootState) => state.order);

  // keep form in sync if parent props change (important)
  useEffect(() => {
    setForm({
      fullname: fullname ?? "",
      phone: phone ?? "",
      address: formatAddressPart(address) ?? "",
      image: image ?? "",
    });
  }, [fullname, phone, address, image]);

  useEffect(()=>{
    dispatch(getOrderInfoOfCustomerThunk())
  }, [dispatch, orderAdded])

  useEffect(() => {
    if (isEditing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isEditing]);

  useEffect(() => {
    dispatch(getInfoThunk());
  }, [userUpdated]);

  const getAddressParts = (addr?: string | null) => {
    const safe = (addr ?? "").toString();
    const parts = safe.split("//");
    return {
      main: parts[0] ?? "",
      secondary: parts[1] ?? "",
    };
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setForm({ ...form, phone: formatPhone(value) });
    } else if (name === "address") {
      setForm({ ...form, address: value });

      if (value.length > 2) {
        try {
          const results = await fetchAddressSuggestions(value);
          setSuggestions(results || []);
        } catch (err) {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      let finalImageUrl = form.image || "";

      if (uploadedImage) {
        setUploadingImage(true);
        const uploadedUrl = await uploadToCloudinary(
          uploadedImage,
          form.fullname,
          "E-commerse/avatars"
        );
        setUploadingImage(false);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }
      await dispatch(
        updateInfoThunk({
          id: userInfo?.id ?? 0,
          email: userInfo?.email ?? "",
          fullName: form.fullname,
          phone: unFormatPhone(form.phone),
          address:
            (addressSelected?.structured_formatting?.main_text ?? "") +
            "//" +
            (addressSelected?.structured_formatting?.secondary_text ?? ""),
          status: EntityStatus.ACTIVE,
          image: finalImageUrl,
        })
      ).unwrap();

      setIsEditing(false);
    } catch (error) {
      setUploadingImage(false);
      console.error("Failed to update user info:", error);
    }
  };

  const isValid =
    !form.address?.toString().length ||
    !form.fullname?.length ||
    !form.phone?.length ||
    !isValidPhone(form.phone);

  const addressParts = getAddressParts(address);

  return (
    <>
      {/* main card */}
      <div className="bg-white rounded-sm overflow-hidden shadow-sm w-full">
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 border-b">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white flex-shrink-0 shadow">
              <img
                src={image || "/images/avatar-placeholder.png"}
                alt={fullname ?? "avatar"}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg sm:text-sm font-semibold text-gray-800 truncate">
                {fullname ?? ""}
              </h2>

              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}
                >
                  {status === EntityStatus.ACTIVE ? "Active" : "Inactive"}
                </span>
                <span className="text-sm text-gray-500">•</span>
                <p className="text-sm text-gray-500">Premium Member</p>
              </div>
            </div>
          </div>

          {/* actions */}
          <div className="sm:ml-auto flex gap-3 mt-3 sm:mt-0 flex-wrap">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2 bg-black text-white rounded-sm text-sm hover:bg-gray-800"
            >
              Edit
            </button>
          </div>
        </div>

        {/* body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="min-w-0">
            <h3 className="text-sm text-gray-500">Basic information</h3>
            <div className="mt-3 space-y-3 text-gray-700">
              <div className="flex items-center justify-between">
                <span className="font-medium">Full name</span>
                <span className="ml-4 text-right truncate max-w-[200px]">
                  {fullname ?? ""}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Phone</span>
                <a
                  className="ml-4 text-right truncate max-w-[160px] text-blue-600"
                  href={`tel:${phone ?? ""}`}
                >
                  {formatPhone(phone ?? "")}
                </a>
              </div>

              <div className="flex items-start justify-between">
                <span className="font-medium">Address</span>
                <div className="ml-4 text-right text-gray-700 truncate max-w-[240px]">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 line-clamp-1">
                      {addressParts.main}
                    </span>
                    <span className="text-gray-500 text-xs line-clamp-1">
                      {addressParts.secondary}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="text-sm text-gray-500">Activity</h3>
            <div className="mt-3 space-y-3 text-gray-700">
              <div className="bg-gray-50 rounded-sm p-3">
                <p className="text-sm text-gray-500">Orders</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{orderInfo?.numberOfOrder}</p>
              </div>

              <div className="bg-gray-50 rounded-sm p-3">
                <p className="text-sm text-gray-500">Total spent</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">
                  {formatPrice(orderInfo?.totalPrice!)}{currency}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* edit modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsEditing(false)}
          />
          {/* modal */}
          <div className="relative bg-white rounded-sm shadow-xl w-full max-w-md p-6 animate-scaleIn">
            <h3 className="text-lg font-semibold mb-5">Edit customer info</h3>
            <div className="space-y-4">
              {/* avatar edit */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={
                      form.image || image || "/images/avatar-placeholder.png"
                    }
                    alt="Avatar preview"
                    className="w-24 h-24 rounded-full object-cover border shadow"
                  />
                  <label className="absolute bottom-0 right-0 bg-black text-white p-1 rounded-full cursor-pointer hover:opacity-90">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadedImage(file);
                          const localPreview = URL.createObjectURL(file);
                          setForm((prev) => ({ ...prev, image: localPreview }));
                        }
                      }}
                    />
                    {/* plus svg */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Click + to change image
                </p>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Full name
                </label>
                <div className="relative">
                  <input
                    disabled={loadingUser || uploadingImage}
                    type="text"
                    name="fullname"
                    placeholder="Enter your full name"
                    value={form.fullname}
                    onChange={handleChange}
                    className="w-full border rounded-sm px-3 py-2 text-sm outline-none pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {!form.fullname?.length ? (
                      <CloseCircleFilled className="text-red-600" />
                    ) : (
                      <CheckCircleFilled className="text-green-600" />
                    )}
                  </span>
                </div>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium mb-1">Phone</label>
                <div className="relative">
                  <input
                    disabled={loadingUser || uploadingImage}
                    type="text"
                    name="phone"
                    placeholder="Enter your phone"
                    value={formatPhone(form.phone)}
                    onChange={handleChange}
                    className="w-full border rounded-sm px-3 py-2 text-sm outline-none pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {!isValidPhone(form.phone) ? (
                      <CloseCircleFilled className="text-red-600" />
                    ) : (
                      <CheckCircleFilled className="text-green-600" />
                    )}
                  </span>
                </div>
              </div>
              <div className="relative w-full">
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter your address (e.g. 123 Nguyen Trai, Hanoi)"
                    className="w-full border rounded-sm px-3 py-2 text-sm outline-none pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {!form.address.length ? (
                      <CloseCircleFilled className="text-red-600" />
                    ) : (
                      <CheckCircleFilled className="text-green-600" />
                    )}
                  </span>
                </div>

                {form.address?.length > 2 && suggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 z-50 bg-white border rounded-sm shadow mt-1 max-h-40 overflow-y-auto">
                    {suggestions.map((item, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setForm({
                            ...form,
                            address:
                              (item.structured_formatting?.main_text ?? "") +
                              ", " +
                              (item.structured_formatting?.secondary_text ??
                                ""),
                          });
                          setAddressSelected(item);
                          setSuggestions([]);
                        }}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm flex items-center gap-3 transition-colors"
                      >
                        <EnvironmentOutlined className="text-black mt-1" />
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800 line-clamp-1">
                            {item.structured_formatting?.main_text ??
                              item.description}
                          </span>
                          <span className="text-gray-500 text-xs line-clamp-1">
                            {item.structured_formatting?.secondary_text ?? ""}
                          </span>
                        </div>
                      </li>
                    ))}

                    <li
                      onClick={() => {
                        setForm({ ...form, address: form.address });
                        setSuggestions([]);
                      }}
                      className="px-4 py-3 bg-blue-50 hover:bg-blue-100 cursor-pointer text-sm text-blue-700 font-medium flex flex-col gap-1 rounded-b-xl"
                    >
                      <div className="items-center">
                        <div className="flex gap-2">
                          <PlusOutlined />
                          <span>Use the address you entered:</span>
                        </div>

                        <span className="italic break-words whitespace-normal">
                          {form.address}
                        </span>
                      </div>
                    </li>
                  </ul>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                disabled={loadingUser || uploadingImage}
                onClick={() => {
                  setIsEditing(false);
                  setForm({
                    address: address ?? "",
                    fullname: fullname ?? "",
                    image: image ?? "",
                    phone: phone ?? "",
                  });
                }}
                className="px-4 py-2 text-sm border rounded-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                disabled={loadingUser || uploadingImage || isValid}
                onClick={() => handleSave()}
                className={`px-4 py-2 text-sm text-white rounded-sm ${
                  isValid ? "bg-gray-500" : "bg-black hover:opacity-90"
                }`}
              >
                {loadingUser || uploadingImage ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* animation keyframes */}
      <style>{`
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default CustomerInfo;
