import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  // Use a simple session ID. In a real app, generate a specialized UUID or use a user ID.
  const [sessionId] = useState(`session-${Math.floor(Math.random() * 100000)}`);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("https://chatbot-rasa-irvj.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: sessionId,
          message: userMessage.text,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Rasa returns an array of messages
      const botMessages = data.map((msg) => ({
        text: msg.text,
        sender: "bot",
      }));

      setMessages((prev) => [...prev, ...botMessages]);
    } catch (error) {
      console.error("Error communicating with Rasa:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error: Could not connect to the chatbot server. Make sure it's running!", sender: "bot" },
      ]);
    }
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <h3>Crime Reporting Assistant</h3>
          <p>We are here to help you safely.</p>
        </div>
        <div className="chatbot-messages">
          {messages.length === 0 && (
            <div className="empty-state">
              <p>👋 Hi there! How can we assist you today?</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chatbot-input-area">
          <input
            type="text"
            className="chatbot-input"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button className="chatbot-send" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
