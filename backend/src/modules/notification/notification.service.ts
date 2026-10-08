import prisma from "../../lib/prisma.js";
import { CreateNotificationInput } from "./notification.types.js";

export const getNotificationsService = async (userId: string) => {
  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return notifications;
};

export const getUnreadNotificationCountService = async (userId: string) => {
  const count = await prisma.notification.count({
    where: {
      userId,
      readAt: null,
    },
  });

  return count;
};
export const markNotificationAsReadService = async (
  notificationId: string,
  userId: string,
) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (notification.readAt) {
    return notification;
  }

  return prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      readAt: new Date(),
    },
  });
};
export const markAllNotificationsAsReadService = async (userId: string) => {
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  });

  return {
    updatedCount: result.count,
  };
};

export const createNotificationService = async (
  data: CreateNotificationInput,
) => {
  const notification = await prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      entityId: data.entityId,
      entityType: data.entityType,
    },
  });

  return notification;
};
