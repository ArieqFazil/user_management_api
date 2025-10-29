import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import pool from "./src/config/db.js";

import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import itemRoutes from "./src/routes/itemRoutes.js"; // ✅ Tambah ini

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(helmet());

// Routing
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes); // ✅ Tambah ini

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
