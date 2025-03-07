import { useState } from 'react';
import Navbar from './components/navbar';  // Correct relative path
import Footer from './components/footer';  // Correct relative path
import CostMap from './components/CostMap';  // Correct relative path

export default function MapPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const hospitals = [
        { name: "Hospital A", latitude: 40.7589, longitude: -73.9851, avgCost: 2500 },
        { name: "Hospital B", latitude: 40.7484, longitude: -73.9900, avgCost: 1800 },
        { name: "Hospital C", latitude: 40.7633, longitude: -73.9750, avgCost: 3200 },
    ];

    return (
        <div className="relative min-h-screen overflow-auto bg-gray-300 flex flex-col">
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="flex-grow flex flex-col items-center p-8 lg:px-16 xl:px-32 space-y-10 pt-20">
                <section className="w-full max-w-7xl mx-auto">
                    <CostMap hospitals={hospitals} />
                </section>
            </main>
            <Footer />
        </div>
    );
}
