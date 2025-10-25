import express, { Application, Request, Response } from "express";

// import morgan from 'morgan';
import cookieParser from "cookie-parser";
import cors from "cors";
import exressSession from 'express-session';
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import notFound from "./middleware/notFound";
import { router } from "./routes";


// import helmet from 'helmet';
// Middlewares
// app.use(helmet());

// app.use(morgan('dev'));
const app: Application = express();
app.use(exressSession({
  secret: "your secret",
  resave: false,
  saveUninitialized: false
}))

app.use(express.json());
app.use(cookieParser())
app.use(cors({
   origin: [
    'https://ride-app-gamma.vercel.app',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/api/v1", router);

// Sample Route
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API Working with MongoDB 🚀" });
});

// Global Error Handler
app.use(globalErrorHandler);
// 404 Not Found
app.use(notFound);

// Export the app for use in server.ts
export default app;
