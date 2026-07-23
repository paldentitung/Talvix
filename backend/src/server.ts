import "./config/env.js";
import app from "./app.js";
import pool from "./config/db.js";
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database connected");
    console.log(result.rows);
    app.listen(PORT, () => {
      console.log(`Server is running in ${PORT}`);
    });
  } catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
  }
};

startServer();
