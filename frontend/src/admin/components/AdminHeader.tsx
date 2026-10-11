import { useLocation } from "react-router-dom";
import { MessageSquare, Bell, Menu, User } from "lucide-react";
import { useGetCurrentUser } from "../../features/users/hooks/useGetCurrentUser";
import initials from "../../shared/utils/getInitials";
import { useState } from "react";
import { useNotifications } from "../../features/notification/hooks/useNotifications";
import { useUnreadNotificationCount } from "../../features/notification/hooks/useUnreadNotificationCount";
import { useMarkNotificationRead } from "../../features/notification/hooks/useMarkNotificationRead";
import { useMarkAllNotificationsRead } from "../../features/notification/hooks/useMarkAllNotificationsRead";
import NotificationButton from "../../shared/components/NotificationButton";
const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/admin/overview": {
    title: "Platform overview",
    subtitle: "Everything happening across Hirely.",
  },
  "/admin/users": {
    title: "Users",
    subtitle: "Manage job seekers and employers on the platform",
  },
  "/admin/companies": {
    title: "Companies",
    subtitle: "Review and manage registered companies",
  },
  "/admin/jobs": {
    title: "Jobs",
    subtitle: "Monitor job postings across all companies",
  },
  "/admin/reports": {
    title: "Reports",
    subtitle: "Review flagged content and open reports",
  },
  "/admin/settings": {
    title: "Settings",
    subtitle: "Manage platform-wide configuration",
  },
};

const defaultMeta = {
  title: "Dashboard",
  subtitle: "Everything happening across Hirely.",
};

const getPageMeta = (pathname: string) => {
  if (pageMeta[pathname]) return pageMeta[pathname];
  const match = Object.keys(pageMeta)
    .filter((path) => pathname.startsWith(path))
    .sort((a, b) => b.length - a.length)[0];
  return match ? pageMeta[match] : defaultMeta;
};

const AdminHeader = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const { pathname } = useLocation();
  const { title, subtitle } = getPageMeta(pathname);
  const { data: currentUser } = useGetCurrentUser();
  const [imageError, setImageError] = useState(false);

  const avatarUrl = currentUser?.avatar
    ? `${import.meta.env.VITE_API_BACKEND_URL}${currentUser.avatar}`
    : null;
  const { data: notifications = [] } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { mutate: markAsRead } = useMarkNotificationRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsRead();
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 flex-1 items-start gap-2 sm:gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            aria-label="Open menu"
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius-md) text-(--text-secondary) hover:bg-(--card) lg:hidden"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="truncate font-display text-lg font-bold text-(--text-primary) sm:text-2xl">
            {title}
          </h1>
          <p className="mt-0.5 truncate text-xs text-(--text-secondary) sm:mt-1 sm:text-sm">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <button
          aria-label="Messages"
          className="flex h-9 w-9 items-center justify-center rounded-(--radius-md) text-(--text-secondary) transition-colors hover:bg-(--card) hover:text-(--text-primary) sm:h-10 sm:w-10"
        >
          <MessageSquare size={20} />
        </button>

        <NotificationButton
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />

        <button className="flex items-center gap-2 rounded-(--radius-md) py-1 pl-1 pr-2 transition-colors hover:bg-(--card)">
          {avatarUrl && !imageError ? (
            <img
              src={avatarUrl}
              alt="Profile avatar"
              className="h-8 w-8 rounded-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-white bg-(--primary)">
              {currentUser ? (
                initials(
                  `${currentUser.firstName ?? ""} ${currentUser.lastName ?? ""}`.trim(),
                )
              ) : (
                <User size={18} />
              )}
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
