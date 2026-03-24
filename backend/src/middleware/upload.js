const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up multer storage configuration

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const cardId = req.params.cardId;

    if (!cardId) {
      return cb(new Error("Card ID is required in the URL"), null);
    }
    const dr = path.join("uploads", "cards", cardId || "temp");
    // Ensure the card-specific directory exists
    if (!fs.existsSync(dr)) {
      fs.mkdirSync(dr, { recursive: true });
    }
    cb(null, dr);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "text/plain ",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

module.exports = upload;
