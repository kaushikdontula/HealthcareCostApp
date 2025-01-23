import Navbar from './components/navbar';
import ChatComponent from './components/chat';  
import Footer from './components/footer';
import DataTable from './components/table';

export default function Home() {
    // Sample data for the table - Change with actual data later
    const tableData = [
        { id: 1, name: 'Healthcare Service 1', provider: 'Provider A', price: '$100', description: 'Basic service' },
        { id: 2, name: 'Healthcare Service 2',  provider: 'Provider B', price: '$200', description: 'Advanced service' },
        { id: 3, name: 'Healthcare Service 3', provider: 'Provider C', price: '$150', description: 'Standard service' },
        { id: 4, name: 'Healthcare Service 4', provider: 'Provider D',price: '$300', description: 'Premium service' },
    ];

    return (
        <div className="bg-gradient-to-r from-teal-700 to-blue-800 min-h-screen text-white">
            <Navbar />
            <main className="flex-grow p-8 lg:px-16 xl:px-32 flex flex-col justify-center items-center space-y-8 pt-32">
                {/* Feature Section */}
                <section id="feature" className="relative w-full max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900">Transforming Healthcare Pricing Transparency</h2>
                    <p className="mt-4 text-lg text-gray-600 text-center">
                        Our platform leverages AI to break down the complexity of healthcare pricing, providing transparent and understandable data for consumers.
                    </p>
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-600 opacity-20 rounded-lg"></div>
                </section>

                {/* Section with Cards */}
                <section id="cards" className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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

                {/* Data Table Section */}
                <section id="data" className="full-screen-section w-full max-w-6xl mx-auto">
                    <DataTable data={tableData} />
                </section>

                {/* Chatbot Section */}
                <section id="chatbot" className="full-screen-section w-full max-w-6xl mx-auto">
                    <ChatComponent />
                </section>

            </main>
            <Footer />
        </div>
    );
}
