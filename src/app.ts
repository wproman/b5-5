import express, { Application, Request, Response } from "express";

// import morgan from 'morgan';
import cookieParser from "cookie-parser";
import cors from "cors";
import exressSession from 'express-session';
import passport from "passport";
import "./config/passport";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import notFound from "./middleware/notFound";
import { router } from "./routes";


const app: Application = express();
app.use(exressSession({
  secret: process.env.SESSION_SECRET || 'fallback_secret_change_in_production',
  resave: false,
  saveUninitialized: false
}))
app.use(exressSession({
  secret: process.env.XPRESS_SESSION_SECRET || "secret",
 resave: false,
 saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
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


// Add this before your routes
app.get("/api/v1/test-mobile", (req, res) => {
  console.log('=== MOBILE TEST REQUEST ===');
  console.log('Origin:', req.headers.origin);
  console.log('User-Agent:', req.headers['user-agent']);
  console.log('====================');
  
  res.json({ 
    success: true, 
    message: "Backend is reachable",
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent']
  });
});

// Global Error Handler
app.use(globalErrorHandler);
// 404 Not Found
app.use(notFound);

// Export the app for use in server.ts
export default app;
