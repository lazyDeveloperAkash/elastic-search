import prisma from "./config/prismaClient.js";
import router from "./routes/index.js";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));

// Middleware
app.use(express.json());
app.use(morgan("tiny"));

// Routes
app.get("/", (_, res) => {
  res.send("🚀 Prisma + Express running inside Docker!");
});

app.use(router);

// Start server
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 Shutting down server...");
  server.close(async () => {
    await prisma.$disconnect();
    console.log("✅ Prisma disconnected, server stopped");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("🛑 Server interrupted...");
  server.close(async () => {
    await prisma.$disconnect();
    console.log("✅ Prisma disconnected, server stopped");
    process.exit(0);
  });
});
