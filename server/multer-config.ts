import multer from "multer";

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Store files in memory
const storage = multer.memoryStorage();

// Configure multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: (_req, file, cb) => {
    // Allow all file types
    cb(null, true);
  }
});
