import { TelepartyClient, SocketEventHandler, SocketMessageTypes, SessionChatMessage, MessageList } from "teleparty-websocket-lib";
import { SocketMessage } from "teleparty-websocket-lib/lib/SocketMessage";

export type MessageCallback = (message: SessionChatMessage) => void;
export type TypingCallback = (typing: boolean) => void;

export interface TypingMessageData {
    anyoneTyping:boolean  
}


export const createWebSocketClient = (onMessageCallback: MessageCallback,onTypingCallback: TypingCallback): TelepartyClient => {
  const eventHandler: SocketEventHandler = {
    onConnectionReady: () => {
      console.log("Connection established");
    },
    onClose: () => {
      alert("Connection closed. Please reload.");
    },

    onMessage: (message: SocketMessage) => {
        // Check if the message is of the type you expect

        console.log("message",message.type)

        if (message.type === SocketMessageTypes.SEND_MESSAGE) {
          const chatMessage = message.data as SessionChatMessage;
          console.log("Chat message:", chatMessage); // Verify this logs the expected message
          onMessageCallback(chatMessage);

        }else if (message.type === SocketMessageTypes.SET_TYPING_PRESENCE) {
            const typingMessage = message.data as TypingMessageData;
            console.log("typingMessage1",typingMessage)
            console.log("typingMessage2",message)
            onTypingCallback(typingMessage.anyoneTyping);


        }else if (message.type === SocketMessageTypes.JOIN_SESSION) {
            const messageHistory = message.data as MessageList;
            console.log("Previous messages:", messageHistory); // Debug log
            //messageHistory.forEach((msg) => onMessageCallback(msg)); // Add previous messages
          } else {
          console.warn("Unhandled message type:", message.type);
        }
    },
  };

  return new TelepartyClient(eventHandler);
};
