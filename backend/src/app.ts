import express from "express";
import cors from "cors";
import authRoute from "./modules/auth/auth.route.js";
import errorMiddleware from "./middleware/error.middleware.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.use(errorMiddleware);
export default app;
