const prismaClient = require("../config/prisma");

/**
 * POST /api/cards/:cardId/comments
 * Add a new comment to a card
 * Headers: Authorization: Bearer <accessToken>
 * Body: { content, parentId? }
 */
exports.addComment = async (req, res) => {
  const cardId = req.params.cardId?.trim();
  const { content, parentId } = req.body;

  if (!cardId) {
    const error = new Error("Card ID is required");
    error.statusCode = 400;
    throw error;
  }
  if (!content || typeof content !== "string" || !content.trim()) {
    const error = new Error("Comment content is required");
    error.statusCode = 400;
    throw error;
  }

  const userId = req.user?.id;
  if (!userId) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  try {
    // Verify card exists and get its board
    const card = await prismaClient.card.findUnique({
      where: { id: cardId },
      select: {
        id: true,
        column: {
          select: {
            boardId: true,
          },
        },
      },
    });

    if (!card) {
      const error = new Error("Card not found");
      error.statusCode = 404;
      throw error;
    }

    const boardId = card.column.boardId;

    // Verify user is a member of the board
    const boardMember = await prismaClient.boardMember.findFirst({
      where: {
        boardId,
        userId,
      },
      select: { id: true },
    });

    if (!boardMember) {
      const error = new Error("Forbidden: Only board members can add comments");
      error.statusCode = 403;
      throw error;
    }

    // If parentId provided, verify it exists and belongs to the same card
    if (parentId) {
      const parentComment = await prismaClient.comment.findUnique({
        where: { id: parentId },
        select: { cardId: true },
      });

      if (!parentComment) {
        const error = new Error("Parent comment not found");
        error.statusCode = 404;
        throw error;
      }

      if (parentComment.cardId !== cardId) {
        const error = new Error("Parent comment must belong to the same card");
        error.statusCode = 400;
        throw error;
      }
    }

    // Create the comment
    const newComment = await prismaClient.comment.create({
      data: {
        content: content.trim(),
        cardId,
        userId,
        parentId: parentId || null,
      },
      include: {
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

    return res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    next(error);
  }
};

/**
 * PATCH /api/comments/:id
 * Update a comment (only creator can update)
 * Headers: Authorization: Bearer <accessToken>
 * Body: { content }
 */
exports.updateComment = async (req, res) => {
  const commentId = req.params.id?.trim();
  const { content } = req.body;

  if (!commentId) {
    return res.status(400).json({ message: "Comment ID is required" });
  }
  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ message: "Comment content is required" });
  }

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Get comment and verify ownership
    const comment = await prismaClient.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        userId: true,
        cardId: true,
        card: {
          select: {
            column: {
              select: {
                boardId: true,
              },
            },
          },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only the comment creator can update
    if (comment.userId !== userId) {
      return res.status(403).json({
        message: "Forbidden: You can only edit your own comments",
      });
    }

    // Verify user is still a board member
    const boardMember = await prismaClient.boardMember.findFirst({
      where: {
        boardId: comment.card.column.boardId,
        userId,
      },
      select: { id: true },
    });

    if (!boardMember) {
      return res.status(403).json({
        message: "Forbidden: You are not a member of this board",
      });
    }

    // Update the comment
    const updatedComment = await prismaClient.comment.update({
      where: { id: commentId },
      data: {
        content: content.trim(),
      },
      include: {
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

    return res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/comments/:id
 * Delete a comment (author or admin/owner can delete)
 * Headers: Authorization: Bearer <accessToken>
 */
exports.deleteComment = async (req, res) => {
  const commentId = req.params.id?.trim();

  if (!commentId) {
    return res.status(400).json({ message: "Comment ID is required" });
  }

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Get comment and verify ownership
    const comment = await prismaClient.comment.findUnique({
      where: { id: commentId },
      select: {
        userId: true,
        card: {
          select: {
            column: {
              select: {
                boardId: true,
              },
            },
          },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Verify user is still a board member
    const boardMember = await prismaClient.boardMember.findFirst({
      where: {
        boardId: comment.card.column.boardId,
        userId,
      },
      select: { role: true },
    });

    if (!boardMember) {
      return res.status(403).json({
        message: "Forbidden: You are not a member of this board",
      });
    }

    // Check if user is author or admin/owner
    const isAuthor = comment.userId === userId;
    const isAdminOrOwner = ["owner", "admin"].includes(boardMember.role);

    if (!isAuthor && !isAdminOrOwner) {
      return res.status(403).json({
        message: "Forbidden: Only the author or board admins can delete this comment",
      });
    }

    // Delete the comment (cascade should handle reply cleanup if needed)
    await prismaClient.comment.delete({
      where: { id: commentId },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
