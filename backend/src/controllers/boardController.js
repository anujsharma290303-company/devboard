// ============================================================================
// Dependencies
// ============================================================================

const prismaClient = require("../config/prisma");

// ============================================================================
// Board Controllers
// ============================================================================

/**
 * POST /api/boards
 * Create a new board and automatically add creator as owner
 */
exports.createBoard = async (req, res) => {
  const { name, description, emoji } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  const boardName = name.trim();

  const boardDescription =
    typeof description === "string" && description.trim()
      ? description.trim()
      : null;

  const boardEmoji =
    typeof emoji === "string" && emoji.trim() ? emoji.trim() : undefined;

  const boardData = {
    name: boardName,
    description: boardDescription,
    ownerId: userId,
    members: {
      create: {
        userId,
        role: "owner",
        joinedAt: new Date(),
      },
    },
  };

  // Let Prisma use schema default emoji when client does not provide one.
  if (boardEmoji) {
    boardData.emoji = boardEmoji;
  }

  try {
    const board = await prismaClient.board.create({
      data: boardData,
      include: {
        members: true,
      },
    });

    return res.status(201).json(board);
  } catch (error) {
    console.error("Error creating board:", error);
    next(error);
  }
};

/**
 * GET /api/boards
 * Fetch all boards where user is a member with optional pagination
 * Query params: limit (1-50, default 20), offset (default 0)
 */
exports.getBoards = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  const parsedLimit = Number.parseInt(req.query.limit, 10);
  const parsedOffset = Number.parseInt(req.query.offset, 10);

  const limit = Number.isInteger(parsedLimit)
    ? Math.min(Math.max(parsedLimit, 1), 50)
    : 20;
  const offset = Number.isInteger(parsedOffset) ? Math.max(parsedOffset, 0) : 0;

  try {
    const boards = await prismaClient.board.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: limit,
      skip: offset,
      include: {
        _count: {
          select: { columns: true, members: true },
        },
      },
    });

    return res.status(200).json(boards);
  } catch (error) {
    console.error("Error fetching boards:", error);
    next(error);
  }
};

/**
 * GET /api/boards/:id
 * Fetch a single board by ID with optional nested data
 * Only returns boards where user is a member
 * Query params: columns=true, members=true (default: both included)
 */
exports.getBoardById = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  const boardId = req.params.id?.trim();
  if (!boardId) {
    const error = new Error("Board ID is required");
    error.statusCode = 400;
    throw error;
  }

  // Query params to optionally include nested data
  const includeColumns = req.query.columns === "true";
  const includeMembers = req.query.members === "true";

  const includeData = {};
  if (includeColumns) {
    includeData.columns = {
      orderBy: { position: "asc" },
      include: {
        cards: {
          orderBy: { position: "asc" },
        },
      },
    };
  }
  if (includeMembers) {
    includeData.members = {
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
    };
  }

  // Default behavior: include both columns and members if no query specified
  if (!includeColumns && !includeMembers) {
    includeData.columns = {
      orderBy: { position: "asc" },
      include: {
        cards: {
          orderBy: { position: "asc" },
        },
      },
    };
    includeData.members = {
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
    };
  }

  try {
    const board = await prismaClient.board.findFirst({
      where: {
        id: boardId,
        members: {
          some: { userId },
        },
      },
      include: includeData,
    });

    if (!board) {
      const error = new Error("Board not found");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json(board);
  } catch (error) {
    console.error("Error fetching board:", error);
    next(error);
  }
};

/**
 * DELETE /api/boards/:id
 * Delete a board (owner only)
 * Cascades delete to columns, cards, and board members
 */
exports.deleteBoard = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  const boardId = req.params.id?.trim();
  if (!boardId) {
    const error = new Error("Board ID is required");
    error.statusCode = 400;
    throw error;
  }

  try {
    // Verify user is owner before delete
    const board = await prismaClient.board.findFirst({
      where: {
        id: boardId,
        members: {
          some: {
            userId,
            role: "owner",
          },
        },
      },
    });

    if (!board) {
      const error = new Error("Forbidden: Only board owners can delete");
      error.statusCode = 403;
      throw error;
    }

    // Delete board (cascades delete members, columns, cards)
    await prismaClient.board.delete({
      where: { id: boardId },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting board:", error);
    next(error);
  }
};

/**
 * PATCH /api/boards/:id
 * Update board name, description, or emoji (members with appropriate role)
 * Body: { name?, description?, emoji? }
 */
exports.updateBoard = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  const boardId = req.params.id?.trim();
  if (!boardId) {
    const error = new Error("Board ID is required");
    error.statusCode = 400;
    throw error;
  }

  const { name, description, emoji } = req.body;
  const updateData = {};

  // Prepare update fields (request body is validated by middleware)
  if (name !== undefined) {
    updateData.name = name.trim();
  }
  if (description !== undefined) {
    updateData.description = description.trim() || null;
  }
  if (emoji !== undefined) {
    updateData.emoji = emoji.trim();
  }

  try {
    // Verify user is an owner or admin of the board
    const boardMember = await prismaClient.boardMember.findFirst({
      where: {
        boardId,
        userId,
        role: { in: ["owner", "admin"] },
      },
    });

    if (!boardMember) {
      const error = new Error("Forbidden: Only board owners and admins can update");
      error.statusCode = 403;
      throw error;
    }

    // Update board
    const updatedBoard = await prismaClient.board.update({
      where: { id: boardId },
      data: updateData,
      include: {
        _count: {
          select: { columns: true, members: true },
        },
      },
    });

    return res.status(200).json(updatedBoard);
  } catch (error) {
    console.error("Error updating board:", error);
    next(error);
  }
};
