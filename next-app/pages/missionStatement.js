import { useState, useEffect } from "react";
import Navbar from "./components/navbar"; // Adjusted import path
import Footer from "./components/footer";
import { motion, AnimatePresence } from "framer-motion";

export default function MissionStatementPage() {
    const [inView, setInView] = useState({});
    const [selectedId, setSelectedId] = useState(null);

    const useInViewObserver = (id) => {
        useEffect(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        setInView((prev) => ({ ...prev, [id]: entry.isIntersecting }));
                    });
                },
                { threshold: 0.2 }
            );

            const element = document.getElementById(id);
            if (element) observer.observe(element);

            return () => {
                if (element) observer.unobserve(element);
            };
        }, [id]);

        return inView[id] || false;
    };

    const cardData = [
        {
            id: "1",
            title: "Empower with Knowledge",
            description: "We aim to eliminate the confusion around healthcare pricing by making it easy for anyone to understand.",
            color: "text-blue-500",
        },
        {
            id: "2",
            title: "Shed Light on Healthcare Pricing",
            description: "Healthcare pricing in the U.S. is unnecessarily complicated. We're here to show users the magnitude of the problem.",
            color: "text-cyan-500",
        },
        {
            id: "3",
            title: "Comprehensive Data and Analysis",
            description: "Our platform provides detailed data analysis and various types of charts that help users compare healthcare prices.",
            color: "text-green-500",
        }
    ];

    return (
        <div className="relative min-h-screen overflow-auto bg-gray-300 flex flex-col">
            <Navbar />
            <main className="flex-grow flex flex-col items-center p-8 lg:px-16 xl:px-32 space-y-10 pt-20">
                <section id="mission-statement" className="h-screen flex flex-col">
                    <section id="mission_statement" className="h-1/5 flex items-center mt-5 justify-center text-center mb-5">
                        <div className="w-full">
                            <motion.h1 
                                className="text-5xl font-extrabold text-gray-900" 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: useInViewObserver("mission_statement") ? 1 : 0 }} 
                                transition={{ duration: 1 }}
                            >
                                Our Mission
                            </motion.h1>
                            <motion.p 
                                className="mt-4 text-xl text-gray-900" 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: useInViewObserver("mission_statement") ? 1 : 0 }} 
                                transition={{ duration: 1 }}
                            >
                                Healthcare pricing can be overwhelmingly complex, but we make it transparent and easy to understand.
                            </motion.p>
                        </div>
                    </section>
                    
                    {/* Cards Section */}
                    <section id="cards" className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {cardData.map((item) => (
                                <motion.div 
                                    key={item.id} 
                                    className="relative p-6 bg-white rounded-xl shadow-lg transform hover:scale-105 transition-transform" 
                                    layoutId={`card-${item.id}`} 
                                    onClick={() => setSelectedId(selectedId === item.id ? null : item.id)} 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: useInViewObserver("cards") ? 1 : 0 }} 
                                    transition={{ duration: 1 }} 
                                    exit={{ opacity: 0 }}
                                >
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
