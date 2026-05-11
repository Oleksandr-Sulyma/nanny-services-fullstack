import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectMongoDB } from "./db/connectMongoDB.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { errors } from 'celebrate';
import dns from "node:dns";
import authRoutes from './routes/authRoutes.js';
import nannyRoutes from './routes/nannyRoutes.js';
import userRoutes from './routes/userRoutes.js';

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/nannies', nannyRoutes);
app.use('/api/users', userRoutes);

app.use(errors());

app.use(errorHandler);

const startApp = async () => {
  try {
    await connectMongoDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start the application:", error);
  }
};

startApp();