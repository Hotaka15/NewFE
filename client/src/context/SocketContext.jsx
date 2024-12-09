// SocketContext.js
import React, { createContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const socket = io("ws://localhost:3005", {
    reconnection: true,
    transports: ["websocket"],
  });
  const userId = user?._id;

  useEffect(() => {
    socket.emit("userOnline", { userId });
    socket.emit("joinGroup", { userId, groupId: userId });
    return () => {
      socket.emit("userOffline", { userId });
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => React.useContext(SocketContext);
