// ...existing code...
// Only keep one definition for each function, using req.params.cardId for card-based endpoints

exports.deleteAttachment = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const attachmentId = req.params.id;

    if (!userId) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      return next(error);
    }

    const attachment = await prismaClient.attachment.findUnique({
      where: { id: attachmentId },
      include: {
        card: {
          include: {
            column: {
              select: { boardId: true },
            },
          },
        },
      },
    });

    if (!attachment) {
      const error = new Error("Attachment not found");
      error.statusCode = 404;
      return next(error);
    }

    const boardId = attachment.card.column.boardId;

    const member = await prismaClient.boardMember.findFirst({
      where: { boardId, userId },
    });

    if (!member) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      return next(error);
    }

    if (fs.existsSync(attachment.storedPath)) {
      fs.unlinkSync(attachment.storedPath);
    }

    await prismaClient.attachment.delete({
      where: { id: attachmentId },
    });

    return res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return next(error);
  }
};
const prismaClient = require("../config/prisma");
const fs = require("fs");

exports.uploadAttachment = async (req, res,next) => {
  try {
    const userId = req.user?.id;
    const cardId = req.params.id;

    if (!userId) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      throw error;
    }

    if (!req.file) {
      const error = new Error("File is required");
      error.statusCode = 400;
      throw error;
    }

    // Get card → boardId
    const card = await prismaClient.card.findUnique({
      where: { id: cardId },
      include: {
        column: {
          select: { boardId: true },
        },
      },
    });

    if (!card) {
      const error = new Error("Card not found");
      error.statusCode = 404;
      throw error;
    }

    const boardId = card.column.boardId;

    // Check membership
    const member = await prismaClient.boardMember.findFirst({
      where: { boardId, userId },
    });

    if (!member) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

    const file = req.file;

    const attachment = await prismaClient.attachment.create({
      data: {
        cardId,
        uploadedById: userId,
        originalName: file.originalname,
        storedPath: file.path,
        mimeType: file.mimetype,
        sizeBytes: file.size,
      },
    });

    return res.status(201).json(attachment);
  } catch (error) {
    console.error("Upload error:", error);
    next(error);
  }
};

exports.getCardAttachments = async (req, res,next) => {
  try {
    const userId = req.user?.id;
    const cardId = req.params.id;

    if (!userId) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      throw error;
    }

    const card = await prismaClient.card.findUnique({
      where: { id: cardId },
      include: {
        column: {
          select: { boardId: true },
        },
      },
    });

    if (!card) {
      const error = new Error("Card not found");
      error.statusCode = 404;
      throw error;
    }

    const member = await prismaClient.boardMember.findFirst({
      where: {
        boardId: card.column.boardId,
        userId,
      },
    });

    if (!member) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

    const attachments = await prismaClient.attachment.findMany({
      where: { cardId },
      orderBy: { createdAt: "desc" },
    });

    return res.json(attachments);
  } catch (error) {
    console.error("Fetch error:", error);
    next(error);
  }
};
exports.deleteAttachment = async (req, res,next) => {
  try {
    const userId = req.user?.id;
    const attachmentId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const attachment = await prismaClient.attachment.findUnique({
      where: { id: attachmentId },
      include: {
        card: {
          include: {
            column: {
              select: { boardId: true },
            },
          },
        },
      },
    });

    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    const boardId = attachment.card.column.boardId;

    const member = await prismaClient.boardMember.findFirst({
      where: { boardId, userId },
    });

    if (!member) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // delete file from disk
    if (fs.existsSync(attachment.storedPath)) {
      fs.unlinkSync(attachment.storedPath);
    }

    // delete from DB
    await prismaClient.attachment.delete({
      where: { id: attachmentId },
    });

    return res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};