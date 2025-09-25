const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// const signup = async (req, res) => {
//   try {
//     const { email, password, name } = req.body;
//     if (!email || !password) return res.status(400).json({ error: "Email & password required" });

//     // Check existing user
//     const existing = await prisma.user.findUnique({ where: { email } });
//     if (existing) return res.status(400).json({ error: "Email already in use" });

//     // Hash password & create user
//     const hashed = await bcrypt.hash(password, 8);
//     const user = await prisma.user.create({
//       data: { email, password: hashed, name },
//       select: { id: true, email: true, name: true, createdAt: true }
//     });

//     // Generate JWT
//     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
//     res.json({ user, token });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };


const signup = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email & password required" });
    }

    // Check existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // ✅ Respect role from request, but fallback to USER
    const finalRole = role && ["USER", "ADMIN"].includes(role.toUpperCase())
      ? role.toUpperCase()
      : "USER";

    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashed, 
        name, 
        role: finalRole 
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const login = async (req, res) => {

  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email & password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const correct = await bcrypt.compare(password, user.password);
    if (!correct) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ user: { id: user.id, email: user.email}, token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { signup, login };
