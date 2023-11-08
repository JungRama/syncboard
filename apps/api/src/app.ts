import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import winston from "~/core/winston";

const app = express();

dotenv.config();

app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Use Helmet to secure the application by setting various HTTP headers
app.use(helmet());

// Cookie Parser
app.use(cookieParser());

// Use Morgan for logging HTTP requests
app.use(morgan("combined", { stream: winston }));

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION 🔥 Shutting down...");
  console.error("Error🔥", err.message);
  process.exit(1);
});

export default app;
