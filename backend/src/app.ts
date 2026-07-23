import express from "express";
import cors from "cors";
import authRoute from "./modules/auth/auth.route.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.send("hello from server");
});

export default app;
