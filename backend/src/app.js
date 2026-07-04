import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import requestRoutes from "./routes/requests.routes.js";
import profileRoutes from "./routes/profile.routes.js";
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/", healthRoutes);
app.use("/", authRoutes);
app.use("/", protectedRoutes);
app.use("/", requestRoutes);
app.use("/", profileRoutes);

export default app;
