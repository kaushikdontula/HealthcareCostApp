import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import Navbar from './components/navbar';
import ChatComponent from './components/chat';
import Footer from './components/footer';
import DataTable from './components/table';
import Plots from './components/explore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
    const { isSignedIn } = useAuth();
    const router = useRouter();

    // Redirect to sign-in if the user is not authenticated
    useEffect(() => {
        if (!isSignedIn) {
            router.push('/sign-in');
        }
    }, [isSignedIn, router]);

    const [tableData, setTableData] = useState([]);
    const [serviceData, setServiceData] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [inView, setInView] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(true);  // Set initial state to true

    const useInViewObserver = (id) => {
        const ref = useRef(null);

        useEffect(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        setInView((prev) => ({ ...prev, [id]: entry.isIntersecting }));
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
        const fetchServiceData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/services/');
                if (!response.ok) throw new Error('Failed to fetch pricing data');
                const data = await response.json();
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
                if (!response.ok) throw new Error('Failed to fetch pricing data');
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
            description: 'We aim to eliminate the confusion around healthcare pricing by making it easy for anyone to understand.',
            color: 'text-blue-500',
        },
        {
            id: '2',
            title: 'Shed Light on Healthcare Pricing',
            description: 'Healthcare pricing in the U.S. is unnecessarily complicated. Were here to show users the magnitude of the problem.',
            color: 'text-cyan-500',
        },
        {
            id: '3',
            title: 'Comprehensive Data and Analysis',
            description: 'Our platform provides detailed data analysis and various types of charts that help users compare healthcare prices.',
            color: 'text-green-500',
        }
    ];

    return (
        <div className="animated-gradient min-h-screen text-black">
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className={`flex-grow p-8 lg:px-16 xl:px-32 flex transition-all flex-col space-y-5 ${sidebarOpen ? 'ml-60' : ''}`}>
                <section id="title" ref={useInViewObserver("title")} className="h-1/5 flex items-center justify-start text-center mt-5 mb-5">
                    <div className="w-full">
                        <motion.h1 className="text-5xl font-extrabold text-gray-900" initial={{ opacity: 0 }} animate={{ opacity: inView.title ? 1 : 0 }} transition={{ duration: 1 }}>
                            Improving Healthcare Transparency
                        </motion.h1>
                        <motion.p className="mt-4 text-1xl text-gray-900" initial={{ opacity: 0 }} animate={{ opacity: inView.title ? 1 : 0 }} transition={{ duration: 1 }}>
                            Bringing transparency to healthcare costs through AI-powered insights and modern data analysis.
                        </motion.p>
                    </div>
                </section>
                <section id="chatbot" ref={useInViewObserver("chatbot")} className="w-full max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: inView.chatbot ? 1 : 0 }} transition={{ duration: 2 }}>
                        <ChatComponent />
                    </motion.div>
                </section>
                <section id="data" className="full-screen-section w-full max-w-6xl mx-auto">
                    <DataTable data={tableData} />
                </section>
                <section id="mission-statement" className="h-screen flex flex-col">
                    <section id="mission_statement" ref={useInViewObserver("mission_statement")} className="h-1/5 flex items-center mt-5 justify-start text-center mb-5">
                        <div className="w-full">
                            <motion.h1 className="text-5xl font-extrabold text-gray-900" initial={{ opacity: 0 }} animate={{ opacity: inView.mission_statement ? 1 : 0 }} transition={{ duration: 1 }}>
                                Our Mission
                            </motion.h1>
                            <motion.p className="mt-4 text-1xl text-gray-900" initial={{ opacity: 0 }} animate={{ opacity: inView.mission_statement ? 1 : 0 }} transition={{ duration: 1 }}>
                                Healthcare pricing can be overwhelmingly complex, but we make it transparent and easy to understand.
                            </motion.p>
                        </div>
                    </section>
                    <section id="cards" ref={useInViewObserver("cards")} className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {cardData.map((item) => (
                                <motion.div key={item.id} className="relative p-6 bg-white rounded-xl shadow-lg transform hover:scale-105 transition-transform" layoutId={`card-${item.id}`} onClick={() => setSelectedId(selectedId === item.id ? null : item.id)} initial={{ opacity: 0 }} animate={{ opacity: inView.cards ? 1 : 0 }} transition={{ duration: 1 }} exit={{ opacity: 0 }}>
                                    <h3 className={`text-xl ${item.color} font-semibold mb-4`}>{item.title}</h3>
                                    <p className="text-gray-700">{item.description}</p>
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
