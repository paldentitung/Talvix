import express from "express";
import {
  getCompaniesController,
  getCompanyByIdController,
} from "./company.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

const router = express.Router();

router.get("/", requireAuth, requireRole("ADMIN"), getCompaniesController);
router.get("/:id", requireAuth, requireRole("ADMIN"), getCompanyByIdController);

export default router;
