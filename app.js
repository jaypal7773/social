const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");

const authRoutes = require('./src/routes/authRoutes');
const postRoutes = require('./src/routes/postRoutes')
const commentRoutes = require('./src/routes/commentRoutes')
const adminRoutes = require('./src/routes/adminRoutes')
const requestRoutes = require('./src/routes/requestRoutes')

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/comment" , commentRoutes)
app.use("/admin" , adminRoutes)
console.log("Hi")
app.use('/api/requests', requestRoutes);

// PostgreSQL Pool
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "mydb",
  password: process.env.DB_PASS || "jaypal123",
  port: process.env.DB_PORT || 5432,
});

// Test connection
(async () => {
  try {
    await pool.connect();
    console.log("Connected to PostgreSQL");
  } catch (err) {
    console.error("DB Connection Error:", err);
  }
})();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = pool;
