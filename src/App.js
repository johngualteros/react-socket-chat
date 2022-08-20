import "./App.css";
import io from "socket.io-client";
import { useState, useEffect } from "react";

const socket = io("http://localhost:4000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      body: "",
      from: "",
    },
  ]);

  useEffect(() => {
    const receiveMessage = (message) => {
      setMessages([message, ...messages]);
    };
    socket.on("message", receiveMessage);

    return () => {
      socket.off("message", receiveMessage);
    };
  }, [messages]);

  const handleChange = (e) => {
    setMessage(e.target.value);
    console.log(message);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    const newMessage = {
      body: message,
      from: "Me",
    };
    setMessages([newMessage, ...messages]);
    setMessage("");
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-md border-2 border-green-500 h-auto  w-3/12 p-0"
      >
        <div className="bg-green-500 text-white font-bold p-2 text-center text-2xl m-0 h-2/12">
          <h1>Chat App</h1>
        </div>
        <div className="h-80 min-h- overflow-y-auto">
          <ul>
            {messages.map((message, index) => (
              <li key={index} className={`m-2 rounded-md p-3 table ${message.from === "Me" ? 'bg-green-400 ml-auto' : 'bg-zinc-200'}`}>
                <p>
                  <small className="font-bold">{message.from}</small>
                  <br />
                  {message.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="h-2/12">
          <input
            type="text"
            placeholder="Enter a Message"
            onChange={handleChange}
            value={message}
            className="p-1 border-2 border-zinc-300 m-3 outline-none rounded-md bg-transparent"
          />
          <button type="submit" className="bg-green-500 rounded py-2 px-8">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
