import { Bell, CheckCheck } from "lucide-react";

import type { Notification } from "../../features/notification/types/notification.types";

type NotificationDropdownProps = {
  notifications: Notification[];
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onNotificationClick?: (notification: Notification) => void;
};

const NotificationDropdown = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
}: NotificationDropdownProps) => {
  const hasUnread = notifications?.some(
    (notification) => notification.readAt === null,
  );

  return (
    <div className="absolute right-0 top-12 z-50 w-80 max-w-[calc(100vw-1rem)] overflow-hidden rounded-xl border border-(--border) bg-(--card) shadow-(--shadow-lg)">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-(--border) px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-(--text-primary)">
            Notifications
          </h3>

          {hasUnread && (
            <p className="mt-0.5 text-xs text-(--text-secondary)">
              You have unread notifications
            </p>
          )}
        </div>

        {hasUnread && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1.5 text-xs font-medium text-(--primary) transition-colors hover:opacity-80"
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
            <Bell size={24} className="mb-2 text-(--text-secondary)" />

            <p className="text-sm font-medium text-(--text-primary)">
              No notifications
            </p>

            <p className="mt-1 text-xs text-(--text-secondary)">
              You're all caught up.
            </p>
          </div>
        ) : (
          notifications.map((notification) => {
            const isUnread = notification.readAt === null;

            return (
              <button
                key={notification.id}
                type="button"
                onClick={() => {
                  if (isUnread) {
                    onMarkAsRead?.(notification.id);
                  }

                  onNotificationClick?.(notification);
                }}
                className={`flex w-full gap-3 border-b border-(--border) px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-(--background) ${
                  isUnread ? "bg-(--primary)/5" : ""
                }`}
              >
                <div className="pt-1.5">
                  <span
                    className={`block h-2 w-2 rounded-full ${
                      isUnread ? "bg-(--accent)" : "bg-transparent"
                    }`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-(--text-primary)">
                    {notification.title}
                  </p>

                  <p className="mt-1 line-clamp-2 text-xs text-(--text-secondary)">
                    {notification.message}
                  </p>

                  <p className="mt-1.5 text-[11px] text-(--text-secondary)">
                    {formatNotificationTime(notification.createdAt)}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-(--border) px-4 py-3">
          <button
            type="button"
            className="w-full text-center text-xs font-medium text-(--primary) transition-colors hover:opacity-80"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

const formatNotificationTime = (date: string) => {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

export default NotificationDropdown;
