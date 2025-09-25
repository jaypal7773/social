const prisma = require("../prismaClient");

const addComment = async (req, res) => {
  try {
    const { postId, content, parentId } = req.body;
    if (!postId || !content) return res.status(400).json({ error: "postId & content required" });


    if (parentId) {
      const parent = await prisma.comment.findUnique({ where: { id: parentId } });
      if (!parent) return res.status(400).json({ error: "Parent comment not found" });
      if (parent.postId !== postId) return res.status(400).json({ error: "parent must be on same post" });
    }

    const comment = await prisma.comment.create({
      data: { content, authorId: req.user.id, postId, parentId: parentId || null },
      include: { author: true }
    });
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const updateComment = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { content } = req.body;
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ error: "Not found" });
    if (comment.authorId !== req.user.id) return res.status(403).json({ error: "Forbidden" });
    const updated = await prisma.comment.update({ where: { id }, data: { content } });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ error: "Not found" });
    if (comment.authorId !== req.user.id) return res.status(403).json({ error: "Forbidden" });

    // delete replies first (cascade manually or use onDelete in DB if configured)
    await prisma.comment.deleteMany({ where: { parentId: id } });
    await prisma.comment.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getCommentsForPost = async (req, res) => {
  try {
    const postId = Number(req.params.postId);
    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null },
      orderBy: { createdAt: "desc" },
      include: { author: true, replies: { include: { author: true } }, likes: true }
    });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addComment, updateComment, deleteComment, getCommentsForPost };
