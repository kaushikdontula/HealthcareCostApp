import React, { useState } from 'react';

export default function DataTable({ data }) {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter data based on search query
    const filteredData = data.filter((pricingItem) => {
        const lowercasedQuery = searchQuery.toLowerCase();
        return (
            String(pricingItem.id).toLowerCase().includes(lowercasedQuery) ||
            String(pricingItem.rate).toLowerCase().includes(lowercasedQuery) ||
            String(pricingItem.type).toLowerCase().includes(lowercasedQuery) ||
            String(pricingItem.provider).toLowerCase().includes(lowercasedQuery) ||
            String(pricingItem.price).toLowerCase().includes(lowercasedQuery) ||
            String(pricingItem.expiration).toLowerCase().includes(lowercasedQuery)
        );
    });

    return (
        <section id="data" className="w-full mt-40 max-w-7xl mx-auto border-2 border-gray-700 rounded-2xl shadow-xl p-8">
            {/* Header Section */}
            <div className="mb-8 flex justify-between items-center space-x-6">
                <h2 className="text-4xl font-semibold text-gray-900">Healthcare Pricing Data</h2>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search Healthcare Pricing Data..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
                    className="p-4 border-2 border-blue-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 w-1/3"
                />
            </div>

            <table className="w-full table-auto border-collapse rounded-2xl overflow-hidden">
                <thead>
                    <tr className="bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 text-white text-left">
                        <th className="px-6 py-4 text-sm font-medium">Pricing ID</th>
                        <th className="px-6 py-4 text-sm font-medium">Negotiated Rate</th>
                        <th className="px-6 py-4 text-sm font-medium">Negotiated Type</th>
                        <th className="px-6 py-4 text-sm font-medium">Billing Class</th>
                        <th className="px-6 py-4 text-sm font-medium">Price</th>
                        <th className="px-6 py-4 text-sm font-medium">Expiration Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center py-6 text-gray-500 font-semibold">
                                No data available
                            </td>
                        </tr>
                    ) : (
                        filteredData.map((pricingItem, index) => (
                            <tr
                                key={pricingItem.id}
                                className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transform transition-all duration-300`}
                            >
                                <td className="px-6 py-4 text-sm text-gray-800">{pricingItem.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{pricingItem.rate}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{pricingItem.type}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{pricingItem.provider}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{pricingItem.price}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{pricingItem.expiration}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </section>
    );
}
