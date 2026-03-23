const express = require("express");
const router = express.Router();

const columnController = require("../controllers/columnController.js");
const authenticate = require("../middleware/auth.js");
const { validate } = require("../middleware/validate.js");
const {
	createColumnSchema,
	updateColumnSchema,
	reorderColumnsSchema,
} = require("../validators/columnValidator.js");

// Create a column for a board
router.post(
	"/boards/:boardId/columns",
	authenticate,
	validate(createColumnSchema),
	columnController.createColumn,
);

// Batch reorder columns
router.patch(
	"/columns/reorder",
	authenticate,
	validate(reorderColumnsSchema),
	columnController.reorderColumns,
);

// Update a single column title
router.patch("/columns/:id", authenticate, validate(updateColumnSchema), columnController.updateColumn);

// Delete a single column
router.delete("/columns/:id", authenticate, columnController.deleteColumn);

module.exports = router;
