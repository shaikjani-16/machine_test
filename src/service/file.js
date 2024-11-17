"use server";

import { v2 as cloud } from "cloudinary";

import streamfier from "streamifier";
cloud.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});
const uploadFileToCloud = async (file, options) => {
  if (file.size <= 0) return;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return new Promise((resolve, reject) => {
    const stream = cloud.uploader.upload_stream({}, (err, res) => {
      if (err) return reject(err.message);
      resolve(res);
    });
    streamfier.createReadStream(buffer).pipe(stream);
  });
};
export const uploadFile = async (formData) => {
  const file = formData.get("profile-image");
  console.log("upload file");

  if (file instanceof File) {
    const res = await uploadFileToCloud(file, {
      width: 300,
      height: 300,
      gravity: "face",
      crop: "fill",
    });
    return res.public_id;
  }
};
