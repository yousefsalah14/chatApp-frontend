import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore.js";
import ChatSkeleton from "./ChatSkeleton.jsx";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { formatMessageTime } from "../lib/utils.js";

function Chat() {
  const { messages, getMessages, isMessagesLoading, selectedUser ,subscribeToMessages ,unsubscribeFromMessages } =
    useChatStore();
    const{authUser} =useAuthStore();
    const messageEndRef = useRef(null);
  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages()
    return () => {
        unsubscribeFromMessages()
    }
  }, [selectedUser._id, getMessages , subscribeToMessages,unsubscribeFromMessages]);
  useEffect(() => {
    if(messageEndRef.current && messages) 
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  if (isMessagesLoading) {
    return (
      <div className="flex-1 felx flex-col overflow-auto">
        <ChatHeader />
        <ChatSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

        <div className="flex-1  overflow-y-autospace-y-2  p-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.sender === authUser.user._id ? "chat-end " : "chat-start "}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.sender === authUser.user._id
                      ? authUser.user.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
        
            <div className={`chat-bubble flex flex-col ${ message.sender === authUser.user._id? "bg-primary text-primary-content" : "bg-base-200"}`}>
              {message.img && (
                <img
                  src={message.img}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p className={`${ message.sender === authUser.user._id? "text-primary-content/70" : "text-base-content/70"}`}>{message.text}</p>}
            </div>
            <div className="chat-header mb-1">
            <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
                </div>
      
          </div>
        ))}
            </div>
         
      <MessageInput />
    </div>
  );
}

export default Chat;
