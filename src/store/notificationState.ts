import { NotificationData } from 'src/types/notification-interface';
import { create } from 'zustand';

interface NotificationState {
  notifications?: NotificationData[];
  setNotifications: (value: NotificationData[]) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationState = create<NotificationState>()((set) => ({
  notifications: undefined,
  setNotifications: (value) => set(() => ({ notifications: value })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications?.filter((notification) => notification._id.$oid !== id),
    })),
}));
