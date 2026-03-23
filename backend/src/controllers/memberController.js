const crypto = require("crypto");
const prismaClient = require("../config/prisma");

exports.inviteMember = async (req, res) => {
  const boardId = req.params.boardId?.trim();
  const { email, role } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!boardId) {
    return res.status(400).json({ message: "Board ID is required" });
  }

  if (!email || typeof email !== "string" || !email.trim()) {
    return res.status(400).json({ message: "Email is required" });
  }

  const allowedRoles = ["admin", "editor", "viewer"];
  const normalizedRole = typeof role === "string" ? role.toLowerCase() : "";
  if (!allowedRoles.includes(normalizedRole)) {
    return res.status(400).json({
      message: `Invalid role. Must be one of: ${allowedRoles.join(", ")}`,
    });
  }

  try {
    // Verify inviter is owner or admin
    const inviter = await prismaClient.boardMember.findFirst({
      where: {
        boardId,
        userId,
        role: { in: ["owner", "admin"] },
      },
      select: { id: true },
    });

    if (!inviter) {
      return res.status(403).json({
        message: "Forbidden: Only board owners and admins can invite members",
      });
    }

    // Check email is not already a member
    const userToInvite = await prismaClient.user.findUnique({
      where: { email: email.trim() },
      select: { id: true },
    });

    if (userToInvite) {
      const existingMember = await prismaClient.boardMember.findFirst({
        where: {
          boardId,
          userId: userToInvite.id,
        },
        select: { id: true },
      });

      if (existingMember) {
        return res.status(409).json({
          message: "User with this email is already a board member",
        });
      }
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await prismaClient.inviteToken.create({
      data: {
        boardId,
        email: email.trim().toLowerCase(),
        role: normalizedRole,
        token,
        expiresAt,
        createdById: userId,
      },
    });

    return res.status(201).json({ token, expiresAt });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.acceptInvite = async (req, res) => {
  const token = req.params.token?.trim();
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!token) {
    return res.status(400).json({ message: "Invitation token is required" });
  }

  try {
    const currentUser = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const invite = await prismaClient.inviteToken.findUnique({
      where: { token },
      select: {
        id: true,
        boardId: true,
        email: true,
        role: true,
        used: true,
        expiresAt: true,
      },
    });

    if (!invite) {
      return res.status(404).json({ message: "Invite token not found" });
    }

    // Check invite not expired
    if (invite.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invitation token has expired" });
    }

    // Check invite not already used
    if (invite.used) {
      return res
        .status(400)
        .json({ message: "Invitation token has already been used" });
    }

    // Check logged-in user email matches invite email
    if (invite.email.toLowerCase() !== currentUser.email.toLowerCase()) {
      return res.status(403).json({
        message: "This invitation token is not for your email address",
      });
    }

    const existingMember = await prismaClient.boardMember.findFirst({
      where: {
        boardId: invite.boardId,
        userId,
      },
      select: { id: true },
    });

    if (existingMember) {
      return res
        .status(409)
        .json({ message: "You are already a member of this board" });
    }

    // Create membership and mark invite as used atomically
    await prismaClient.$transaction([
      prismaClient.boardMember.create({
        data: {
          boardId: invite.boardId,
          userId,
          role: invite.role,
          joinedAt: new Date(),
        },
      }),
      prismaClient.inviteToken.update({
        where: { id: invite.id },
        data: { used: true },
      }),
    ]);

    return res.status(200).json({ message: "Invite accepted successfully" });
  } catch (error) {
    console.error("Error accepting invite:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getMembers = async (req, res) => {
  const boardId = req.params.boardId?.trim();
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!boardId) {
    return res.status(400).json({ message: "Board ID is required" });
  }

  try {
    // Verify requester is a board member
    const boardMember = await prismaClient.boardMember.findFirst({
      where: {
        boardId,
        userId,
      },
      select: { id: true },
    });

    if (!boardMember) {
      return res.status(403).json({
        message: "Forbidden: You are not a member of this board",
      });
    }

    const members = await prismaClient.boardMember.findMany({
      where: { boardId },
      orderBy: { invitedAt: "asc" },
      select: {
        id: true,
        role: true,
        joinedAt: true,
        invitedAt: true,
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
            avatarPath: true,
          },
        },
      },
    });

    return res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching board members:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateMemberRole = async (req, res) => {
  const boardId = req.params.boardId?.trim();
  const targetUserId = req.params.userId?.trim();
  const { role } = req.body;
  const requesterUserId = req.user?.id;

  if (!requesterUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!boardId || !targetUserId) {
    return res.status(400).json({ message: "Board ID and target user ID are required" });
  }

  const allowedRoles = ["admin", "editor", "viewer"];
  const normalizedRole = typeof role === "string" ? role.toLowerCase() : "";
  if (!allowedRoles.includes(normalizedRole)) {
    return res.status(400).json({
      message: `Invalid role. Must be one of: ${allowedRoles.join(", ")}`,
    });
  }

  try {
    // Only owner can change member roles
    const requesterMembership = await prismaClient.boardMember.findFirst({
      where: {
        boardId,
        userId: requesterUserId,
        role: "owner",
      },
      select: { id: true },
    });

    if (!requesterMembership) {
      return res.status(403).json({
        message: "Forbidden: Only board owners can update member roles",
      });
    }

    const targetMembership = await prismaClient.boardMember.findFirst({
      where: {
        boardId,
        userId: targetUserId,
      },
      select: { id: true, role: true },
    });

    if (!targetMembership) {
      return res.status(404).json({ message: "Target member not found" });
    }

    // Cannot change owner role
    if (targetMembership.role === "owner") {
      return res.status(400).json({
        message: "Cannot change the owner role",
      });
    }

    const updatedMember = await prismaClient.boardMember.update({
      where: { id: targetMembership.id },
      data: { role: normalizedRole },
      select: {
        id: true,
        boardId: true,
        userId: true,
        role: true,
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
            avatarPath: true,
          },
        },
      },
    });

    return res.status(200).json(updatedMember);
  } catch (error) {
    console.error("Error updating member role:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.removeMember = async (req, res) => {
  const boardId = req.params.boardId?.trim();
  const targetUserId = req.params.userId?.trim();
  const requesterUserId = req.user?.id;

  if (!requesterUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!boardId || !targetUserId) {
    return res.status(400).json({ message: "Board ID and target user ID are required" });
  }

  try {
    // Only owner/admin can remove members
    const requesterMembership = await prismaClient.boardMember.findFirst({
      where: {
        boardId,
        userId: requesterUserId,
        role: { in: ["owner", "admin"] },
      },
      select: { id: true, role: true },
    });

    if (!requesterMembership) {
      return res.status(403).json({
        message: "Forbidden: Only board owners or admins can remove members",
      });
    }

    const targetMembership = await prismaClient.boardMember.findFirst({
      where: {
        boardId,
        userId: targetUserId,
      },
      select: { id: true, role: true },
    });

    if (!targetMembership) {
      return res.status(404).json({ message: "Target member not found" });
    }

    // Cannot remove board owner
    if (targetMembership.role === "owner") {
      return res.status(400).json({
        message: "Cannot remove the board owner",
      });
    }

    await prismaClient.boardMember.delete({
      where: { id: targetMembership.id },
    });

    return res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Error removing member:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
