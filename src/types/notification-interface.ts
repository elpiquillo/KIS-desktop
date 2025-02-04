export interface NotificationData {
  title: string;
  message: string;
  c_at: string;
  u_at: string;
  _id: {
    $oid: string;
  };
  app_id: {
    $oid: string;
  };
  user_id: {
    $oid: string;
  };
  trigger_id: {
    $oid: string;
  };
}
