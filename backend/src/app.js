import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/", healthRoutes);
app.use("/", authRoutes);

export default app;
