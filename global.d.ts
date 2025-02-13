// Purpose: Declare global types for the app

declare global {
  interface Window {
    electron: {
      sendNotification: (title: string, body: string) => void;
    };
  }
}
