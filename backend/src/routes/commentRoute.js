const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController.js");
const authenticate = require("../middleware/auth.js");
const { validate } = require("../middleware/validate.js");
const {
	addCommentSchema,
	updateCommentSchema,
} = require("../validators/commentValidator.js");

// Get all comments for a card
router.get(
	"/cards/:cardId/comments",
	authenticate,
	commentController.getCommentsForCard
);

// Add a new comment to a card
router.post(
	"/cards/:cardId/comments",
	authenticate,
	validate(addCommentSchema),
	commentController.addComment,
);

// Update a comment (only creator can update)
router.patch("/comments/:id", authenticate, validate(updateCommentSchema), commentController.updateComment);

// Delete a comment (author or admin/owner can delete)
router.delete("/comments/:id", authenticate, commentController.deleteComment);

module.exports = router;
