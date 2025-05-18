// server/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Configure storage
// For now, we'll use memoryStorage. You might want to save to disk or cloud storage later.
// MemoryStorage stores the file in a buffer in memory.
const storage = multer.memoryStorage();

// File filter to accept only specific file types (e.g., pdf, doc, docx)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('File upload only supports the following filetypes: ' + allowedTypes), false);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: fileFilter,
});

module.exports = upload;