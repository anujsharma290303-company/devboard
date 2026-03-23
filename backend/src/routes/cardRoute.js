const express = require("express");
const router = express.Router();

const cardController = require("../controllers/cardController.js");
const authenticate = require("../middleware/auth.js");

// Create a card in a specific column
router.post("/columns/:columnId/cards", authenticate, cardController.createCard);

// Get a single card with related data
router.get("/cards/:id", authenticate, cardController.getCard);

// Update a single card
router.patch("/cards/:id", authenticate, cardController.updateCard);

// Move card to another column or position
router.patch("/cards/:id/move", authenticate, cardController.moveCard);

// Delete a single card
router.delete("/cards/:id", authenticate, cardController.deleteCard);

module.exports = router;
