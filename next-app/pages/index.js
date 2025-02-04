import { useState, useEffect, useRef } from 'react';
import Navbar from './components/navbar';
import ChatComponent from './components/chat';
import Footer from './components/footer';
import DataTable from './components/table';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
    // State to store pricing data
    const [tableData, setTableData] = useState([]);
    const [selectedId, setSelectedId] = useState(null); // State to handle which card is selected
    const [inView, setInView] = useState({});

    // Observer hook
    const useInViewObserver = (id) => {
        const ref = useRef(null);

        useEffect(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setInView((prev) => ({ ...prev, [id]: true }));
                        } else {
                            setInView((prev) => ({ ...prev, [id]: false }));
                        }
                    });
                },
                { threshold: 0.2 }
            );

            if (ref.current) observer.observe(ref.current);
            
            return () => {
                if (ref.current) observer.unobserve(ref.current);
            };
        }, [id]);

        return ref;
    };

    useEffect(() => {
        // Fetch pricing data from API
        const fetchPricingData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/pricing/');
                if (!response.ok) {
                    throw new Error('Failed to fetch pricing data');
                }
                const data = await response.json();

                // Transform API data to match table format
                const formattedData = data.map(pricingItem => ({
                    id: pricingItem.pricing_id,
                    rate: `$${pricingItem.negotiated_rate}`,
                    type: pricingItem.negotiated_type,
                    provider: pricingItem.billing_class || 'Unknown',
                    price: `$${pricingItem.price}`,
                    expiration: pricingItem.expiration_date,
                }));

                setTableData(formattedData);
            } catch (error) {
                console.error('Error fetching pricing data:', error);
            }
        };

        fetchPricingData();
    }, []);

    // Card content data
    const cardData = [
        {
            id: '1',
            title: 'User-Centric Interface',
            description: 'We provide a user-friendly platform for healthcare cost transparency, making it easy for users to navigate and find pricing data.',
            color: 'text-blue-500',
        },
        {
            id: '2',
            title: 'Real-Time Data Access',
            description: 'Access real-time, accurate healthcare pricing data with the help of advanced AI tools, ensuring that users get up-to-date information.',
            color: 'text-cyan-500',
        },
        {
            id: '3',
            title: 'Data Visualization',
            description: 'Easily understand complex healthcare data through beautiful visualizations and charts that make pricing more digestible for consumers.',
            color: 'text-green-500',
        },
    ];

    return (
        <div className="animated-gradient bg-gradient-to-r from-cyan-500 via-green-600 to-blue-500 min-h-screen text-white">
            <Navbar />
            <main className="flex-grow p-8 lg:px-16 xl:px-32 flex flex-col space-y-20 pt-32">
                {/* Title Section */}
                <section id="title-stats" className="h-screen flex flex-col">
                    <section id="title" ref={useInViewObserver("title")} className="h-2/5 flex items-center justify-start text-center px-8">
                        <div className="w-full">
                            <motion.h1
                                className="text-6xl font-extrabold text-gray-900 hover:scale-105 transition-colors duration-300"
                                initial={{ opacity: 10 }}
                                animate={{ opacity: inView.title ? 1 : 0 }}
                                transition={{ duration: 1 }}>
                                Improving Healthcare Transparency
                            </motion.h1>
                            <motion.p
                                className="mt-4 text-xl text-gray-100"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: inView.title ? 1 : 0 }}
                                transition={{ duration: 1 }}>
                                Bringing transparency to healthcare costs through AI-powered insights and real-time data analysis.
                            </motion.p>
                        </div>
                    </section>

                    {/* Section with Cards */}
                    <section id="cards" ref={useInViewObserver("cards")} className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {cardData.map((item) => (
                                <motion.div
                                    key={item.id}
                                    className="relative p-6 bg-white rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300"
                                    layoutId={`card-${item.id}`}
                                    onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
                                    initial={{ opacity: 10 }}
                                    animate={{ opacity: inView.cards ? 1 : 0 }}
                                    transition={{ duration: 1 }}
                                    exit={{ opacity: 0 }}>
                                    <motion.div className={`transition-all duration-300 ${selectedId === item.id ? 'p-8' : 'p-6'}`}>
                                        <h3 className={`text-xl ${item.color} font-semibold mb-4`}>
                                            {item.title}
                                        </h3>
                                        {selectedId === item.id ? (
                                            <motion.p className="text-gray-700" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                {item.description}
                                            </motion.p>
                                        ) : (
                                            <p className="text-gray-700">{item.description}</p>
                                        )}
                                    </motion.div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </section>
                </section>

                {/* Data Table Section */}
                <section id="data" ref={useInViewObserver("data")} className="h-screen w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-20">
                    <motion.div initial={{ opacity: 10 }} animate={{ opacity: inView.data ? 1 : 0 }} transition={{ duration: 1 }}>
                        <DataTable data={tableData} />
                    </motion.div>
                </section>

                {/* Chatbot Section */}
                <section id="chatbot" ref={useInViewObserver("chatbot")} className="h-screen w-full max-w-6xl mx-auto scroll-mt-20">
                    <motion.div initial={{ opacity: 10 }} animate={{ opacity: inView.chatbot ? 1 : 0 }} transition={{ duration: 1 }}>
                        <ChatComponent />
                    </motion.div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
