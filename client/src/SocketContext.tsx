import { FC, createContext, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

// Create a Socket.IO context
export const SocketContext = createContext<Socket | null>(null);
type SocketProviderProps = {
  children: ReactNode;
};
// Define a SocketContext provider component
export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  let socket: Socket = io(import.meta.env.VITE_BACK_URL);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
