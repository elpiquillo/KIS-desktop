import { NotificationData } from 'src/types/notification-interface';

export const mockNotifications: NotificationData[] = [
  {
    _id: {
      $oid: '656a281e52eb4340aacddb80',
    },
    app_id: {
      $oid: '6662072076b4c200013d3228',
    },
    c_at: '2023-12-01T18:38:22.585Z',
    message:
      "Your profil is selected to pass the review. Don't wait. We're looking forward to discover your answers.   Go to your app : https://app.getkis.io/  See you 😊",
    title: '👏🏼 Congrats !',
    trigger_id: {
      $oid: '64b01ca552eb430732479f68',
    },
    u_at: '2024-12-02T19:11:56.697Z',
    user_id: {
      $oid: '652dd2ac52eb4325f68e3f2d',
    },
  },
  {
    _id: {
      $oid: '656a284452eb4340b6f13445',
    },
    app_id: {
      $oid: '6662072076b4c200013d3228',
    },
    c_at: '2023-12-01T18:39:00.458Z',
    message: 'We answer you as soon as possible. Have a great day 😊',
    title: 'Thank you for your review ! 🥳',
    trigger_id: {
      $oid: '64b0262852eb43073885ef53',
    },
    u_at: '2024-12-02T19:11:56.739Z',
    user_id: {
      $oid: '652dd2ac52eb4325f68e3f2d',
    },
  },
  {
    _id: {
      $oid: '656a28a752eb4340a8c5807a',
    },
    app_id: {
      $oid: '66326172d4347c000100ad29',
    },
    c_at: '2023-12-01T18:40:39.349Z',
    message:
      "Your review seems to be conclusive. We can't wait to meet you. Is this appointment match for you ? ==\u003e the 2023-12-04 at 10:00 AM. For more details go to your app (https://app.getkis.io/)",
    title: '🏆 Well done !',
    trigger_id: {
      $oid: '64b01edb52eb43072d9a2e32',
    },
    u_at: '2024-12-02T19:11:56.884Z',
    user_id: {
      $oid: '652dd2ac52eb4325f68e3f2d',
    },
  },
];
