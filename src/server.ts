/* eslint-disable no-console */
import mongoose from "mongoose";
import app from "./app";

import { envVars } from "./app/config";


// Server instance variable
let server: ReturnType<typeof app.listen>;

/**
 * Connect to MongoDB and start the server
 */
const bootstrap = async (): Promise<void> => {
  try {
    // MongoDB Connection
    await mongoose.connect(envVars.database_url as string);
    console.log("✅ MongoDB connected successfully");

    // Start Express server
    server = app.listen(envVars.port, () => {
      console.log(`🚀 Server running on http://localhost:${envVars.port}`);

  
   
    });

    // Set mongoose debug mode based on environment
    mongoose.set("debug", envVars.node_env === "development");
  } catch (error) {
    console.error("❌ Failed to initialize application:", error);
    process.exit(1);
  }
};

// Initialize the application
bootstrap();

/**
 * Graceful Shutdown & Error Handling
 */

// Uncaught Exceptions (synchronous errors)
process.on("uncaughtException", (error: Error) => {
  console.error("💥 Uncaught Exception:", error);
  process.exit(1);
});

// Unhandled Promise Rejections (asynchronous errors)
process.on("unhandledRejection", (reason: unknown) => {
  console.error(
    "⏳ Unhandled Rejection at:",
    reason instanceof Error ? reason.stack : reason
  );

  if (server) {
    server.close(() => {
      console.log("🔒 Server closed due to unhandled rejection");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// SIGTERM (e.g. Docker stop, Vercel shutdown)
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received - Graceful shutdown initiated");

  if (server) {
    server.close(() => {
      console.log("🚪 HTTP server closed");
      mongoose.connection.close(false).then(() => {
        console.log("🔒 MongoDB connection closed");
        process.exit(0);
      });
    });
  }
});

// SIGINT (Ctrl+C)
process.on("SIGINT", () => {
  console.log("🛑 SIGINT received - Shutting down");

  if (server) {
    server.close(() => {
      mongoose.connection.close(false).then(() => {
        process.exit(0);
      });
    });
  }
});