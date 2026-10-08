import {
  getNotificationsService,
  getUnreadNotificationCountService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
} from "./notification.service.js";
import { Request, Response } from "express";
export const getNotificationsController = async (
  req: Request,
  res: Response,
) => {
  const result = await getNotificationsService(req.user!.id);

  res.status(200).json({
    success: true,
    message: "Notifcations fetched",
    data: result,
  });
};
export const getUnreadNotificationCountController = async (
  req: Request,
  res: Response,
) => {
  const count = await getUnreadNotificationCountService(req.user!.id);

  res.status(200).json({
    success: true,
    message: "Unread notification count fetched",
    data: {
      count,
    },
  });
};
export const markNotificationAsReadController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;

  const result = await markNotificationAsReadService(id, req.user!.id);

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
    data: result,
  });
};
export const markAllNotificationsAsReadController = async (
  req: Request,
  res: Response,
) => {
  const result = await markAllNotificationsAsReadService(req.user!.id);

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
    data: result,
  });
};
