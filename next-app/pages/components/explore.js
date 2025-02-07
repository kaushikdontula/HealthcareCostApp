// import React, { useState } from 'react';
// import Plot from 'react-plotly.js';

// export default function Explore() {
//     const [cptCode, setCptCode] = useState('');
//     const [chartData, setChartData] = useState(null);

//     const generateFakeData = () => {
//         const prices = Array.from({ length: 50 }, () => Math.floor(Math.random() * 500) + 50);
//         const scatterPrices = prices.map(price => ({ x: Math.random() * 10, y: price }));
        
//         setChartData({ prices, scatterPrices });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!cptCode) return;
//         generateFakeData();
//     };

//     return (
//         <section id="explore" className="min-h-screen w-full max-w-6xl mx-auto rounded-xl shadow-lg p-10 bg-gray-800 text-white">
//             <h2 className="text-2xl font-semibold mb-6">Explore Healthcare Pricing</h2>
            
//             {/* Form */}
//             <form onSubmit={handleSubmit} className="flex space-x-4 mb-8">
//                 <input
//                     type="text"
//                     value={cptCode}
//                     onChange={(e) => setCptCode(e.target.value)}
//                     placeholder="Enter CPT Code"
//                     className="flex-1 p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 />
//                 <button
//                     type="submit"
//                     className="p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all"
//                 >
//                     Generate Charts
//                 </button>
//             </form>
            
//             {/* Charts */}
//             {chartData && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Histogram */}
//                     <div className="p-4 bg-gray-700 rounded-lg shadow-lg">
//                         <Plot
//                             data={[{
//                                 x: chartData.prices,
//                                 type: 'histogram',
//                                 marker: { color: 'blue' },
//                             }]}
//                             layout={{
//                                 title: 'Price Distribution',
//                                 paper_bgcolor: 'rgba(0,0,0,0)',
//                                 plot_bgcolor: 'rgba(0,0,0,0)',
//                                 font: { color: 'white' }
//                             }}
//                         />
//                     </div>
                    
//                     {/* Scatterplot */}
//                     <div className="p-4 bg-gray-700 rounded-lg shadow-lg">
//                         <Plot
//                             data={[{
//                                 x: chartData.scatterPrices.map(p => p.x),
//                                 y: chartData.scatterPrices.map(p => p.y),
//                                 mode: 'markers',
//                                 type: 'scatter',
//                                 marker: { color: 'red', size: 8 },
//                             }]}
//                             layout={{
//                                 title: 'Price Variability',
//                                 paper_bgcolor: 'rgba(0,0,0,0)',
//                                 plot_bgcolor: 'rgba(0,0,0,0)',
//                                 font: { color: 'white' }
//                             }}
//                         />
//                     </div>
//                 </div>
//             )}
//         </section>
//     );
// }
