/* eslint-disable import/no-extraneous-dependencies */
import { Notification } from 'electron';
import { t } from 'i18next';
import { create } from 'zustand';
import { NotificationData } from 'src/types/notification-interface';

interface NotificationState {
  notifications?: NotificationData[];
  setNotifications: (value: NotificationData[]) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationState = create<NotificationState>()((set) => ({
  notifications: undefined,
  setNotifications: (value) => {
    set(() => ({ notifications: value }));
    value.forEach((notificationValue) => {
      displayNotification(notificationValue.title, notificationValue.message);
    });
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications?.filter((notification) => notification._id.$oid !== id),
    }));
    displayNotification(
      t('global.notificationRemovedTitle'),
      t('global.notificationRemovedMessage')
    );
  },
}));

function displayNotification(title: string, message: string) {
  new Notification({
    title,
    body: message,
  }).show();
}
