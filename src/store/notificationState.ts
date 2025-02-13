import { t } from 'i18next';
import { create } from 'zustand';
import { NotificationData } from 'src/types/notification-interface';
import { isElectron } from 'src/utils/isElectron';
import { sendNotification } from 'src/utils/sendElectronNotification';

interface NotificationState {
  notifications?: NotificationData[];
  setNotifications: (value: NotificationData[]) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationState = create<NotificationState>()((set) => ({
  notifications: undefined,
  setNotifications: (value) => {
    set(() => ({ notifications: value }));
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications?.filter((notification) => notification._id.$oid !== id),
    }));
    if (isElectron()) {
      sendNotification(t('notification.removed'), t('notification.removedMessage'));
    }
  },
}));
