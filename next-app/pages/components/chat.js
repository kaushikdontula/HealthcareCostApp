import React, { useState, useEffect, useRef } from 'react';
import { FiMenu, FiArrowUp } from 'react-icons/fi';

export default function ChatComponent() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleInputChange = (e) => setInput(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input) return;
    
        const userMessage = { text: input, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });
    
            if (!response.ok) throw new Error('Failed to get response from chatbot');
    
            const data = await response.json();
            const botMessage = { text: data.assistant_message, sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
    
        } catch (error) {
            console.error('Error:', error);
            setMessages((prevMessages) => [...prevMessages, { text: "Error fetching response", sender: "bot" }]);
        }
    
        setInput('');
    };

    return (
        <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-xl h-[75vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 text-white py-4 px-6 text-center text-lg font-semibold shadow-md w-full rounded-t-2xl">
                Healthcare Cost Assistant
            </div>

            {/* Main Chat Window */}
            <div className="flex flex-col flex-1 w-full p-6 overflow-hidden rounded-b-2xl bg-white shadow-xl h-[75vh]">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-4 max-w-xs md:max-w-md shadow-lg transition-all duration-300 rounded-xl ${
                                msg.sender === 'user'
                                    ? 'bg-teal-500 text-white self-end ml-auto rounded-br-none' // Rounded for user, no bottom-right corner
                                    : 'bg-gray-100 text-gray-800 self-start rounded-bl-none' // Rounded for bot, no bottom-left corner
                            }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Field */}
                <form onSubmit={handleSubmit} className="relative mx-auto w-full max-w-2xl">
                    <div className="flex items-center bg-gray-100 rounded-full shadow-sm p-2">
                        <input
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Message Healthcare Cost Assistant"
                            className="flex-1 p-3 pl-4 bg-transparent focus:outline-none text-gray-900"
                        />
                        <button
                            type="submit"
                            className="ml-2 bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 focus:ring-2 focus:ring-teal-400 transition duration-300 shadow-lg"
                        >
                            <FiArrowUp className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}