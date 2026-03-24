const express = require("express");
const router = express.Router();

const labelController = require("../controllers/labelController.js");
const authenticate = require("../middleware/auth.js");
const { validate } = require("../middleware/validate.js");
const {
  createLabelSchema,
  addLabelToCardSchema,
} = require("../validators/labelValidator.js");
const requireRole = require("../middleware/requireRole.js");

// Create a label on a board
router.post(
  "/boards/:boardId/labels",
  authenticate,
  requireRole("editor", "admin", "owner"),
  validate(createLabelSchema),
  labelController.createLabel
);

// Get all labels for a board
router.get(
  "/boards/:boardId/labels",
  authenticate,
  labelController.getBoardLabels
);

// Attach a label to a card
router.post(
  "/cards/:cardId/labels",
  authenticate,
  requireRole("editor", "admin", "owner"),
  validate(addLabelToCardSchema),
  labelController.addLabelToCard
);

// Remove a label from a card
router.delete(
  "/cards/:cardId/labels/:labelId",
  authenticate,
  requireRole("editor", "admin", "owner"),
  labelController.removeLabelFromCard
);

module.exports = router;
