export interface IMessage {
  from: string;
  to: string;
  url?: string;
  message: string;
  createdAt: Date;
}
