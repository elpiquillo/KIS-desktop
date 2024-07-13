export default interface ApplicationInterface {
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
