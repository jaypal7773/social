// require("dotenv").config();
// const jwt = require("jsonwebtoken");
// const prisma = require("../prismaClient");

// const auth = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ error: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];
//     const payload = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await prisma.user.findUnique({
//       where: { id: payload.userId },
//       select: { id: true, email: true, name: true }
//     });

//     if (!user) return res.status(401).json({ error: "Unauthorized" });

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error("Auth error:", err.message);
//     return res.status(401).json({ error: "Invalid or expired token" });
//   }
// };

// module.exports = auth;



require("dotenv").config();
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role},
    process.env.JWT_SECRET,
    { expiresIn : "7d"}
  )
}

const auth = (role = []) => {
  return (req , res , next) => {
    try{
      const token = req.headers.authorization?.split(" ")[1];
      if(!token) return res.status(404).json({error : "No token"});

      const decoded = jwt.verify(token , process.env.JWT_SECRET);
      req.user = decoded;

      if (role.length && !role.includes(decoded.role)){
        return res.status(401).json({error : "error"})
      }
      next()
    }catch(err){
      console.log(err)
      return res.status(401).json({error : "Invalid token"})
    }
  }
}

module.exports = {generateToken , auth}