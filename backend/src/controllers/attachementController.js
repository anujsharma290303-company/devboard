const prismaClient = require("../config/prisma");
const fs = require("fs");

// Upload an attachment to a card
exports.uploadAttachment = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const cardId = req.params.cardId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const card = await prismaClient.card.findUnique({
      where: { id: cardId },
      include: { column: { select: { boardId: true } } },
    });
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    const boardId = card.column.boardId;
    const member = await prismaClient.boardMember.findFirst({
      where: { boardId, userId },
    });
    if (!member) {
      return res.status(403).json({ message: "Forbidden" });
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
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all attachments for a card
exports.getCardAttachments = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const cardId = req.params.cardId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const card = await prismaClient.card.findUnique({
      where: { id: cardId },
      include: { column: { select: { boardId: true } } },
    });
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    const member = await prismaClient.boardMember.findFirst({
      where: { boardId: card.column.boardId, userId },
    });
    if (!member) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const attachments = await prismaClient.attachment.findMany({
      where: { cardId },
      orderBy: { createdAt: "desc" },
    });

    return res.json(attachments);
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete an attachment by id
exports.deleteAttachment = async (req, res, next) => {
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
            column: { select: { boardId: true } },
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

    if (fs.existsSync(attachment.storedPath)) {
      fs.unlinkSync(attachment.storedPath);
    }

    await prismaClient.attachment.delete({
      where: { id: attachmentId },
    });

    return res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};