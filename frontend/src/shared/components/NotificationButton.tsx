import { Bell } from "lucide-react";
import { useState } from "react";

import NotificationDropdown from "./NotificationDropdown";

import type { Notification } from "../../features/notification/types/notification.types";

type NotificationButtonProps = {
  notifications?: Notification[];
  unreadCount?: number;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onNotificationClick?: (notification: Notification) => void;
};

const iconButton =
  "relative flex h-10 w-10 items-center justify-center rounded-full border border-(--border) bg-(--card) text-(--text-secondary) shadow-(--shadow-sm) transition-all hover:border-(--primary)/30 hover:text-(--primary) hover:shadow-(--shadow-md) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)";

const NotificationButton = ({
  notifications = [],
  unreadCount = 0,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
}: NotificationButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasUnread = unreadCount > 0;
  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={iconButton}
      >
        <Bell size={18} />

        {hasUnread && (
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-(--accent) ring-2 ring-(--card)" />
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          onMarkAsRead={onMarkAsRead}
          onMarkAllAsRead={onMarkAllAsRead}
          onNotificationClick={onNotificationClick}
        />
      )}
    </div>
  );
};

export default NotificationButton;
