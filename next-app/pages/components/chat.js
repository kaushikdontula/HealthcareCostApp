import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function ChatComponent() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Health check API
    const [healthStatus, setHealthStatus] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch health check status from the backend
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

        const response = await fetch('/api/chatgpt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input }),
        });

        const data = await response.json();
        const botMessage = { text: data.reply, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);

        setInput('');
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen relative">
            {/* Sidebar */}
            <div
                className={`fixed top-16 left-0 bg-[#1A202C] text-gray-200 w-64 h-full p-4 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* X Icon positioned at the top right of the sidebar */}
                <button
                    onClick={toggleSidebar}
                    className="absolute top-4 right-4 text-white p-2 rounded-md focus:outline-none"
                >
                    <FiX size={24} />
                </button>

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

            {/* Main Chat Area */}
            <div
                className={`flex-1 bg-gradient-to-r from-teal-700 to-blue-800 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-64' : ''}`}
            >
                {/* Sidebar Toggle Button */}
                {!sidebarOpen && (
                    <button
                        onClick={toggleSidebar}
                        className="absolute top-4 left-4 text-white p-2 rounded-md focus:outline-none z-20"
                    >
                        <FiMenu size={24} />
                    </button>
                )}

                {/* Chat Header */}
                <h2 className="text-2xl font-bold text-white mb-4 text-center w-full mt-15">
                    Healthcare Cost Assistant
                </h2>

                {/* Display Health Check Status */}
                <div className="mb-4 text-center">
                    {healthStatus ? (
                        <p className="text-white">
                            <strong>Status:</strong> {healthStatus.status} |{" "}
                            <strong>Message:</strong> {healthStatus.message}
                        </p>
                    ) : error ? (
                        <p className="text-red-400">{error}</p>
                    ) : (
                        <p className="text-white">Fetching health check status...</p>
                    )}
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="mt-4 flex justify-center">
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Message Healthcare Cost Assistant"
                        className="w-full max-w-3xl p-4 border border-gray-300 rounded-l-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                    <button
                        type="submit"
                        className="bg-teal-500 text-white px-6 py-3 rounded-r-lg hover:bg-teal-600 focus:ring-2 focus:ring-teal-400 transition-all"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
