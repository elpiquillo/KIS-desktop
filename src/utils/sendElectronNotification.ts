declare global {
  interface Window {
    electron?: {
      sendNotification: (title: string, body: string) => void;
    };
  }
}

export const sendNotification = (title: string, body: string) => {
  if (window.electron) {
    window.electron.sendNotification(title, body);
  }
};
