import { useState, useEffect, useRef } from 'react';
import Navbar from './components/navbar';
import ChatComponent from './components/chat';
import Footer from './components/footer';
import DataTable from './components/table';
import Plots from './components/explore'
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
    const [tableData, setTableData] = useState([]);
    const [serviceData, setServiceData] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [inView, setInView] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(false); // Track sidebar state


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
        const fetchServiceData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/services/');
                if (!response.ok) {
                    throw new Error('Failed to fetch pricing data');
                }
                const data = await response.json();

                // Transform API data to match table format
                const formattedData = data.map(service => ({
                    id: service.service_id,
                    name: service.name,
                    description: service.description,
                    category: service.category,
                }));

                setServiceData(formattedData);
            } catch (error) {
                console.error('Error fetching pricing data:', error);
            }
        };

        fetchServiceData();
    }, []);

    useEffect(() => {
        const fetchPricingData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/pricing/');
                if (!response.ok) {
                    throw new Error('Failed to fetch pricing data');
                }
                const data = await response.json();

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

    const cardData = [
        {
            id: '1',
            title: 'Empower with Knowledge',
            description: 'We aim to eliminate the confusion around healthcare pricing by making it easy for anyone to understand, no matter their technical background. Our AI assistant offers quick, accurate, and easy-to-understand insights specific to each user, ensuring they can make informed decisions without hesitation.',
            color: 'text-blue-500',
        },
        {
            id: '2',
            title: 'Shed Light on Healthcare Pricing',
            description: 'Healthcare pricing in the U.S. is unnecessarily complicated. We’re here to show users the magnitude of the problem and make it easier to navigate. Our goal is to help users better understand the costs of the services they need so they can feel confident, not scared, about their choices.',
            color: 'text-cyan-500',
        },
        {
            id: '3',
            title: 'Comprehensive Data and Analysis',
            description: 'Our platform provides detailed data analysis and various types of charts that help users compare healthcare prices. The interactive map allows them to directly compare prices across different regions, making it easier to understand and analyze healthcare costs from multiple perspectives.',
            color: 'text-green-500',
        }
    ];

    return (
        <div className="animated-gradient min-h-screen text-black">
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className={`flex-grow p-8 lg:px-16 xl:px-32 flex transition-all flex-col space-y-5 ${sidebarOpen ? 'ml-40' : ''}`}>
                
                <section id="title" ref={useInViewObserver("title")} className="h-1/5 flex items-center justify-start text-center mt-5 mb-5">
                    <div className="w-full">
                        <motion.h1
                            className="text-5xl font-extrabold text-gray-900"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: inView.title ? 1 : 0 }}
                            transition={{ duration: 1 }}>
                            Improving Healthcare Transparency
                        </motion.h1>
                        <motion.p
                            className="mt-4 text-1xl text-gray-900"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: inView.title ? 1 : 0 }}
                            transition={{ duration: 1 }}>
                            Bringing transparency to healthcare costs through AI-powered insights and modern data analysis.
                        </motion.p>
                    </div>
                </section>

                {/* Chatbot Section - Adjusted Position */}
                <section id="chatbot" ref={useInViewObserver("chatbot")} className=" w-full max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: inView.chatbot ? 1 : 0 }} transition={{ duration: 2 }}>
                        <ChatComponent />
                    </motion.div>
                </section>

                {/* Data Table Section */}
                <section id="data" className="full-screen-section w-full max-w-6xl mx-auto">
                    <DataTable data={tableData} />
                </section>
                
                <section id="mission-statment" className="h-screen flex flex-col">

                    <section id="mission_statement" ref={useInViewObserver("mission_statement")} className="h-1/5 flex items-center mt-5 justify-start text-center mb-5">
                        <div className="w-full">
                            <motion.h1
                                className="text-5xl font-extrabold text-gray-900"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: inView.mission_statement ? 1 : 0 }}
                                transition={{ duration: 1 }}>
                                Our Mission
                            </motion.h1>
                            <motion.p
                                className="mt-4 text-1xl text-gray-900"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: inView.mission_statement ? 1 : 0 }}
                                transition={{ duration: 1 }}>
                                Healthcare pricing can be overwhelmingly complex, but it doesn't have to be. We are committed to making it transparent and easy to understand for everyone.
                            </motion.p>
                        </div>
                    </section>

                    <section id="cards" ref={useInViewObserver("cards")} className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence> 
                            {cardData.map((item) => (
                                <motion.div
                                    key={item.id}
                                    className="relative p-6 bg-white rounded-xl shadow-lg transform hover:scale-105 transition-transform"
                                    layoutId={`card-${item.id}`}
                                    onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
                                    initial={{ opacity: 0 }}
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

            </main>
            <Footer />
        </div>
    );
}
