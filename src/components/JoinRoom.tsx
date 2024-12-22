import React, { useState } from "react";

interface JoinRoomProps {
    onCreateRoom: (nickname: string, userIcon: string) => Promise<void>;
    onJoinRoom: (nickname: string, roomId: string, userIcon: string) => Promise<void>;
}

const JoinRoom: React.FC<JoinRoomProps> = ({ onCreateRoom, onJoinRoom }) => {
    const [nickname, setNickname] = useState("");
    const [userIcon, setUserIcon] = useState("");
    const [roomId, setRoomId] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [preview, setPreview] = useState("");

    const handleCreateRoom = async () => {
        if (nickname) {
            await onCreateRoom(nickname, userIcon);
        } else {
            alert("Nickname is required");
        }
    };

    const handleJoinRoom = async () => {
        if (nickname && roomId) {
            await onJoinRoom(nickname, roomId, userIcon);
        } else {
            alert("Nickname and Room ID are required");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    if (typeof reader.result === "string") {

                        console.log("reader.result",reader.result)
                        setImage(reader.result);
                        //setPreview(reader.result); // For preview
                        setUserIcon(reader.result) // Convert to Base64                      
                    }

                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Join/Create Room</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <input
                        type="file"
                        placeholder="User Icon URL"
                        accept="image/*" onChange={(e)=>handleFileChange(e)}
                        
                    />

                    <button onClick={handleCreateRoom} className="w-full bg-blue-500 text-white py-2 rounded-lg focus:outline-none hover:bg-blue-600">Create Room</button>

                </div>

                <div className="flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className="w-3/5 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

{/* {preview && (
        <div className="mb-4">
          <h3 className="font-bold">Preview:</h3>
          <img src={preview} alt="Preview" className="max-w-full h-auto mt-2" />
        </div>
      )} */}
                    <button onClick={handleJoinRoom} className="ml-4 bg-green-500 text-white py-2 px-4 rounded-lg focus:outline-none hover:bg-green-600">Join Room</button>
                </div>

            </div>

        </div>
    );
};

export default JoinRoom;
