const { prisma } = require('../prismaClient');

const sendRequest = async (req, res) => {
  console.log("jhgy")
  try {
    const senderId = req.user?.id;  // Comes from JWT
    const { receiverId } = req.body; // Must send in JSON body

    if (!senderId) return res.status(401).json({ error: "Unauthorized" });
    if (!receiverId) return res.status(400).json({ error: "receiverId is required" });
    if (senderId === receiverId) return res.status(400).json({ error: "Cannot send request to yourself" });

    const existing = await prisma.request.findFirst({
      where: { senderId, receiverId, status: "PENDING" },
    });

    if (existing) return res.status(400).json({ error: "Request already sent" });

    const request = await prisma.request.create({
      data: { senderId, receiverId },
    });

    res.json({ message: "Request sent", request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { sendRequest };
