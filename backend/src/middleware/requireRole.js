const prismaClient = require("../config/prisma");

function requireBoardRole(...allowedRoles) {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      let boardId = null;

      // ✅ Case 1: Direct boardId
      if (req.params.boardId) {
        boardId = req.params.boardId;
      }

      // ✅ Case 2: cardId → column → board
      else if (req.params.cardId) {
        const card = await prismaClient.card.findUnique({
          where: { id: req.params.cardId },
          include: {
            column: {
              select: { boardId: true },
            },
          },
        });

        if (!card) {
          return res.status(404).json({ message: "Card not found" });
        }

        boardId = card.column.boardId;
      }

      // ✅ Case 3: columnId or id → column → board
      else if (req.params.columnId || req.params.id) {
        const columnId = req.params.columnId || req.params.id;

        const column = await prismaClient.column.findUnique({
          where: { id: columnId },
          select: { boardId: true },
        });

        if (!column) {
          return res.status(404).json({ message: "Column not found" });
        }

        boardId = column.boardId;
      }

      // ❌ No board context
      if (!boardId) {
        return res.status(400).json({ message: "Board context required" });
      }

      // ✅ Check membership + role
      const member = await prismaClient.boardMember.findFirst({
        where: {
          boardId,
          userId,
          role: { in: allowedRoles },
        },
      });

      if (!member) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (error) {
      console.error("RBAC error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
}

module.exports = requireBoardRole;