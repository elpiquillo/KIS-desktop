export default interface DashboardAccessInterface {
  id: {
    id: string;
    display: boolean;
  };
  logo: string;
  name: string;
  description?: string;
  favorite?: boolean;
  user_attributes: any;
}
