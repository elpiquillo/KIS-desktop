// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';

export const sendNotification = (title: string, body: string) => {
  ipcRenderer.send('show-notification', {
    title,
    body,
  });
};
