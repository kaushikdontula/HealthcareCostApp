import React, { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiSend } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa'; // Robot icon

export default function ChatComponent() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);
    const chatContainerRef = useRef(null); // Ref for the chat window container
    const [botTyping, setBotTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Simulate initial bot message
    useEffect(() => {
        simulateTypingEffect("Hello! Feel free to ask me any questions regarding your healthcare cost concerns.", 40);
    }, []);

    // Automatically scroll the chat window to the bottom when messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);


    // Simulate typing effect for bot messages
    const simulateTypingEffect = (fullText, speed = 15) => {
        setBotTyping(true);
        let index = 0;
        let typingMessage = { text: "", sender: "bot" };
        setMessages((prevMessages) => [...prevMessages, typingMessage]);

        const interval = setInterval(() => {
            index++;
            setMessages((prevMessages) => {
                const lastMessageIndex = prevMessages.length - 1;
                const updatedMessages = [...prevMessages];
                updatedMessages[lastMessageIndex] = { text: fullText.slice(0, index), sender: "bot" };
                return updatedMessages;
            });

            if (index === fullText.length) {
                clearInterval(interval);
                setBotTyping(false);
            }
        }, speed);
    };

    // Handle input change
    const handleInputChange = (e) => setInput(e.target.value);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input) return;
    
        const userMessage = { text: input, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput('');
        
        setIsLoading(true);
        setBotTyping(true);
        
        // Show loading message
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: "Thinking ...", sender: "bot", loading: true }
        ]);
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_input: input }),
            });
    
            if (!response.ok) throw new Error('Failed to get response from chatbot');
    
            const data = await response.json();
    
            // Remove loading message before adding actual response
            setMessages((prevMessages) => prevMessages.slice(0, -1));
    
            simulateTypingEffect(data.assistant_message, 20);
        } catch (error) {
            console.error('Error:', error);
            setMessages((prevMessages) => [
                ...prevMessages.slice(0, -1), // Remove loading message
                { text: "Error fetching response", sender: "bot" },
            ]);
        } finally {
            setIsLoading(false);
            setBotTyping(false);
        }
    };    

    return (
        <div className="relative flex justify-center items-center p-6 w-full mx-auto">
            {/* Chat Container */}
            <div className="relative flex flex-col bg-gray-50 w-full max-w-[100%] rounded-xl p-6 h-[calc(100vh-15rem)]">
                {/* Chat Messages Container */}
                <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto space-y-4 max-h-[70vh]"
                >
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-4 w-full md:max-w-md shadow-lg transition-all duration-300 rounded-xl flex items-center ${
                                msg.sender === 'user'
                                    ? 'bg-gray-100 text-gray-800 self-end ml-auto rounded-br-none' // User msg
                                    : 'bg-gray-700 text-gray-100 self-start rounded-bl-none' // Bot msg
                            }`}
                        >
                            {msg.sender === 'bot' && isLoading && msg.loading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-gray-100 border-t-transparent animate-spin rounded-full"></div>
                                    <span>{msg.text}</span>
                                </div>
                            ) : (
                                msg.text
                            )}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                {/* Bottom Input Section: Chat History Button, Message Input, and Send Button */}
                <div className="flex items-center w-full mt-4 space-x-4">    
                    {/* Message Input */}
                    <form onSubmit={handleSubmit} className="flex-1 flex items-center space-x-4">
                        <input
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Message Healthcare Cost Assistant"
                            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </form>
    
                    {/* Send Button */}
                    <button
                        onClick={handleSubmit}
                        className="p-3 ml-2 rounded-full bg-primary text-white hover:bg-primary-dark transition"
                    >
                        <FiSend size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}