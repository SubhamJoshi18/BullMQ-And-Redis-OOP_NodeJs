import { supportedMimes } from "../config/fileSystem.js";
import { v4 as uuidv4 } from "uuid";
import fs from "node:fs";
export const imageValidator = (size, mime) => {
  if (bytesToMb(size) > 5) {
    return "Image Size Must Be Less Than 5 MB";
  } else if (!supportedMimes.includes(mime)) {
    return "MimeType Is Not Supported, Image must be Type of png, svg , jpeg, gif, webp, jpg";
  } else {
    return null;
  }
};

export const bytesToMb = (bytes) => {
  return bytes / (1024 * 1024);
};

export const generateUniqueName = () => {
  return uuidv4();
};

export const removeImage = (imageName) => {
  const path = process.cwd() + "/src/image/newsImage/" + imageName;
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};
