import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route.js";
import errorMiddleware from "./middleware/error.middleware.js";
import userRoutes from "./modules/users/user.routes.js";
import jobRoutes from "./modules/jobs/job.routes.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.use(errorMiddleware);
export default app;
