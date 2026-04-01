const prismaClient = require("../config/prisma");

const getNextColumnPosition = async (boardId) => {
  const lastColumn = await prismaClient.column.findFirst({
    where: { boardId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  return lastColumn ? lastColumn.position + 1 : 1;
};

exports.createColumn = async (req, res, next) => {
  const boardId = req.params.boardId?.trim();
  if (!boardId) {
    const error = new Error("Board ID is required");
    error.statusCode = 400;
    throw error;
  }

  const { title } = req.body;
  if (!title || typeof title !== "string" || !title.trim()) {
    const error = new Error("Column title is required");
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
    const nextPosition = await getNextColumnPosition(boardId);

    const newColumn = await prismaClient.column.create({
      data: {
        title: title.trim(),
        position: nextPosition,
        boardId,
      },
    });

    return res.status(201).json(newColumn);
  } catch (error) {
    console.error("Error creating column:", error);
    next(error);
  }
};


exports.updateColumn = async (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  const columnId = req.params.id?.trim();
  if (!columnId) {
    const error = new Error("Column ID is required");
    error.statusCode = 400;
    throw error;
  }

  const { title } = req.body;
  if (typeof title !== "string" || !title.trim()) {
    const error = new Error("Column title is required");
    error.statusCode = 400;
    throw error;
  }

  try {
    const column = await prismaClient.column.findUnique({
      where: { id: columnId },
      select: { id: true, boardId: true },
    });

    if (!column) {
      const error = new Error("Column not found");
      error.statusCode = 404;
      throw error;
    }

    const updatedColumn = await prismaClient.column.update({
      where: { id: columnId },
      data: {
        title: title.trim(),
      },
    });

    return res.status(200).json(updatedColumn);
  } catch (error) {
    console.error("Error updating column:", error);
    next(error);
  }
};


exports.deleteColumn = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  const columnId = req.params.id?.trim();
  if (!columnId) {
    const error = new Error("Column ID is required");
    error.statusCode = 400;
    throw error;
  }

  try {
    const column = await prismaClient.column.findUnique({
      where: { id: columnId },
      select: { id: true, boardId: true },
    });

    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    const boardMember = await prismaClient.boardMember.findFirst({
      where: {
        boardId: column.boardId,
        userId,
        role: { in: ["owner", "admin"] },
      },
      select: { id: true },
    });

    if (!boardMember) {
      return res.status(403).json({
        message: "Forbidden: Only board owners or admins can delete columns",
      });
    }

    // Deleting the column cascades related cards per Prisma schema relation.
    await prismaClient.column.delete({
      where: { id: columnId },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting column:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.reorderColumns = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { columns } = req.body;

  if (!Array.isArray(columns) || columns.length === 0) {
    return res.status(400).json({ message: "columns array is required" });
  }

  const hasInvalidItem = columns.some(
    (item) =>
      !item ||
      typeof item.id !== "string" ||
      !item.id.trim() ||
      !Number.isInteger(item.position),
  );

  if (hasInvalidItem) {
    return res.status(400).json({ message: "Each column must include valid id and integer position" });
  }

  try {
    const columnIds = columns.map((item) => item.id.trim());

    const existingColumns = await prismaClient.column.findMany({
      where: { id: { in: columnIds } },
      select: { id: true, boardId: true },
    });

    if (existingColumns.length !== columnIds.length) {
      return res.status(404).json({ message: "One or more columns were not found" });
    }

    const boardIds = [...new Set(existingColumns.map((column) => column.boardId))];
    if (boardIds.length !== 1) {
      return res.status(400).json({ message: "All columns must belong to the same board" });
    }

    const boardId = boardIds[0];
    const boardMember = await prismaClient.boardMember.findFirst({
      where: {
        boardId,
        userId,
      },
      select: { id: true },
    });

    if (!boardMember) {
      return res.status(403).json({ message: "Forbidden: Only board members can reorder columns" });
    }

    await prismaClient.$transaction(
      columns.map((item) =>
        prismaClient.column.update({
          where: { id: item.id.trim() },
          data: { position: item.position },
        }),
      ),
    );

    return res.status(200).json({ message: "Columns reordered successfully" });
  } catch (error) {
    console.error("Error reordering columns:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



