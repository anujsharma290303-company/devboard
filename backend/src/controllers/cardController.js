const prismaClient = require("../config/prisma");

// Helper function to get the next position for a card in a column
const getNextCardPosition = async (columnId) => {
  const lastCard = await prismaClient.card.findFirst({
    where: { columnId },
    orderBy: { position: "desc" },
    select: { position: true },
  });
  return (lastCard?.position ?? 0) + 1;
};

exports.createCard = async (req, res, next) => {
  const columnId = req.params.columnId?.trim();
  const { title, description, priority, dueDate, assigneeId } = req.body;

  // Validation
  if (!columnId) {
    const error = new Error("Column ID is required");
    error.statusCode = 400;
    throw error;
  }
  if (!title || typeof title !== "string" || !title.trim()) {
    const error = new Error("Card title is required");
    error.statusCode = 400;
    throw error;
  }

  // Get user ID from authenticated request
  const userId = req.user?.id;
  if (!userId) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  try {
    // Verify column exists and get its board
    const column = await prismaClient.column.findUnique({
      where: { id: columnId },
      select: { boardId: true },
    });

    if (!column) {
      const error = new Error("Column not found");
      error.statusCode = 404;
      throw error;
    }

    const boardId = column.boardId;

    // Validate assignee when provided to avoid foreign key errors
    if (assigneeId) {
      const assignee = await prismaClient.user.findUnique({
        where: { id: assigneeId },
        select: { id: true },
      });

      if (!assignee) {
        const error = new Error("Invalid assigneeId: user does not exist");
        error.statusCode = 400;
        throw error;
      }

      const assigneeMembership = await prismaClient.boardMember.findFirst({
        where: {
          boardId,
          userId: assigneeId,
        },
        select: { id: true },
      });

      if (!assigneeMembership) {
        const error = new Error("Invalid assigneeId: user is not a member of this board");
        error.statusCode = 400;
        throw error;
      }
    }

    // Get next position for the card
    const nextPosition = await getNextCardPosition(columnId);

    // Validate and normalize priority
    const validPriorities = ["low", "medium", "high"];
    const normalizedPriority = priority ? priority.toLowerCase() : "medium";

    if (!validPriorities.includes(normalizedPriority)) {
      const error = new Error(`Invalid priority. Must be one of: ${validPriorities.join(", ")}`);
      error.statusCode = 400;
      throw error;
    }

    // Create the card with all required fields
    const newCard = await prismaClient.card.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        columnId,
        position: nextPosition,
        priority: normalizedPriority,
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId: assigneeId || null,
        createdById: userId, // REQUIRED FIELD - set to authenticated user
      },
      include: {
        column: true,
        assignee: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json(newCard);
  } catch (error) {
    console.error("Error creating card:", error);
    next(error);
  }
};

exports.getCard = async (req, res) => {
  const cardId = req.params.id?.trim();
  if (!cardId) {
    return res.status(400).json({ message: "Card ID is required" });
  }

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // First, get card with minimal data to check board membership
    const cardBasic = await prismaClient.card.findUnique({
      where: { id: cardId },
      select: {
        column: {
          select: {
            boardId: true,
          },
        },
      },
    });

    if (!cardBasic) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Check if user is a member of the board BEFORE fetching full data
    const boardMember = await prismaClient.boardMember.findFirst({
      where: {
        boardId: cardBasic.column.boardId,
        userId,
      },
      select: { id: true },
    });

    if (!boardMember) {
      return res.status(403).json({
        message: "Forbidden: Only board members can view cards",
      });
    }

    // User is authorized, now fetch full card with all relations
    const card = await prismaClient.card.findUnique({
      where: { id: cardId },
      include: {
        column: {
          select: {
            id: true,
            title: true,
            boardId: true,
          },
        },
        assignee: {
          select: {
            id: true,
            displayName: true,
            email: true,
            avatarPath: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            displayName: true,
            email: true,
            avatarPath: true,
          },
        },
        cardLabel: {
          include: {
            label: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
        comment: {
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
          orderBy: {
            createdAt: "asc",
          },
        },
        attachment: {
          include: {
            uploadedBy: {
              select: {
                id: true,
                displayName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json(card);
  } catch (error) {
    console.error("Error fetching card:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateCard = async (req, res) => {
  const cardId = req.params.id?.trim();
  if (!cardId) {
    return res.status(400).json({ message: "Card ID is required" });
  }

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title, description, priority, dueDate, assigneeId } = req.body;

  try {
    // Get card and verify board membership
    const cardBasic = await prismaClient.card.findUnique({
      where: { id: cardId },
      select: {
        column: {
          select: {
            boardId: true,
          },
        },
      },
    });

    if (!cardBasic) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Build update data object with only provided fields
    const updateData = {};

    if (title !== undefined) {
      if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ message: "Card title is required and must be a non-empty string" });
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    if (priority !== undefined) {
      const validPriorities = ["low", "medium", "high"];
      const normalizedPriority = priority.toLowerCase();
      if (!validPriorities.includes(normalizedPriority)) {
        return res.status(400).json({
          message: `Invalid priority. Must be one of: ${validPriorities.join(", ")}`,
        });
      }
      updateData.priority = normalizedPriority;
    }

    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    }

    if (assigneeId !== undefined) {
      if (assigneeId) {
        const assignee = await prismaClient.user.findUnique({
          where: { id: assigneeId },
          select: { id: true },
        });

        if (!assignee) {
          return res.status(400).json({
            message: "Invalid assigneeId: user does not exist",
          });
        }

        const assigneeMembership = await prismaClient.boardMember.findFirst({
          where: {
            boardId: cardBasic.column.boardId,
            userId: assigneeId,
          },
          select: { id: true },
        });

        if (!assigneeMembership) {
          return res.status(400).json({
            message: "Invalid assigneeId: user is not a member of this board",
          });
        }
      }

      updateData.assigneeId = assigneeId || null;
    }

    // If no fields to update, return error
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updatedCard = await prismaClient.card.update({
      where: { id: cardId },
      data: updateData,
      include: {
        column: true,
        assignee: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json(updatedCard);
  } catch (error) {
    console.error("Error updating card:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.moveCard = async (req, res) => {
  const cardId = req.params.id?.trim();
  const targetColumnId = req.body?.targetColumnId?.trim?.() ?? req.body?.targetColumnId;
  const position = req.body?.position;

  if (!cardId) {
    return res.status(400).json({ message: "Card ID is required" });
  }
  if (!targetColumnId) {
    return res.status(400).json({ message: "Target column ID is required" });
  }
  if (position === undefined || position < 0) {
    return res.status(400).json({ message: "Valid position is required" });
  }

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    console.info("[MOVE_CARD] Request received", {
      cardId,
      targetColumnId,
      position,
      userId,
    });

    // Get current card
    const card = await prismaClient.card.findUnique({
      where: { id: cardId },
      select: {
        id: true,
        title: true,
        columnId: true,
        column: {
          select: {
            boardId: true,
          },
        },
      },
    });

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Verify user is board member
    const boardMember = await prismaClient.boardMember.findFirst({
      where: {
        boardId: card.column.boardId,
        userId,
      },
      select: { id: true },
    });

    if (!boardMember) {
      return res.status(403).json({
        message: "Forbidden: Only board members can move cards",
      });
    }

    // Verify target column exists and belongs to the same board
    const targetColumn = await prismaClient.column.findUnique({
      where: { id: targetColumnId },
      select: { boardId: true },
    });

    if (!targetColumn) {
      return res.status(404).json({ message: "Target column not found" });
    }

    if (targetColumn.boardId !== card.column.boardId) {
      return res.status(400).json({
        message: "Cannot move card to a column on a different board",
      });
    }

    await prismaClient.$transaction(async (tx) => {
      const sourceCards = await tx.card.findMany({
        where: { columnId: card.columnId },
        select: { id: true },
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      });

      const sourceIds = sourceCards
        .map((sourceCard) => sourceCard.id)
        .filter((sourceCardId) => sourceCardId !== cardId);

      if (card.columnId === targetColumnId) {
        const insertIndex = Math.max(0, Math.min(position, sourceIds.length));
        const reorderedIds = [
          ...sourceIds.slice(0, insertIndex),
          cardId,
          ...sourceIds.slice(insertIndex),
        ];

        await Promise.all(
          reorderedIds.map((id, index) =>
            tx.card.update({
              where: { id },
              data: { position: index },
            }),
          ),
        );

        return;
      }

      const destinationCards = await tx.card.findMany({
        where: { columnId: targetColumnId },
        select: { id: true },
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      });

      const destinationIds = destinationCards.map((destinationCard) => destinationCard.id);
      const insertIndex = Math.max(0, Math.min(position, destinationIds.length));

      const reorderedDestinationIds = [
        ...destinationIds.slice(0, insertIndex),
        cardId,
        ...destinationIds.slice(insertIndex),
      ];

      await tx.card.update({
        where: { id: cardId },
        data: { columnId: targetColumnId },
      });

      await Promise.all(
        sourceIds.map((id, index) =>
          tx.card.update({
            where: { id },
            data: { position: index },
          }),
        ),
      );

      await Promise.all(
        reorderedDestinationIds.map((id, index) =>
          tx.card.update({
            where: { id },
            data: { position: index },
          }),
        ),
      );
    });

    const movedCard = await prismaClient.card.findUnique({
      where: { id: cardId },
      include: {
        column: true,
        assignee: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
    });

    console.info("[MOVE_CARD] Move persisted", {
      cardId,
      fromColumnId: card.columnId,
      toColumnId: targetColumnId,
      requestedPosition: position,
      finalPosition: movedCard?.position,
    });

    return res.status(200).json(movedCard);
  } catch (error) {
    console.error("Error moving card:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCard = async (req, res) => {
  const cardId = req.params.id?.trim();
  if (!cardId) {
    return res.status(400).json({ message: "Card ID is required" });
  }

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Get card and verify board membership
    const card = await prismaClient.card.findUnique({
      where: { id: cardId },
      select: {
        column: {
          select: {
            boardId: true,
          },
        },
      },
    });

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    const boardMember = await prismaClient.boardMember.findFirst({
      where: {
        boardId: card.column.boardId,
        userId,
      },
      select: { role: true },
    });

    if (!boardMember) {
      return res.status(403).json({
        message: "Forbidden: Only board members can delete cards",
      });
    }

    // Check if user has permission to delete (owner, admin, editor can delete)
    const allowedRoles = ["owner", "admin", "editor"];
    if (!allowedRoles.includes(boardMember.role)) {
      return res.status(403).json({
        message: "Forbidden: Viewers cannot delete cards",
      });
    }

    // Delete the card (cascade will handle comments, attachments, cardLabels)
    await prismaClient.card.delete({
      where: { id: cardId },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting card:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
