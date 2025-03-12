import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { FiMenu, FiX, FiSend } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa'; // Robot icon

export default function ChatComponent() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);
    const chatContainerRef = useRef(null); // Ref for the chat window container
    const [botTyping, setBotTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [exampleText, setExampleText] = useState(''); // Holds the typed effect example text

    const exampleQuestion = "How much does an MRI cost with insurance?";

    // Typing effect for the example question
    useEffect(() => {
        let index = 0;
        const startTypingDelay = 1800; // 1.8s delay to allow animations to finish

        const startTyping = setTimeout(() => {
            const interval = setInterval(() => {
                if (index < exampleQuestion.length) {
                    setExampleText(exampleQuestion.slice(0, index + 1));
                    index++;
                } else {
                    clearInterval(interval);
                }
            }, 50);
        }, startTypingDelay);

        return () => clearTimeout(startTyping);
    }, []);


    // Ensure page scrolls to last message
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100); // Ensures rendering completes before scrolling
        }
    }, [messages]);

    // Simulate typing effect for bot messages
    const simulateTypingEffect = (fullText, speed = 50) => {
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
    
        // Reset textarea height and scroll position
        if (inputRef.current) {
            inputRef.current.style.height = "40px";  // Reset height
            inputRef.current.scrollTop = 0;          // Prevent lingering scrollbar
            inputRef.current.style.overflow = "hidden"; // Hide scrollbar when empty
        }
    
        setIsLoading(true);
        setBotTyping(true);
    
        // Show loading message
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: "", sender: "bot", loading: true }
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
        
    const inputRef = useRef(null);

    return (
        <div className="relative flex flex-col w-full min-h-screen mx-aut p-6">
            {messages.length === 0 ? (
                // Initial Welcome State
                <div className="flex flex-col items-center justify-center text-center space-y-6 h-screen -mt-12">
                    {/* Title with animation */}
                    <motion.h1 
                        className="text-4xl font-bold text-gray-900"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        AI Healthcare Cost Assistant
                    </motion.h1>

                    {/* Subtitle with subtle animation */}
                    <motion.h2 
                        className="text-xl text-gray-600 font-medium"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    >
                        Get clear answers on medical pricing, insurance, and billing.
                    </motion.h2>

                    {/* Description with animation */}
                    <motion.p 
                        className="text-lg text-gray-700 max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                    >
                        Wondering how much a medical procedure will cost? Curious about insurance coverage or 
                        billing codes? I'm here to help! Just ask me a question like this:
                    </motion.p>

                    {/* Typing effect example (delayed start) */}
                    <motion.div 
                        className="text-xl font-medium text-gray-800 italic"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 1.2 }} // Appears before typing starts
                    >
                        {exampleText} {/* Typing effect text */}
                        <span className="animate-blink">|</span> {/* Cursor Effect */}
                    </motion.div>

                    {/* Input Form */}
                    <div className="flex justify-center w-full">
                        <div className="flex items-center bg-gray-700 p-3 rounded-[1.5rem] w-full max-w-3xl">
                            <form className="flex-grow">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit(e); // Calls the submit function when enter key is pressed
                                        }
                                    }}
                                    onInput={(e) => {
                                        e.target.style.height = "40px";
                                        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                                        e.target.scrollTop = 0;
                                        e.target.style.overflow = e.target.value ? "auto" : "hidden";
                                    }}
                                    placeholder="Message Healthcare Cost Assistant..."
                                    className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none px-4 resize-none overflow-hidden min-h-[40px] max-h-[120px] leading-[1.5rem] py-[10px] align-middle"
                                    rows={1}
                                />
                            </form>
                            <button
                                onClick={handleSubmit}
                                className="ml-3 p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-all"
                            >
                                <FiSend size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                // Chat Interface
                <div className="flex flex-col w-full max-w-3xl mx-auto pt-20">
                    {/* Chat Messages Container - Takes Remaining Space Above Input Bar */}
                    <div className="flex-1 w-full max-w-3xl mx-auto space-y-4 pb-28">
                        {messages.map((msg, index) => (
                            <div key={index} className={`w-full max-w-3xl flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'user' ? (
                                    <div className="bg-gray-700 text-gray-50 p-2.5 rounded-xl shadow-lg max-w-[90%] break-words">
                                        {msg.text}
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2 max-w-[90%]">
                                        {/* Show spinner if loading */}
                                        {msg.loading && (
                                            <div className="loader w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                                        )}
                                        {/* Ensure text takes full available width */}
                                        <div className="bg-transparent px-2 py-1 text-left break-words flex-1">
                                            {msg.text}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* FIXED Input Bar at Bottom */}
                    <div className="fixed bottom-0 left-0 w-full flex justify-center bg-gray-50 py-4 shadow-lg">
                        <div className="flex items-center bg-gray-700 p-3 rounded-[1.5rem] w-full max-w-3xl">
                            <form onSubmit={handleSubmit} className="flex-grow">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit(e); // Calls the submit function when enter key is pressed
                                        }
                                    }}
                                    onInput={(e) => {
                                        e.target.style.height = "40px";
                                        e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
                                        e.target.scrollTop = 0;
                                        e.target.style.overflow = e.target.value ? "auto" : "hidden";
                                    }}
                                    placeholder="Message Healthcare Cost Assistant..."
                                    className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none px-4 resize-none overflow-hidden min-h-[40px] max-h-[100px] leading-[1.5rem] py-[10px] align-middle"
                                    rows={1}
                                />
                            </form>
                            <button
                                onClick={handleSubmit}
                                className="ml-3 p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-all"
                            >
                                <FiSend size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}