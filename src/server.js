import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { errors } from "celebrate";
import { connectMongoDB } from "./db/connectToMongoDB.js";
import { logger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Локальні адреси фронтенду — щоб команді не треба було заповнювати CLIENT_URL для дев-режиму
const DEV_ORIGINS = ["http://localhost:3000", "http://localhost:3001"];

// CLIENT_URL може містити кілька адрес через кому (напр. прод + прев'ю-деплой).
// Слеш у кінці зрізаємо: браузер надсилає Origin без нього, інакше порівняння не збіглося б
const allowedOrigins = [
  ...(process.env.CLIENT_URL ?? "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean),
  ...(process.env.NODE_ENV === "production" ? [] : DEV_ORIGINS),
];

app.use(logger);
app.use(helmet());
app.use(
  express.json({
    type: ["application/json", "application/vnd.api+json"],
    limit: "100kb",
  }),
);
app.use(
  cors({
    // credentials: true не працює з origin: "*" — браузер вимагає конкретну адресу
    origin: (origin, callback) => {
      // Запити без заголовка Origin (curl, Postman, сервер-до-сервера) не є CORS-запитами
      if (!origin) return callback(null, true);

      return callback(null, allowedOrigins.includes(origin));
    },
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(
  "/api-docs",
  swaggerUi.serve,
  // withCredentials: щоб "Try it out" гарантовано слав сесійні куки,
  // не покладаючись на дефолт fetch
  swaggerUi.setup(swaggerDocument, { swaggerOptions: { withCredentials: true } }),
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/categories", categoriesRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
