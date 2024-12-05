// components/ChatComponent.js
import React, { useState } from 'react';
import styles from '../../styles/Chatbot.module.css';

export default function ChatComponent() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input) return;

        // Add user message to chat
        const userMessage = { text: input, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        // Call the ChatGPT API
        const response = await fetch('/api/chatgpt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: input }),
        });

        const data = await response.json();
        const botMessage = { text: data.reply, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);

        // Clear input
        setInput('');
    };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatDisplay}>
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender === 'user' ? styles.userMessage : styles.botMessage}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className={styles.inputForm}>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className={styles.inputBox}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};