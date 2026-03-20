// ============================================================================
// Dependencies
// ============================================================================

const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController.js");
const authenticate = require("../middleware/auth.js");

// ============================================================================
// Board Routes - All Protected with Authentication
// ============================================================================

/**
 * GET /api/boards
 * Fetch all boards where user is a member
 * Headers: Authorization: Bearer <accessToken>
 * Query: limit?, offset?
 */
router.get("/", authenticate, boardController.getBoards);

/**
 * POST /api/boards
 * Create a new board and automatically add creator as owner
 * Headers: Authorization: Bearer <accessToken>
 * Body: { name, description?, emoji? }
 */
router.post("/", authenticate, boardController.createBoard);

/**
 * GET /api/boards/:id
 * Fetch a single board by ID with optional nested data
 * Headers: Authorization: Bearer <accessToken>
 * Query: columns?, members?
 */
router.get("/:id", authenticate, boardController.getBoardById);

/**
 * PATCH /api/boards/:id
 * Update board (owner and admin only)
 * Headers: Authorization: Bearer <accessToken>
 * Body: { name?, description?, emoji? }
 */
router.patch("/:id", authenticate, boardController.updateBoard);

/**
 * DELETE /api/boards/:id
 * Delete a board (owner only)
 * Headers: Authorization: Bearer <accessToken>
 */
router.delete("/:id", authenticate, boardController.deleteBoard);

module.exports = router;
