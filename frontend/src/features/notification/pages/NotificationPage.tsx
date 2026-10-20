import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Bell,
  BellOff,
  Briefcase,
  CheckCheck,
  ChevronRight,
  FileText,
  Flag,
  type LucideIcon,
} from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { useMarkNotificationRead } from "../hooks/useMarkNotificationRead";
import { useMarkAllNotificationsRead } from "../hooks/useMarkAllNotificationsRead";
import type { Notification } from "../types/notification.types";
import { useAuth } from "../../auth/contexts/AuthContext";
import { getNotificationLink } from "../utils/notificationRoutes";

const getNotificationIcon = (n: Notification): LucideIcon => {
  const key = `${n.type ?? ""} ${n.entityType ?? ""}`.toUpperCase();
  if (key.includes("APPLICATION")) return FileText;
  if (key.includes("REPORT")) return Flag;
  if (key.includes("JOB")) return Briefcase;
  return Bell;
};

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const formatRelativeTime = (date: string) => {
  const then = new Date(date).getTime();
  const seconds = Math.round((then - Date.now()) / 1000);
  const abs = Math.abs(seconds);

  if (abs < 60) return "Just now";
  if (abs < 3600) return rtf.format(Math.round(seconds / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(seconds / 3600), "hour");
  if (abs < 86400 * 7) return rtf.format(Math.round(seconds / 86400), "day");

  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
    new Date(date),
  );
};

const formatFullTime = (date: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

type Group = { label: string; items: Notification[] };

const groupByDay = (items: Notification[]): Group[] => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayMs = startOfToday.getTime();
  const dayMs = 86_400_000;

  const buckets: Group[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Earlier", items: [] },
  ];

  for (const n of items) {
    const t = new Date(n.createdAt).getTime();
    if (t >= todayMs) buckets[0].items.push(n);
    else if (t >= todayMs - dayMs) buckets[1].items.push(n);
    else buckets[2].items.push(n);
  }

  return buckets.filter((b) => b.items.length > 0);
};

type Filter = "all" | "unread";

const NotificationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role;

  const { data, isLoading, isError, refetch } = useNotifications();
  const { mutate: markAsRead } = useMarkNotificationRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();

  const notifications: Notification[] = data ?? [];

  const [filter, setFilter] = useState<Filter>("all");

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.readAt === null).length,
    [notifications],
  );

  const groups = useMemo(() => {
    const list =
      filter === "unread"
        ? notifications.filter((n) => n.readAt === null)
        : notifications;
    return groupByDay(list);
  }, [notifications, filter]);

  const handleClick = (notification: Notification) => {
    if (notification.readAt === null) {
      markAsRead(notification.id);
    }

    const link = getNotificationLink(role, notification);
    if (link) navigate(link);
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-(--text-primary)">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-(--text-secondary)">
            {isLoading
              ? "Loading your updates…"
              : unreadCount > 0
                ? `${unreadCount} unread ${unreadCount === 1 ? "update" : "updates"}`
                : "You're all caught up"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => markAllAsRead()}
          disabled={unreadCount === 0 || isMarkingAll}
          className="inline-flex items-center gap-2 rounded-lg border border-(--border) bg-(--card) px-3.5 py-2 text-sm font-medium text-(--text-primary) transition-colors hover:bg-(--background) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCheck size={16} className="text-(--primary)" />
          Mark all as read
        </button>
      </header>

      {/* Filter */}
      <div
        role="tablist"
        aria-label="Filter notifications"
        className="mb-4 inline-flex rounded-lg bg-(--background) p-1 ring-1 ring-(--border)"
      >
        {(["all", "unread"] as const).map((tab) => {
          const active = filter === tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(tab)}
              className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-(--primary) ${
                active
                  ? "bg-(--card) text-(--text-primary) shadow-sm ring-1 ring-(--border)"
                  : "text-(--text-secondary) hover:text-(--text-primary)"
              }`}
            >
              {tab === "all" ? "All" : "Unread"}
              {tab === "unread" && unreadCount > 0 && (
                <span className="rounded-full bg-(--accent) px-1.5 text-[11px] font-semibold leading-5 text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="overflow-hidden rounded-xl border border-(--border) bg-(--card)">
        {isLoading ? (
          <ul aria-busy="true" aria-label="Loading notifications">
            {Array.from({ length: 5 }).map((_, i) => (
              <li
                key={i}
                className="flex gap-4 border-b border-(--border) px-5 py-4 last:border-b-0"
              >
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-(--border)" />
                <div className="flex-1 space-y-2.5 pt-1">
                  <div className="h-3.5 w-1/3 animate-pulse rounded bg-(--border)" />
                  <div className="h-3 w-3/4 animate-pulse rounded bg-(--border)" />
                </div>
              </li>
            ))}
          </ul>
        ) : isError ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-(--background) text-(--text-secondary)">
              <AlertCircle size={22} />
            </div>
            <p className="text-sm font-semibold text-(--text-primary)">
              We couldn't load your notifications
            </p>
            <p className="mt-1 text-sm text-(--text-secondary)">
              Check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-lg border border-(--border) px-4 py-2 text-sm font-medium text-(--primary) transition-colors hover:bg-(--background)"
            >
              Try again
            </button>
          </div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-(--background) text-(--text-secondary)">
              <BellOff size={22} />
            </div>
            <p className="text-sm font-semibold text-(--text-primary)">
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </p>
            <p className="mt-1 max-w-xs text-sm text-(--text-secondary)">
              {filter === "unread"
                ? "Everything has been read. Switch to All to see earlier updates."
                : "Updates about your activity will show up here."}
            </p>
            {filter === "unread" && (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="mt-5 rounded-lg border border-(--border) px-4 py-2 text-sm font-medium text-(--primary) transition-colors hover:bg-(--background)"
              >
                View all
              </button>
            )}
          </div>
        ) : (
          <div>
            {groups.map((group) => (
              <section
                key={group.label}
                aria-label={group.label}
                className="border-b border-(--border) last:border-b-0"
              >
                <h2 className="bg-(--background)/60 px-5 py-2 text-xs font-semibold text-(--text-secondary)">
                  {group.label}
                </h2>

                <ul>
                  {group.items.map((notification) => {
                    const isUnread = notification.readAt === null;
                    const hasLink =
                      getNotificationLink(role, notification) !== null;
                    const Icon = getNotificationIcon(notification);

                    return (
                      <li
                        key={notification.id}
                        className="border-t border-(--border) first:border-t-0"
                      >
                        <button
                          type="button"
                          onClick={() => handleClick(notification)}
                          className={`group relative flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-(--background) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--primary) ${
                            isUnread ? "bg-(--primary)/5" : ""
                          } ${hasLink ? "cursor-pointer" : "cursor-default"}`}
                        >
                          {/* Unread bar */}
                          {isUnread && (
                            <span
                              aria-hidden="true"
                              className="absolute inset-y-0 left-0 w-0.5 bg-(--accent)"
                            />
                          )}

                          {/* Icon tile */}
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                              isUnread
                                ? "bg-(--primary)/10 text-(--primary)"
                                : "bg-(--background) text-(--text-secondary)"
                            }`}
                          >
                            <Icon size={18} />
                          </div>

                          {/* Text */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-3">
                              <p
                                className={`truncate text-sm text-(--text-primary) ${
                                  isUnread ? "font-semibold" : "font-medium"
                                }`}
                              >
                                {notification.title}
                              </p>

                              <time
                                dateTime={notification.createdAt}
                                title={formatFullTime(notification.createdAt)}
                                className="shrink-0 text-xs text-(--text-secondary)"
                              >
                                {formatRelativeTime(notification.createdAt)}
                              </time>
                            </div>

                            <p className="mt-0.5 line-clamp-2 text-sm text-(--text-secondary)">
                              {notification.message}
                            </p>
                          </div>

                          {/* Chevron only when the row navigates somewhere */}
                          {hasLink && (
                            <ChevronRight
                              size={16}
                              className="mt-3 shrink-0 text-(--text-secondary) opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
