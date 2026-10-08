import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  getNotificationsController,
  getUnreadNotificationCountController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
} from "./notification.controller.js";

const router = express.Router();

router.get("/", requireAuth, asyncHandler(getNotificationsController));
router.get(
  "/unread-count",
  requireAuth,
  asyncHandler(getUnreadNotificationCountController),
);
router.patch(
  "/:id/read",
  requireAuth,
  asyncHandler(markNotificationAsReadController),
);
router.patch(
  "/read-all",
  requireAuth,
  asyncHandler(markAllNotificationsAsReadController),
);
export default router;
