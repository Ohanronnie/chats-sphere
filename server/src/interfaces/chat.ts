export interface IChat {
  email: string;
  chats: [
    {
      [key: string]: [
        {
          from: string;
          message: string;
        }
      ];
    }
  ];
}
export interface IMethod extends IChat {
  save(): void;
}
