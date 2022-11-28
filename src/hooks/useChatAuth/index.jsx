import { useContext } from "react";
import { ChatContext } from "../../contexts/ChatContext";

const useChatAuth = () => {
  return useContext(ChatContext);
};

export default useChatAuth;
