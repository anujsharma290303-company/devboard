const express = require("express");
const router = express.Router();

const memberController = require("../controllers/memberController.js");
const authenticate = require("../middleware/auth.js");
const { validate } = require("../middleware/validate.js");
const {
  inviteMemberSchema,
  updateMemberRoleSchema,
} = require("../validators/memberValidator.js");

// Invite a user to board
router.post(
  "/boards/:boardId/invite",
  authenticate,
  validate(inviteMemberSchema),
  memberController.inviteMember
);

// Accept invite token
router.post("/invites/:token/accept", authenticate, memberController.acceptInvite);

// Get all board members
router.get("/boards/:boardId/members", authenticate, memberController.getMembers);

// Update board member role (owner only)
router.put(
  "/boards/:boardId/members/:userId",
  authenticate,
  validate(updateMemberRoleSchema),
  memberController.updateMemberRole
);

// Remove board member (owner/admin)
router.delete(
  "/boards/:boardId/members/:userId",
  authenticate,
  memberController.removeMember,
);

module.exports = router;
