import "dotenv/config";
import dns from "node:dns";
import { app } from "./app.js";
import { connectMongoDB } from "./db/connectMongoDB.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

const PORT = process.env.PORT || 5000;

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
