import { useState, useEffect, useRef } from "react";
import MainLayout from "../components/layout/MainLayout";

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        user: "Me",
        text: message,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <MainLayout>
      <div className="flex justify-center md:ml-[14dvw] lg:ml-[13dvw] xl:ml-[19dvw] 2xl:ml-[10dvw] w-full md:max-w-4xl xl:max-w-5xl h-full">
        {/* User List */}
        <div className="p-3 lg:w-1/3 h-full">
          <div className="bg-white dark:bg-black p-4 rounded-lg w-full h-full">
            <h2 className="mb-4 font-bold text-xl">Users</h2>
            <ul className="rounded-md h-[calc(100dvh-100px)] overflow-y-auto hide-scrollbar">
              {users.map((user) => (
                <li
                  key={user.id}
                  className={`flex justify-between items-center p-3 mb-2 rounded-lg cursor-pointer transition-all ${
                    selectedUser?.id === user.id
                      ? "bg-blue-400 dark:bg-blue-600"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.profilePic}
                      alt={user.fullName}
                      className="rounded-full w-10 h-10"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold">{user.fullName}</span>
                      <span className="text-gray-600 text-sm dark:text-gray-400">
                        {user.username}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`w-3 h-3 rounded-full ${
                      user.status === "online" ? "bg-green-500" : "bg-gray-500"
                    }`}
                  ></span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col py-3 w-full md:w-[430px] lg:w-[450px] xl:w-[700px]">
          <div className="flex flex-col flex-1 bg-white dark:bg-black p-4 rounded-lg w-full">
            <div className="flex justify-between items-center border-gray-300 dark:border-gray-700 mb-4 pb-2 border-b">
              <div className="flex justify-between items-center px-3 w-full h-10 font-semibold">
                {selectedUser ? (
                  <>
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedUser.profilePic}
                        alt={selectedUser.fullName}
                        className="rounded-full w-10 h-10"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {selectedUser.fullName}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {selectedUser.username}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`w-3 h-3 rounded-full ${
                        selectedUser.status === "online"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    ></span>
                  </>
                ) : (
                  <p className="text-2xl">Select a user to chat</p>
                )}
              </div>
            </div>

            {/* Message Area */}
            <div className="flex flex-col flex-1 gap-1 bg-gray-300 dark:bg-gray-700 p-4 rounded-lg max-h-[calc(100dvh-195px)] overflow-y-auto hide-scrollbar">
              <div className="flex justify-center">
                <div className="bg-gray-400 dark:bg-gray-600 bg-opacity-10 px-3 py-1 rounded-lg max-w-xs text-sm">
                  <p className="font-medium">1-10-2025</p>
                </div>
              </div>
              {selectedUser ? (
                messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.user === "Me" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg text-sm ${
                          msg.user === "Me" ? "bg-blue-400 dark:bg-blue-600" : "bg-gray-600"
                        } max-w-xs`}
                      >
                        <p className="font-medium">{msg.text}</p>
                        <span className="block mt-1 text-gray-300 text-xs">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400">
                    No messages yet. Say hi!
                  </p>
                )
              ) : (
                <p className="text-center text-gray-400">
                  Select a user to start chatting.
                </p>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-1 pt-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    selectedUser
                      ? "Type a message"
                      : "Select a user to start chatting"
                  }
                  className="flex-1 border-gray-200 dark:border-gray-800 bg-gray-300 dark:bg-gray-700 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  disabled={!selectedUser}
                />
                <button
                  onClick={handleSendMessage}
                  className={`px-6 sm:px-3 lg:px-6 py-3 rounded-lg text-white transition-all hover:scale-105 ${
                    selectedUser
                      ? "bg-blue-400 dark:bg-blue-600"
                      : "bg-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!selectedUser || !message.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;

// Users Data (sample users for demonstration)
const users = [
  {
    id: 1,
    username: "@alice",
    fullName: "Alice Smith",
    status: "online",
    profilePic: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 2,
    username: "@bob",
    fullName: "Bob Johnson",
    status: "offline",
    profilePic: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: 3,
    username: "@charlie",
    fullName: "Charlie Brown",
    status: "online",
    profilePic: "https://i.pravatar.cc/100?img=3",
  },
  {
    id: 4,
    username: "@diana",
    fullName: "Diana Prince",
    status: "online",
    profilePic: "https://i.pravatar.cc/100?img=4",
  },
  {
    id: 5,
    username: "@eve",
    fullName: "Eve Adams",
    status: "offline",
    profilePic: "https://i.pravatar.cc/100?img=5",
  },
  {
    id: 6,
    username: "@frank",
    fullName: "Frank Castle",
    status: "online",
    profilePic: "https://i.pravatar.cc/100?img=6",
  },
  {
    id: 7,
    username: "@grace",
    fullName: "Grace Hopper",
    status: "offline",
    profilePic: "https://i.pravatar.cc/100?img=7",
  },
  {
    id: 8,
    username: "@henry",
    fullName: "Henry Cavill",
    status: "online",
    profilePic: "https://i.pravatar.cc/100?img=8",
  },
  {
    id: 9,
    username: "@irene",
    fullName: "Irene Adler",
    status: "offline",
    profilePic: "https://i.pravatar.cc/100?img=9",
  },
  {
    id: 10,
    username: "@jack",
    fullName: "Jack Sparrow",
    status: "online",
    profilePic: "https://i.pravatar.cc/100?img=10",
  },
  {
    id: 11,
    username: "@kate",
    fullName: "Kate Bishop",
    status: "online",
    profilePic: "https://i.pravatar.cc/100?img=11",
  },
  {
    id: 12,
    username: "@leo",
    fullName: "Leonardo Da Vinci",
    status: "offline",
    profilePic: "https://i.pravatar.cc/100?img=12",
  },
  {
    id: 13,
    username: "@mia",
    fullName: "Mia Wong",
    status: "online",
    profilePic: "https://i.pravatar.cc/100?img=13",
  },
  {
    id: 14,
    username: "@noah",
    fullName: "Noah Centineo",
    status: "offline",
    profilePic: "https://i.pravatar.cc/100?img=14",
  },
  {
    id: 15,
    username: "@olivia",
    fullName: "Olivia Wilde",
    status: "online",
    profilePic: "https://i.pravatar.cc/100?img=15",
  },
];
