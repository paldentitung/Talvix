import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route.js";
import errorMiddleware from "./middleware/error.middleware.js";
import userRoutes from "./modules/users/user.routes.js";
import jobRoutes from "./modules/jobs/job.routes.js";
import applicationRoutes from "./modules/application/application.route.js";
import companyRoutes from "./modules/company/company.route.js";
import notificationRoutes from "./modules/notification/notification.route.js";
import cookieParser from "cookie-parser";
import path from "path";
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.use(errorMiddleware);
export default app;
