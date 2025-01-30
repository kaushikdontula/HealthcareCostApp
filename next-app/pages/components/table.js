// Placeholder until full database is implemented... 
import React, { useState } from 'react';

export default function DataTable({ data }) {
    // State for the search term
    const [searchTerm, setSearchTerm] = useState('');

    // Filter the data based on the search term
    const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.price.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.provider.toLowerCase().includes(searchTerm.toLowerCase())  // Include provider in search
    );

    return (
        <section id="data" className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-8">
            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search Healthcare Services..."
                    className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Healthcare Pricing Data</h2>
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-teal-500 text-white">
                        <th className="px-6 py-3 text-left">ID</th>
                        <th className="px-6 py-3 text-left">Healthcare Service</th>
                                                <th className="px-6 py-3 text-left">Healthcare Provider</th> 
                        <th className="px-6 py-3 text-left">Price</th>
                        <th className="px-6 py-3 text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-4 text-gray-500">
                                No data available
                            </td>
                        </tr>
                    ) : (
                        filteredData.map((item, index) => (
                            <tr
                                key={item.id}
                                className={`border-b ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-teal-100`}
                            >
                                <td className="px-6 py-3 text-left text-gray-900">{item.id}</td>
                                <td className="px-6 py-3 text-gray-900">{item.name}</td>
                                <td className="px-6 py-3 text-gray-900">{item.provider}</td>
                                <td className="px-6 py-3 text-gray-900">{item.price}</td>
                                <td className="px-6 py-3 text-gray-900">{item.description}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </section>
    );
}
