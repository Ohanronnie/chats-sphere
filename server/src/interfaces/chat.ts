export interface IChat {
  email: string;
  chats: [
    {
      [key: string]: [
        {
          from: string;
          message: string;
          createdAt: string;
          url?: string;
          to: string;
        }
      ];
    }
  ];
}
export interface IMethod extends IChat {
  save(): void;
}
