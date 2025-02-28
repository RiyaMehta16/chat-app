//configuring cloudinary so that we can use it in this folder anywhere
import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();
//all of this from cloudinary.com , our project

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
