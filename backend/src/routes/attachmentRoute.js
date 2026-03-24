const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth");
const upload = require("../middleware/upload");
const requireBoardRole = require("../middleware/requireRole");

const {
  uploadAttachment,
  getCardAttachments,
  deleteAttachment,
} = require("../controllers/attachmentController");

// Upload file
router.post(
  "/cards/:id/attachments",
  authenticate,
  requireBoardRole("owner", "admin", "editor"),
  upload.single("file"),
  uploadAttachment
);

// Get attachments
router.get(
  "/cards/:id/attachments",
  authenticate,
  getCardAttachments
);

// Delete attachment
router.delete(
  "/attachments/:id",
  authenticate,
  requireBoardRole("owner", "admin"),
  deleteAttachment
);

module.exports = router;