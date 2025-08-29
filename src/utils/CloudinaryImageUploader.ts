export const uploadToCloudinary = async (
  uri: File,
  creatorName: string | undefined,
  folder: string
): Promise<string | null> => {
  try {
    const data = new FormData();
    data.append("file", uri);
    data.append("upload_preset", "reas_image_upload");
    data.append("cloud_name", "dpysbryyk");
    data.append("folder", folder);
    data.append("context", `uploaded_by=${creatorName}`);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dpysbryyk/image/upload`,
      { method: "POST", body: data }
    );
    const json = await response.json();
    return json.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};
