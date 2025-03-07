import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import Navbar from './components/navbar';
import ChatComponent from './components/chat';
import Footer from './components/footer';
import DataTable from './components/table';
import Plots from './components/explore';
import CostMap from './components/CostMap';
import { motion, AnimatePresence } from 'framer-motion';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function Dashboard() {
    const { isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isSignedIn) {
            router.push('/sign-in');
        }
    }, [isSignedIn, router]);

    const [tableData, setTableData] = useState([]);
    const [inView, setInView] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const hospitals = [
        {
            name: "Hospital A",
            latitude: 40.7589,
            longitude: -73.9851,
            avgCost: 2500,
        },
        {
            name: "Hospital B",
            latitude: 40.7484,
            longitude: -73.9900,
            avgCost: 1800,
        },
        {
            name: "Hospital C",
            latitude: 40.7633,
            longitude: -73.9750,
            avgCost: 3200,
        },
    ];

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

    return (
        <div className="relative min-h-screen overflow-auto bg-gray-300 flex flex-col">
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="flex-grow flex flex-col items-center p-8 lg:px-16 xl:px-32 space-y-10">
                <section id="chatbot" ref={useInViewObserver("chatbot")} className="w-full max-w-7xl mx-auto flex flex-col items-center space-y-10 pt-20">
                    <motion.div className="w-full" initial={{ opacity: 0 }} animate={{ opacity: inView.chatbot ? 1 : 0 }} transition={{ duration: 2 }}>
                        <ChatComponent />
                    </motion.div>
                    <motion.div className="w-full" initial={{ opacity: 0 }} animate={{ opacity: inView.chatbot ? 1 : 0 }} transition={{ duration: 2 }}>
                        <CostMap hospitals={hospitals} />
                    </motion.div>
                </section>
                <section id="data" className="w-full max-w-6xl mx-auto">
                    <DataTable data={tableData} />
                </section>
            </main>
            <Footer />
        </div>
    );
}