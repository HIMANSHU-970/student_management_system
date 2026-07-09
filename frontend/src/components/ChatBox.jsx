import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { getContacts, getConversation, sendMessage } from "../services/messageService";
import "../styles/chat.css";

const socket = io("http://localhost:5002");

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // 1. Socket Listener: Real-time update
  useEffect(() => {
    if (user) {
      socket.emit("join", user.id);
    }

    const handleReceive = (newMessage) => {
      // Yahan hum check kar rahe hain ki kya message abhi ki open chat ka hai
      setMessages((prev) => {
        // Agar activeContact open hai aur message usi ka hai, toh add karein
        if (activeContact && newMessage.senderId === activeContact.id) {
          return [...prev, newMessage];
        }
        return prev;
      });
    };

    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, [user, activeContact]); // activeContact add kiya taaki closure issue na ho

  // 2. Load Contacts
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const res = await getContacts();
        setContacts(res.data || []);
      } catch (err) { console.error(err); }
    };
    loadContacts();
  }, []);

  // 3. Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openConversation = async (contact) => {
    setActiveContact(contact);
    try {
      const res = await getConversation(contact.id);
      setMessages(res.data || []);
    } catch (err) { console.error(err); }
  };

  const handleSend = async () => {
    if (!input.trim() || !activeContact) return;

    const payload = { receiverId: activeContact.id, content: input };
    try {
      const res = await sendMessage(payload);
      const sentMsg = res.data.data || res.data;
      
      setMessages(prev => [...prev, sentMsg]);
      
      // Socket emit - Backend ke event "send_message" ke sath match karein
      socket.emit("send_message", { ...sentMsg, senderId: user.id, receiverId: activeContact.id });
      setInput("");
    } catch (err) { console.error("Send failed", err); }
  };

  return (
    <div className="chat-page">
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">💬 Contacts</div>
        {contacts.map(c => (
          <div key={c.id} className={`chat-contact ${activeContact?.id === c.id ? "active" : ""}`} onClick={() => openConversation(c)}>
            <div className="chat-contact-avatar">{c.name?.charAt(0).toUpperCase()}</div>
            <div>
              <div className="chat-contact-name">{c.name}</div>
              <div className="chat-contact-email">{c.email}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-main">
        {!activeContact ? (
          <div className="chat-empty-state">Select a contact to start chatting</div>
        ) : (
          <>
            <div className="chat-main-header">💬 {activeContact.name}</div>
            <div className="chat-messages">
              {messages.map((m, idx) => (
                <div key={m.id || idx} className={`chat-bubble ${m.senderId === user.id ? "sent" : "received"}`}>
                  {m.content}
                  <div className="chat-bubble-time">{new Date(m.createdAt).toLocaleTimeString()}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-bar">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} />
              <button onClick={handleSend}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatBox;