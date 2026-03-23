const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController.js");
const authenticate = require("../middleware/auth.js");

// Add a new comment to a card
router.post("/cards/:cardId/comments", authenticate, commentController.addComment);

// Update a comment (only creator can update)
router.patch("/comments/:id", authenticate, commentController.updateComment);

// Delete a comment (author or admin/owner can delete)
router.delete("/comments/:id", authenticate, commentController.deleteComment);

module.exports = router;
