export type Notification = {
  id: string;
  title: string;
  type: string;
  message: string;
  readAt: string | null;
  createdAt: string;
  entityId: string | null;
  entityType: string | null;
};
