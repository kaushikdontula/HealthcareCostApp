import Navbar from './components/navbar';
import Footer from './components/footer';

export default function Home() {
    return (
        <div className="bg-gradient-to-r from-teal-700 to-blue-800 min-h-screen text-white">
            <Navbar />
            <main className="flex-grow p-8 lg:px-16 xl:px-32 flex flex-col justify-center items-center space-y-8">
            
                {/* Feature Section */}
                <section className="relative w-full max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900">Transforming Healthcare Pricing Transparency</h2>
                    <p className="mt-4 text-lg text-gray-600 text-center">
                        Our platform leverages AI to break down the complexity of healthcare pricing, providing transparent and understandable data for consumers.
                    </p>
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-600 opacity-20 rounded-lg"></div>
                </section>

                {/* Section with Cards */}
                <section className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="p-6 bg-white rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <h3 className="text-xl font-semibold mb-4">User-Centric Interface</h3>
                        <p className="text-gray-700">We provide a user-friendly platform for healthcare cost transparency, making it easy for users to navigate and find pricing data.</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <h3 className="text-xl font-semibold mb-4">Real-Time Data Access</h3>
                        <p className="text-gray-700">Access real-time, accurate healthcare pricing data with the help of advanced AI tools, ensuring that users get up-to-date information.</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <h3 className="text-xl font-semibold mb-4">Data Visualization</h3>
                        <p className="text-gray-700">Easily understand complex healthcare data through beautiful visualizations and charts that make pricing more digestible for consumers.</p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
