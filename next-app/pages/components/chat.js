import React, { useState, useEffect } from 'react';
import { FiMenu, FiX, FiSend } from 'react-icons/fi';

export default function ChatComponent() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Health check API
    const [healthStatus, setHealthStatus] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHealthCheck = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/healthcheck/');
                if (!response.ok) {
                    throw new Error('Failed to fetch health check status');
                }
                const data = await response.json();
                setHealthStatus(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchHealthCheck();
    }, []);

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

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };


    return (
        <div className="relative flex">
            {/* Chat Container */}
            <div className={`relative flex shadow-xl flex-col bg-transparent  max-w-[1200px] rounded-xl shadow-xl p-6 border-2 border-gray-700 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-2/3' : 'w-full'} h-[calc(100vh-15rem)]`}>
                {/* Health Check Status */}
                {healthStatus && (
                    <div className="text-black mb-4">
                        <h3 className="font-semibold">Health Check Status:</h3>
                        <p>Status: {healthStatus.status}</p>
                    </div>
                )}
                {error && (
                    <div className="text-red-500 mb-4">
                        <p>Error: {error}</p>
                    </div>
                )}
    
                {/* Chat Messages Container */}
                <div className="flex-1 overflow-y-auto space-y-4 max-h-[70vh]">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-4 max-w-xs md:max-w-md shadow-lg transition-all duration-300 rounded-xl ${
                                msg.sender === 'user'
                                    ? 'bg-gray-100 text-gray-800 self-end ml-auto rounded-br-none' // Rounded for user, no bottom-right corner
                                    : 'bg-gray-600 text-gray-100 self-start rounded-bl-none' // Rounded for bot, no bottom-left corner
                            }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>
    
                {/* Bottom Input Section: Chat History Button, Message Input, and Send Button */}
                <div className="flex items-center w-full mt-4 space-x-4">
                    {/* Chat History Button */}
                    <button
                        onClick={toggleSidebar}
                        className="text-black p-2 rounded-lg"
                    >
                        <FiMenu size={24} />
                    </button>
    
                    {/* Message Input */}
                    <form onSubmit={handleSubmit} className="flex-1 flex items-center space-x-4">
                        <input
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Message Healthcare Cost Assistant"
                            className="w-full p-4 bg-gray-700 text-gray-100 border border-gray-900 rounded-lg shadow-xl focus:outline-none transition-all"
                        />
                    </form>
    
                    {/* Send Button */}
                    <button
                        onClick={handleSubmit}
                        className="text-black p-4 rounded-full hover:bg-white shadow-xl focus:ring-2 border-2 border-black focus:ring-black transition-all transform hover:scale-105"
                    >
                        <FiSend size={20} />
                    </button>
                </div>
            </div>
    
            {/* Sidebar: Chat History */}
            {sidebarOpen && (
                <div
                    className="w-2/3 p-6 bg-gray-700 text-gray-200 shadow-lg ml-5 shadow-xl transition-all duration-300 ease-in-out rounded-lg ease-in-out h-[calc(100vh-15rem)] overflow-y-auto"
                >
                    {/* Chat History */}
                    <h2 className="text-xl font-semibold mb-4">Chat History</h2>
                    <ul className="overflow-y-auto h-full">
                        {messages.map((msg, index) => (
                            <li key={index} className="mb-2 p-3 rounded-lg bg-gray-800">
                                <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong>
                                <p>{msg.text}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
    
    
}