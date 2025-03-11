import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import Navbar from './components/navbar';
import ChatComponent from './components/chat';
import Footer from './components/footer';
import { motion, AnimatePresence } from 'framer-motion';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function Chatbot() {
    const { isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isSignedIn) {
            router.push('/sign-in');
        }
    }, [isSignedIn, router]);

    const [inView, setInView] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(true);

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
        <div className="relative min-h-screen flex flex-col bg-gray-50 overflow-hidden">
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            
            {/* Main Chat Content */}
            <main className="flex-grow flex flex-col items-center p-8 lg:px-16 xl:px-32 space-y-10 overflow-y-auto w-full">
                <section id="chatbot" ref={useInViewObserver("chatbot")} className="w-full max-w-7xl mx-auto flex flex-col items-center space-y-10 pt-20">
                    <motion.div className="w-full" initial={{ opacity: 0 }} animate={{ opacity: inView.chatbot ? 1 : 0 }} transition={{ duration: 2 }}>
                        <ChatComponent />
                    </motion.div>
                </section>
            </main>
            <Footer />
        </div>
    );    
}