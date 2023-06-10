enum status {
  pending = "Pending",
  active = "Active",
}
export interface IUser {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  createdAt?: Date;
  confirmCode: string;
  isOnline?: boolean;
  cover?: string;
  status?: string;
}
export interface IMethod extends IUser {
  isModified(value: string): boolean;
  isNew: boolean;
  save(): void;
}
