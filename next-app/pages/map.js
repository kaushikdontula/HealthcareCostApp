import { useState } from 'react';
import Navbar from './components/navbar';
import Footer from './components/footer'; 
import CostMap from './components/CostMap'; 
import { motion } from 'framer-motion';

export default function MapPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const hospitals = [
        { name: "Hospital A", latitude: 40.7589, longitude: -73.9851, avgCost: 2500 },
        { name: "Hospital B", latitude: 40.7484, longitude: -73.9900, avgCost: 1800 },
        { name: "Hospital C", latitude: 40.7633, longitude: -73.9750, avgCost: 3200 },
    ];

    return (
        <div className="relative min-h-screen overflow-auto bg-gray-50 flex flex-col">
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            
            <main className="flex-grow flex flex-col items-center p-8 xl:px-32 space-y-6">
                {/* Page Header */}
                <section className="w-full max-w-7xl mx-auto text-center mt-20">
                    <motion.h1 
                        className="text-5xl font-extrabold text-gray-900"
                        initial={{ opacity: 0, y: -20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 1 }}
                    >
                        Explore Healthcare Costs Near You
                    </motion.h1>
                    <motion.p 
                        className="mt-2 text-lg text-gray-700 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ duration: 1.2 }}
                    >
                        Use our interactive cost map to compare pricing for healthcare services across different hospitals and locations. Empower yourself with transparent pricing data before making healthcare decisions.
                    </motion.p>
                </section>

                {/* Cost Map Section */}
                <section className="w-full max-w-7xl mx-auto mt-4">
                    <CostMap hospitals={hospitals} />
                </section>
            </main>

            <Footer />
        </div>
    );
}
