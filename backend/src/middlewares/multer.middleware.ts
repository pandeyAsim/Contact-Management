import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import appRootPath from "app-root-path";
import { ApiError } from "../utils";
import FileStorageDirectory from "../enums/FileStorageDirectory.enum";

// App root directory path. for example: /home/user/my-app
export const rootDir = appRootPath.path;

//get uploads directory path
export const uploadsDir = path.join(rootDir, FileStorageDirectory.UPLOADS);

/**
 * @function uploadImageFileMiddleware
 * @description Middleware to upload image files
 * @param {Object} options - Options object
 * @param {FileStorageDirectory} options.directory - File storage directory
 * @param {number} options.sizeInMb - Maximum file size in MB
 * @returns {multer.Multer} - Multer object
 * @example
 * import { uploadImageFileMiddleware } from "@/middlewares/multer.middleware";
 * import { FileStorageDirectory } from "@/enums";
 * router.post(
 *  "/upload",
 * uploadImageFileMiddleware({
 *   directory: FileStorageDirectory.PROFILE_PICTURE,
 *  sizeInMb: 2,
 * }).single("image"),
 * async (req, res) => {
 *      res.send("File uploaded successfully");
 * });
 */
export const uploadImageFileMiddleware = ({
  directory,
  sizeInMb = 10,
}: {
  directory: string;
  sizeInMb?: number;
}): multer.Multer => {
  const upload = multer({
    storage: multerDiskStorage(directory),
    limits: {
      fileSize: sizeInMb * 1024 * 1024,
    },
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback
    ) => {
      console.log('File received:', {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype
      });
      
      if (file.mimetype.startsWith("image")) {
        cb(null, true);
      } else {
        cb(
          new ApiError({
            status: 400,
            message: "Only images are allowed!",
            errors: [
              {
                [file.fieldname]: "Only images are allowed!",
              },
            ],
          })
        );
      }
    },
  });

  // Add error handling
  return upload;
};

export const uploadFileMiddleware = ({
  directory,
  sizeInMb = 30,
}: {
  directory: string;
  sizeInMb?: number;
}): multer.Multer => {
  return multer({
    storage: multerDiskStorage(directory),
    limits: {
      fileSize: sizeInMb * 1024 * 1024,
    },
  });
};

export const multerDiskStorage = (directory: string): multer.StorageEngine => {
  return multer.diskStorage({
    destination: async function (req, file, cb) {
      try {
        const fullPath = path.join(uploadsDir, directory);

        if (!(await fs.promises.stat(fullPath).catch(() => false))) {
          await fs.promises.mkdir(fullPath, { recursive: true });
        }
        cb(null, fullPath);
      } catch (err: any) {
        cb(err.message, "");
      }
    },
    filename: function (req, file, cb) {
      try {
        const fileName = uuidv4();
        cb(null, fileName + path.extname(file.originalname));
      } catch (err: any) {
        cb(err.message, "");
      }
    },
  });
};
