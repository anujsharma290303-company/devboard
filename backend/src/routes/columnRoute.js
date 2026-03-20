const express = require("express");
const router = express.Router();

const columnController = require("../controllers/columnController.js");
const authenticate = require("../middleware/auth.js");

// Create a column for a board
router.post("/boards/:boardId/columns", authenticate, columnController.createColumn);

// Batch reorder columns
router.patch("/columns/reorder", authenticate, columnController.reorderColumns);

// Update a single column title
router.patch("/columns/:id", authenticate, columnController.updateColumn);

// Delete a single column
router.delete("/columns/:id", authenticate, columnController.deleteColumn);

module.exports = router;
