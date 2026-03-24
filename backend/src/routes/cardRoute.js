const express = require("express");
const router = express.Router();

const cardController = require("../controllers/cardController.js");
const authenticate = require("../middleware/auth.js");
const { validate } = require("../middleware/validate.js");
const {
	createCardSchema,
	updateCardSchema,
	moveCardSchema,
} = require("../validators/cardValidator.js");
const requireRole = require("../middleware/requireRole.js");

// Create a card in a specific column
router.post(
	"/columns/:columnId/cards",
	authenticate,
	requireRole("editor", "admin", "owner"),
	validate(createCardSchema),
	cardController.createCard,
);

// Get a single card with related data
router.get("/cards/:id", authenticate, cardController.getCard);

// Update a single card
router.patch("/cards/:id", authenticate, requireRole("editor", "admin", "owner"), validate(updateCardSchema), cardController.updateCard);

// Move card to another column or position
router.patch("/cards/:id/move", authenticate, requireRole("editor", "admin", "owner"), validate(moveCardSchema), cardController.moveCard);

// Delete a single card
router.delete("/cards/:id", authenticate, requireRole("editor", "admin", "owner"), cardController.deleteCard);

module.exports = router;
