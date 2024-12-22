import React, { useState, useEffect } from "react";
import { TelepartyClient, SocketMessageTypes, SessionChatMessage } from "teleparty-websocket-lib";
import { TypingMessageData } from "../services/WebSocketService";

interface ChatRoomProps {
    client: TelepartyClient;
    roomId: string;
    messages: (SessionChatMessage & { imageBase64?: string })[]; // Pass messages as a prop
    typingIndicator: boolean
}

const ChatRoom: React.FC<ChatRoomProps> = ({ client, roomId, messages,typingIndicator }) => {
    const [message, setMessage] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false); 

    console.log("messages in chat compo", messages)



    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        if (!isTyping) {
          setIsTyping(true);
          client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, { typing: true });
        }
    
        // Stop typing after a delay
        const timeout = setTimeout(() => {
          setIsTyping(false);
          client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, { typing: false });
        }, 1000);
    
        return () => clearTimeout(timeout); // Clear timeout if user keeps typing
      };


    const sendMessage = () => {
        if (message || image) {
            const messagePayload: any = { body: message }; // Create the message payload
            if (image) {
                messagePayload.imageBase64 = image; // Add image if available
            }
            client.sendMessage(SocketMessageTypes.SEND_MESSAGE, messagePayload);
            setMessage("");
        }
    };



    return (
        <div className="flex flex-col items-center justify-center">
            <h2>Chat Room: {roomId}</h2>
            <div>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className="flex items-center space-x-4 border-b border-gray-300 py-2"
                    >
                        {msg.userIcon && (
                            <img
                                src={msg.userIcon}
                                alt="Uploaded"
                                className="w-10 h-10 rounded-full"
                            />
                        )}
                        <div className="flex-1">
                            <strong className="block text-gray-700">{msg.userNickname || "System"}</strong>
                            <p className="text-sm text-gray-500">{msg.body}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => 
                        
                        handleTyping(e)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button onClick={sendMessage} className="ml-4 bg-green-500 text-white py-2 px-4 rounded-lg focus:outline-none hover:bg-green-600">Send</button>
                
            </div>

            <div className="flex mr-[19%] text-xs">{typingIndicator && <span>Someone is typing...</span>}</div>
        </div>
    );
};

export default ChatRoom;
