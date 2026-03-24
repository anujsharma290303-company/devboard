const prismaClient = require("../config/prisma");

exports.createLabel = async (req, res) => {
  const boardId = req.params.boardId?.trim();
  const userId = req.user?.id;
  const { name, color } = req.body;

  if (!userId) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }
  if (!boardId) {
    const error = new Error("Board ID is required");
    error.statusCode = 400;
    throw error;
  }
  if (!name || !color) {
    const error = new Error("Name and color are required");
    error.statusCode = 400;
    throw error;
  }

  try {
    const label = await prismaClient.label.create({
      data: { boardId, name, color },
    });
    return res.status(201).json(label);
  } catch (error) {
    console.error("Error creating label:", error);
    next(error);
  }
};

exports.getBoardLabels = async (req, res) => {
  const boardId = req.params.boardId?.trim();
  const userId = req.user?.id;

  if (!userId) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }
  if (!boardId) {
    const error = new Error("Board ID is required");
    error.statusCode = 400;
    throw error;
  }

  try {
    const labels = await prismaClient.label.findMany({
      where: { boardId },
      orderBy: { name: "asc" },
    });
    return res.status(200).json(labels);
  } catch (error) {
    console.error("Error fetching labels:", error);
    next(error);
  }
};

exports.addLabelToCard = async (req, res) => {
  const cardId = req.params.cardId?.trim();
  const userId = req.user?.id;
  const { labelId } = req.body;

  if (!userId) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }
  if (!cardId || !labelId) {
    const error = new Error("Card ID and label ID are required");
    error.statusCode = 400;
    throw error;
  }

  try {
    // Get card and label
    const card = await prismaClient.card.findUnique({
      where: { id: cardId },
      select: { boardId: true },
    });
    const label = await prismaClient.label.findUnique({
      where: { id: labelId },
      select: { boardId: true },
    });
    if (!card || !label) {
      const error = new Error("Card or label not found");
      error.statusCode = 404;
      throw error;
    }
    if (card.boardId !== label.boardId) {
      const error = new Error("Label and card must belong to the same board");
      error.statusCode = 400;
      throw error;
    }
    // Attach label to card
    const cardLabel = await prismaClient.cardLabel.create({
      data: { cardId, labelId },
    });
    return res.status(201).json(cardLabel);
  } catch (error) {
    console.error("Error adding label to card:", error);
    next(error);
  }
};

exports.removeLabelFromCard = async (req, res) => {
  const cardId = req.params.cardId?.trim();
  const labelId = req.params.labelId?.trim();
  const userId = req.user?.id;

  if (!userId) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }
  if (!cardId || !labelId) {
    const error = new Error("Card ID and label ID are required");
    error.statusCode = 400;
    throw error;
  }

  try {
    // Verify user is a board member
    const card = await prismaClient.card.findUnique({
      where: { id: cardId },
      select: { boardId: true },
    });
    if (!card) {
      const error = new Error("Card not found");
      error.statusCode = 404;
      throw error;
    }
    // Remove label from card
    await prismaClient.cardLabel.deleteMany({
      where: { cardId, labelId },
    });
    return res.status(204).send();
  } catch (error) {
    console.error("Error removing label from card:", error);
    next(error);
  }
};
