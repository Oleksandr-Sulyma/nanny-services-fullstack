import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errors } from "celebrate";
import { apiReference } from "@scalar/express-api-reference";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import nannyRoutes from "./routes/nannyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

const app = express();
const currentDir = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(cors());
app.use(
  morgan("dev", {
    skip: () => process.env.NODE_ENV === "test",
  }),
);

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.get("/openapi.yaml", (req, res) => {
  res.sendFile(path.join(currentDir, "../docs/openapi.yaml"));
});
app.use(
  "/api-docs",
  apiReference({
    theme: "purple",
    darkMode: true,
    url: "/openapi.yaml",
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/nannies", nannyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);

app.use(errors());
app.use(errorHandler);

export { app };
