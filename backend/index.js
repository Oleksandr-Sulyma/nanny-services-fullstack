import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import { errors } from "celebrate";
import dns from "node:dns";
import { connectMongoDB } from "./db/connectMongoDB.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import nannyRoutes from "./routes/nannyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  const startedAt = Date.now();
  console.log(`--> ${req.method} ${req.originalUrl}`);

  res.on("finish", () => {
    const duration = Date.now() - startedAt;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
    );
  });

  next();
});
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/nannies", nannyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);

app.use(errors());
app.use(errorHandler);

const startApp = async () => {
  try {
    await connectMongoDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the application:", error);
  }
};

startApp();
