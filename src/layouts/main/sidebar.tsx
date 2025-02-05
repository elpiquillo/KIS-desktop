import { Card, Stack } from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import { useGetDashboardAccessesAll } from 'src/apis/dashboard-access';
import { useGetNotifications } from 'src/apis/notifications';
import { NavAppSection } from 'src/components/nav-app-section';
import { useDashboardAccessState } from 'src/store/dashboardAccessState';
import { useNotificationState } from 'src/store/notificationState';
import { hideScroll } from 'src/theme/css';
import { NotificationData } from 'src/types/notification-interface';
import { NAV } from '../config-layout';
import AccountPopover from './account-popover';

const mockNotifications: NotificationData[] = [
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

// ----------------------------------------------------------------------

export default function Sidebar({ sx }: BoxProps) {
  const applications = useDashboardAccessState((s) =>
    s.applications.filter((app) => app.id.display && app.favorite)
  );
  const notifications = useNotificationState((state) => state.notifications);

  const { data } = useGetDashboardAccessesAll(
    applications === undefined || applications.length === 0
  );
  const { data: dataNotifications } = useGetNotifications();

  return (
    <Card
      sx={{
        border: 'none',
        flexShrink: 0, // Sidebar keeps its width
        flexGrow: 1, // Ensures it stretches to fill the parent's height
        height: '100%', // Ensures full height matching Main
        display: 'flex',
        flexDirection: 'column',
        width: { lg: NAV.W_MINI },
        ...sx,
      }}
    >
      <Stack
        sx={{
          flex: 1,
          justifyContent: 'space-between',
          pt: 2,
          pb: 2,
          height: '100%', // Matches the Card's height
          position: 'relative', // Avoid breaking layout
          width: NAV.W_MINI, // Sidebar width
          ...hideScroll.x,
        }}
      >
        <NavAppSection applications={applications || data} notifications={mockNotifications} />
        <Box sx={{ flex: 1 }} />
        <Box sx={{ mx: 'auto' }}>
          <AccountPopover />
        </Box>
      </Stack>
    </Card>
  );
}
