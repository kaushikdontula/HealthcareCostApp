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
        <div className="relative flex">
            {/* Chat Container */}
            <div className={`relative flex shadow-xl flex-col bg-transparent max-w-[1200px] rounded-xl shadow-xl p-6 border-2 border-gray-700 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-2/3' : 'w-full'} h-[calc(100vh-15rem)]`}>
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
                            className={`p-4 mb-4 rounded-lg ${msg.sender === 'user' ? 'bg-blue-700 self-end' : 'bg-gray-700'}`}
                        >
                            <p className="font-medium">{msg.sender === 'user' ? 'You' : 'Bot'}</p>
                            <p>{msg.text}</p>
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
                    className="w-2/3 p-6 bg-gray-700 text-gray-200 shadow-lg ml-5 shadow-xl transition-x-full duration-600 rounded-lg ease-in-out h-[calc(100vh-15rem)] overflow-y-auto"
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


// import React, { useState, useEffect } from 'react';
// import { FiMenu, FiX } from 'react-icons/fi';

// export default function ChatComponent() {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState('');
//     const [sidebarOpen, setSidebarOpen] = useState(false);

//     // Health check API
//     const [healthStatus, setHealthStatus] = useState(null);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         // Fetch health check status from the backend
//         const fetchHealthCheck = async () => {
//             try {
//                 const response = await fetch('http://127.0.0.1:8000/api/healthcheck/');
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch health check status');
//                 }
//                 const data = await response.json();
//                 setHealthStatus(data);
//             } catch (err) {
//                 setError(err.message);
//             }
//         };

//         fetchHealthCheck();
//     }, []);

//     const handleInputChange = (e) => setInput(e.target.value);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!input) return;

//         const userMessage = { text: input, sender: 'user' };
//         setMessages((prevMessages) => [...prevMessages, userMessage]);

//         const response = await fetch('/api/chatgpt', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ message: input }),
//         });

//         const data = await response.json();
//         const botMessage = { text: data.reply, sender: 'bot' };
//         setMessages((prevMessages) => [...prevMessages, botMessage]);

//         setInput('');
//     };

//     const toggleSidebar = () => {
//         setSidebarOpen(!sidebarOpen);
//     };

//     return (
//         <div className="flex h-screen relative">
//             {/* Sidebar */}
//             <div
//                 className={`fixed top-16 left-0 bg-[#1A202C] text-gray-200 w-64 h-full p-4 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
//             >
//                 {/* X Icon positioned at the top right of the sidebar */}
//                 <button
//                     onClick={toggleSidebar}
//                     className="absolute top-4 right-4 text-white p-2 rounded-md focus:outline-none"
//                 >
//                     <FiX size={24} />
//                 </button>

//                 <h2 className="text-xl font-semibold mb-4">Chat History</h2>
//                 <ul className="overflow-y-auto h-full">
//                     {messages.map((msg, index) => (
//                         <li key={index} className="mb-2 p-3 rounded-lg bg-gray-800">
//                             <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong>
//                             <p>{msg.text}</p>
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             {/* Main Chat Area */}
//             <div
//                 className={`flex-1 bg-white rounded-lg p-6 transition-all duration-300 ${sidebarOpen ? 'ml-64' : ''}`}
//             >
//                 {/* Sidebar Toggle Button */}
//                 {!sidebarOpen && (
//                     <button
//                         onClick={toggleSidebar}
//                         className="absolute top-4 left-4 text-gray-900 p-2 rounded-md focus:outline-none z-20"
//                     >
//                         <FiMenu size={24} />
//                     </button>
//                 )}

//                 {/* Chat Header */}
//                 <h2 className="text-4xl font-semibold text-gray-900 text-center">
//                     Healthcare Cost Assistant
//                 </h2>

//                 {/* Display Health Check Status */}
//                 <div className="mb-4 text-center">
//                     {healthStatus ? (
//                         <p className="text-white">
//                             <strong>Status:</strong> {healthStatus.status} |{" "}
//                             <strong>Message:</strong> {healthStatus.message}
//                         </p>
//                     ) : error ? (
//                         <p className="text-red-400">{error}</p>
//                     ) : (
//                         <p className="text-white">Fetching health check status...</p>
//                     )}
//                 </div>

//                 {/* Input Form */}
//                 <form onSubmit={handleSubmit} className="mt-4 flex justify-center">
//                     <input
//                         type="text"
//                         value={input}
//                         onChange={handleInputChange}
//                         placeholder="Message Healthcare Cost Assistant"
//                         className="w-full max-w-3xl p-4 border border-gray-300 rounded-l-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
//                     />
//                     <button
//                         type="submit"
//                         className="bg-teal-500 text-white px-6 py-3 rounded-r-lg hover:bg-teal-600 focus:ring-2 focus:ring-teal-400 transition-all"
//                     >
//                         Send
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }
