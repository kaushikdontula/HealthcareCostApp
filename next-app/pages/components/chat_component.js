import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { FiMenu, FiX, FiSend, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

export default function ChatComponent() {
    // States for chat functionality
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [botTyping, setBotTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [exampleText, setExampleText] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeChat, setActiveChat] = useState('default');
    const [chats, setChats] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    
    // References
    const chatEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const inputRef = useRef(null);
    
    const exampleQuestions = [
        "How much does an MRI cost with insurance?",
        "What's my expected out-of-pocket cost for knee surgery?",
        "How can I negotiate my hospital bill?",
        "What CPT code is used for a colonoscopy?"
    ];
    
    const selectedExample = exampleQuestions[0];

    // Load chats from localStorage on component mount
    useEffect(() => {
        const savedChats = localStorage.getItem('healthcareCostChats');
        if (savedChats) {
            const parsedChats = JSON.parse(savedChats);
            setChats(parsedChats);
            
            // Set active chat to the most recently used one
            const lastUsedChat = localStorage.getItem('lastActiveHealthcareChat') || 'default';
            setActiveChat(lastUsedChat);
            
            // Load messages for the active chat
            if (parsedChats[lastUsedChat]) {
                setMessages(parsedChats[lastUsedChat].messages || []);
            }
        } else {
            // Initialize with a default chat if no chats exist
            const initialChats = {
                default: {
                    title: 'New Chat',
                    messages: [],
                    lastUpdated: new Date().toISOString()
                }
            };
            setChats(initialChats);
            localStorage.setItem('healthcareCostChats', JSON.stringify(initialChats));
            localStorage.setItem('lastActiveHealthcareChat', 'default');
        }
    }, []);

    // Save chats to localStorage whenever they change
    useEffect(() => {
        if (Object.keys(chats).length > 0) {
            localStorage.setItem('healthcareCostChats', JSON.stringify(chats));
        }
    }, [chats]);

    // Save active chat to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('lastActiveHealthcareChat', activeChat);
    }, [activeChat]);

    // Update messages in the chats state whenever messages change
    useEffect(() => {
        if (activeChat && messages.length >= 0) {
            setChats(prevChats => {
                const updatedChats = { ...prevChats };
                
                // Create chat if it doesn't exist
                if (!updatedChats[activeChat]) {
                    updatedChats[activeChat] = {
                        title: 'New Chat',
                        messages: [],
                        lastUpdated: new Date().toISOString()
                    };
                }
                
                // Update messages and lastUpdated
                updatedChats[activeChat].messages = messages;
                updatedChats[activeChat].lastUpdated = new Date().toISOString();
                
                // Update chat title based on first user message if it exists
                if (messages.length > 0 && messages[0].sender === 'user') {
                    const firstMsg = messages[0].text;
                    updatedChats[activeChat].title = firstMsg.length > 30 
                        ? firstMsg.substring(0, 30) + '...' 
                        : firstMsg;
                }
                
                return updatedChats;
            });
        }
    }, [messages, activeChat]);

    // Typing effect for the example question
    useEffect(() => {
        let index = 0;
        const startTypingDelay = 1800;

        const startTyping = setTimeout(() => {
            const interval = setInterval(() => {
                if (index < selectedExample.length) {
                    setExampleText(selectedExample.slice(0, index + 1));
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
            }, 100);
        }
    }, [messages]);

    // Create a new chat
    const createNewChat = () => {
        const newChatId = `chat_${Date.now()}`;
        setChats(prevChats => ({
            ...prevChats,
            [newChatId]: {
                title: 'New Chat',
                messages: [],
                lastUpdated: new Date().toISOString()
            }
        }));
        setActiveChat(newChatId);
        setMessages([]);
        setSidebarOpen(false);
    };

    // Delete a chat
    const deleteChat = (chatId, e) => {
        e.stopPropagation();
        
        // Create a copy of chats without the one to delete
        const updatedChats = { ...chats };
        delete updatedChats[chatId];
        
        // Update the chats state
        setChats(updatedChats);
        
        // If the active chat is being deleted, switch to another chat or create a new one
        if (chatId === activeChat) {
            const remainingChatIds = Object.keys(updatedChats);
            if (remainingChatIds.length > 0) {
                setActiveChat(remainingChatIds[0]);
                setMessages(updatedChats[remainingChatIds[0]].messages || []);
            } else {
                createNewChat();
            }
        }
    };

    // Switch to a different chat
    const switchChat = (chatId) => {
        setActiveChat(chatId);
        setMessages(chats[chatId].messages || []);
        setSidebarOpen(false);
    };

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
                updatedMessages[lastMessageIndex] = { 
                    text: fullText.slice(0, index), 
                    sender: "bot" 
                };
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
            inputRef.current.style.height = "40px";
            inputRef.current.scrollTop = 0;
            inputRef.current.style.overflow = "hidden";
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

    // Filter chats for search
    const filteredChats = Object.entries(chats)
        .filter(([_, chat]) => 
            chat.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => new Date(b[1].lastUpdated) - new Date(a[1].lastUpdated));

    // Format date for displaying in sidebar
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    return (
        <div className="relative flex flex-col w-full min-h-screen mx-auto p-6">
            {/* Sidebar Toggle Button - Always Visible */}
            <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-4 left-4 z-50 p-2 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition-all"
            >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-72 shadow-lg transform transition-transform duration-300 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="flex justify-between items-center mb-6 mt-12">
                        <h2 className="text-xl font-bold">Your Chats</h2>
                        <button 
                            onClick={createNewChat} 
                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full"
                            title="New Chat"
                        >
                            <FiPlus size={20} />
                        </button>
                    </div>

                    {/* Search Box */}
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2 px-4 pl-10 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none"
                        />
                        <FiSearch className="absolute left-3 top-3 text-gray-400" size={16} />
                    </div>

                    {/* Chat List */}
                    <div className="flex-grow overflow-y-auto">
                        {filteredChats.length > 0 ? (
                            filteredChats.map(([chatId, chat]) => (
                                <div 
                                    key={chatId}
                                    onClick={() => switchChat(chatId)}
                                    className={`p-3 mb-2 rounded-lg cursor-pointer flex justify-between items-center ${activeChat === chatId ? 'bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="font-medium truncate">{chat.title || 'New Chat'}</div>
                                        <div className="text-xs text-gray-400">{formatDate(chat.lastUpdated)}</div>
                                    </div>
                                    <button 
                                        onClick={(e) => deleteChat(chatId, e)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-700"
                                        title="Delete Chat"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 mt-8">
                                No chats found
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={`w-full transition-all duration-300 ${sidebarOpen ? 'pl-72' : 'pl-0'}`}>
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
                            transition={{ duration: 1, ease: "easeOut", delay: 1.2 }}
                        >
                            {exampleText}
                            <span className="animate-blink">|</span>
                        </motion.div>

                        {/* Example questions */}
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, ease: "easeOut", delay: 1.8 }}
                        >
                            {exampleQuestions.map((question, index) => (
                                <div 
                                    key={index}
                                    onClick={() => {
                                        setInput(question);
                                        if (inputRef.current) {
                                            inputRef.current.focus();
                                        }
                                    }}
                                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer text-left text-gray-700 text-sm transition-colors"
                                >
                                    {question}
                                </div>
                            ))}
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
                                                handleSubmit(e);
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
                                    className="ml-3 p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-all outline-none 
                                            hover:outline hover:outline-2 hover:outline-orange-500"
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
                                        <div className="flex items-start space-x-2 max-w-[90%]">
                                            {/* Bot avatar */}
                                            <div className="mt-1 p-1.5 bg-gray-200 rounded-full">
                                                <FaRobot size={16} className="text-gray-700" />
                                            </div>
                                            
                                            {/* Show spinner if loading */}
                                            {msg.loading ? (
                                                <div className="flex items-center h-6">
                                                    <div className="loader w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            ) : (
                                                <div className="bg-transparent px-2 py-1 text-left break-words flex-1">
                                                    <ReactMarkdown
                                                        components={{
                                                            h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900">{children}</h1>,
                                                            h2: ({ children }) => <h2 className="text-xl font-semibold text-gray-800 mt-3">{children}</h2>,
                                                            h3: ({ children }) => <h3 className="text-lg font-medium text-gray-700 mt-2">{children}</h3>,
                                                            p: ({ children }) => <p className="text-gray-600 leading-relaxed">{children}</p>,
                                                            ul: ({ children }) => <ul className="list-disc list-inside text-gray-600">{children}</ul>,
                                                            li: ({ children }) => <li className="ml-4">{children}</li>,
                                                            strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                                                            table: ({ children }) => <div className="overflow-x-auto"><table className="min-w-full text-gray-700 border border-gray-300 my-2">{children}</table></div>,
                                                            thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
                                                            tbody: ({ children }) => <tbody>{children}</tbody>,
                                                            tr: ({ children }) => <tr>{children}</tr>,
                                                            th: ({ children }) => <th className="border border-gray-300 px-3 py-2 text-left">{children}</th>,
                                                            td: ({ children }) => <td className="border border-gray-300 px-3 py-2">{children}</td>,
                                                        }}
                                                    >
                                                        {msg.text}
                                                    </ReactMarkdown>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* FIXED Input Bar at Bottom */}
                        <div className="fixed bottom-0 left-0 w-full flex justify-center bg-gray-50 py-4 shadow-lg">
                            <div className="flex items-center bg-gray-700 p-3 rounded-[1.5rem] w-full max-w-3xl mx-4">
                                <form onSubmit={handleSubmit} className="flex-grow">
                                    <textarea
                                        ref={inputRef}
                                        value={input}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSubmit(e);
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
                                    className="ml-3 p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-all outline-none 
                                            hover:outline hover:outline-2 hover:outline-orange-500"
                                >
                                    <FiSend size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}