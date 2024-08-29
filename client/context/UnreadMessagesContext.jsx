import React, { createContext, useState, useContext } from "react";

const UnreadMessagesContext = createContext();

export const UnreadMessagesProvider = ({ children }) => {
  const [totalUnreadMessages, setTotalUnreadMessages] = useState();

  return (
    <UnreadMessagesContext.Provider
      value={{ totalUnreadMessages, setTotalUnreadMessages }}
    >
      {children}
    </UnreadMessagesContext.Provider>
  );
};

export const useUnreadMessages = () => useContext(UnreadMessagesContext);
