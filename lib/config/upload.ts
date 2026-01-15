import cloudinary from "./cloudinary";

export const uploadToCloudinary = (fileBuffer: Buffer, folder: string) => {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },

      (error, result) => {
        if (error) return reject(error);

        resolve(result?.secure_url || "");
      }
    );

    stream.end(fileBuffer);
  });
};
