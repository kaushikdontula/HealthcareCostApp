import { useState, useEffect } from "react";
import Navbar from "./components/navbar"; // Adjusted import
import Footer from "./components/footer";
import DataTable from "./components/table"; // Import the table component

export default function TabularDataPage() {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const fetchPricingData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/pricing/");
                if (!response.ok) throw new Error("Failed to fetch pricing data");
                const data = await response.json();
                const formattedData = data.map((pricingItem) => ({
                    id: pricingItem.pricing_id,
                    rate: `$${pricingItem.negotiated_rate}`,
                    type: pricingItem.negotiated_type,
                    provider: pricingItem.billing_class || "Unknown",
                    price: `$${pricingItem.price}`,
                    expiration: pricingItem.expiration_date,
                }));
                setTableData(formattedData);
            } catch (error) {
                console.error("Error fetching pricing data:", error);
            }
        };
        fetchPricingData();
    }, []);

    return (
        <div className="relative min-h-screen overflow-auto bg-gray-300 flex flex-col">
            <Navbar />
            <main className="flex-grow flex flex-col items-center p-8 lg:px-16 xl:px-32 space-y-10 pt-20">
                <section className="w-full max-w-6xl mx-auto">
                    <DataTable data={tableData} />
                </section>
            </main>
            <Footer />
        </div>
    );
}
