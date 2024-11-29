export default interface DashboardAccessInterface {
  id: {
    id: string;
    display: boolean;
    favorite: boolean;
  };
  logo: string;
  name: string;
  description?: string;
  display: boolean;
  favorite: boolean;
  user_attributes: any;
}
