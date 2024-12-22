import React, { useState } from "react";
import { createWebSocketClient } from "./services/WebSocketService";
import JoinRoom from "./components/JoinRoom";
import ChatRoom from "./components/ChatRoom";
import { SessionChatMessage, SocketMessageTypes, TelepartyClient } from "teleparty-websocket-lib";

const App: React.FC = () => {
  const [client, setClient] = useState<TelepartyClient | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);
  const [typingIndicator, setTypingIndicator] = useState(false);

  const initializeClient = () => {
    const newClient = createWebSocketClient(
      (msg) => {
        console.log("Received message:", msg);
        setMessages((prev) => [...prev, msg]); // Append new messages to the array
      },
      (typing) => {
        console.log("Received message:", typing);
        // if (localStorage.getItem('isTyping') == 'true') {
        //   setTypingIndicator(true); //library issue, anyoneTyping always coming false
        // }
        // if (localStorage.getItem('isTyping') == 'false') {
        //   setTypingIndicator(false);
        // }
        setTypingIndicator(typing);
      });
    setClient(newClient);
  };

  const createRoom = async (nickname: string, userIcon: string) => {
    if (client) {
      const newRoomId = await client.createChatRoom(nickname, userIcon);
      setRoomId(newRoomId);
    }
  };

  const joinRoom = async (nickname: string, roomId: string, userIcon: string) => {
    if (client) {
      const previousMessages = await client.joinChatRoom(nickname, roomId, userIcon);

      setMessages(previousMessages.messages);
      console.log("previousMessages",previousMessages)
      setRoomId(roomId);

    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Teleparty Chat</h1>
      {!client && <button onClick={initializeClient}>Initialize WebSocket</button>}
      {roomId ? (
        client &&
        <div className="chatRoom w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg">
          <ChatRoom client={client} roomId={roomId} messages={messages} typingIndicator={typingIndicator} />
        </div>

      ) : (
        <div className="joinRoom w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <JoinRoom onCreateRoom={createRoom} onJoinRoom={joinRoom} />

        </div>
      )}
    </div>
  );
};

export default App;
