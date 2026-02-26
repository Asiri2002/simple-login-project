// server.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

// Auth routes
app.use("/api", authRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));