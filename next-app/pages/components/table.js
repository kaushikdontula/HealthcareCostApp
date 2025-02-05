import React, { useState } from 'react';

export function DataTable({ data }) {
    const [searchQuery, setSearchQuery] = useState('');

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
        <section id="data" className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            {/* Header Section */}
            <div className="mb-8 flex justify-between items-center space-x-6">
                <h2 className="text-4xl font-semibold text-gray-900">Healthcare Pricing Data</h2>
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search Healthcare Pricing Data..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-4 border-2 border-teal-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 w-1/3"
                />
            </div>
            <div className="overflow-y-auto max-h-96">
                <table className="w-full table-auto border-collapse rounded-2xl overflow-hidden">
                    <thead>
                        <tr className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 text-white text-left">
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
                                <tr key={pricingItem.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-teal-50 transform transition-all duration-300`}>
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
            </div>
        </section>
    );
}

export function ServiceDataTable({ data }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = data.filter((service) => {
        const lowercasedQuery = searchQuery.toLowerCase();
        return (
            String(service.id).toLowerCase().includes(lowercasedQuery) ||
            String(service.name).toLowerCase().includes(lowercasedQuery) ||
            String(service.description).toLowerCase().includes(lowercasedQuery) ||
            String(service.category).toLowerCase().includes(lowercasedQuery)
        );
    });

    return (
        <section id="service-data" className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8 flex justify-between items-center space-x-6">
                <h2 className="text-4xl font-semibold text-gray-900">Healthcare Service Data</h2>
                <input
                    type="text"
                    placeholder="Search Healthcare Service Data..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-4 border-2 border-teal-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 w-1/3"
                />
            </div>
            <div className="overflow-y-auto max-h-96">
                <table className="w-full table-auto border-collapse rounded-2xl overflow-hidden">
                    <thead>
                        <tr className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 text-white text-left">
                            <th className="px-6 py-4 text-sm font-medium">Service ID</th>
                            <th className="px-6 py-4 text-sm font-medium">Name</th>
                            <th className="px-6 py-4 text-sm font-medium">Description</th>
                            <th className="px-6 py-4 text-sm font-medium">Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-6 text-gray-500 font-semibold">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((service, index) => (
                                <tr key={service.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-teal-50 transform transition-all duration-300`}>
                                    <td className="px-6 py-4 text-sm text-gray-800">{service.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{service.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{service.description}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{service.category}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
