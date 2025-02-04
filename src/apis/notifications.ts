import { t } from 'i18next';
import { useEffect } from 'react';
import useSWR from 'swr';
import { useNotificationState } from 'src/store/notificationState';
import { NotificationData } from 'src/types/notification-interface';
import { ApiError } from '../utils/apiErrors';
import { apiFetcher } from '../utils/fetchers';
import { urls } from '../utils/urls';

// ----------------------------------------------------------------------

export function useGetNotifications() {
  const { setNotifications } = useNotificationState();

  const { error, data, isLoading } = useSWR(`${urls.notifications.list}`, apiFetcher, {});

  useEffect(() => {
    if (data) {
      setNotifications(data as NotificationData[]);
    }
  }, [data, setNotifications]);

  return {
    error: error as ApiError,
    data: data as NotificationData[],
    isLoading,
  };
}

// ----------------------------------------------------------------------

export function useDeleteNotification() {
  const { removeNotification } = useNotificationState();

  const deleteNotification = async ({ id }: { id: string }) => {
    try {
      await apiFetcher(`${urls.notifications.delete}${id}`, {
        method: 'DELETE',
      });

      removeNotification(id);
    } catch (error: any) {
      throw new Error(t(`errors.${error.message}`));
    }
  };

  return { deleteNotification };
}
