export interface IMeta {
  touched: boolean;
  error: null | string;
}
export interface IProps {
  label: string;
  [key: string]: any;
}
export interface IForm {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}
