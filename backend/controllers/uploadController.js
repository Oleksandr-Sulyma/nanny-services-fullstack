import { cloudinary } from "../config/cloudinary.js";

const uploadBufferToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    stream.end(buffer);
  });

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      "nanny-services/avatars",
    );

    res.status(201).json({
      message: "Avatar uploaded successfully",
      data: {
        url: result.secure_url,
      },
    });
  } catch (error) {
    next(error);
  }
};