const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const uploadDirectory = path.resolve(__dirname, "../../uploads/slides");

fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `${crypto.randomUUID()}${extension}`;

    callback(null, filename);
  },
});

const fileFilter = (_req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (
    !allowedMimeTypes.has(file.mimetype) ||
    !allowedExtensions.has(extension)
  ) {
    return callback(
      new Error("Only JPEG, PNG, and WebP slide images are allowed.")
    );
  }

  callback(null, true);
};

const uploadSlideImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
});

const handleSlideUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message = err.code === "LIMIT_FILE_SIZE"
      ? "Slide image must be 10 MB or smaller."
      : "The slide image upload is invalid.";
    return res.status(400).json({ message });
  }

  if (err.message === "Only JPEG, PNG, and WebP slide images are allowed.") {
    return res.status(400).json({ message: err.message });
  }

  return next(err);
};

module.exports = {
  uploadSlideImage,
  uploadDirectory,
  handleSlideUploadError,
};
