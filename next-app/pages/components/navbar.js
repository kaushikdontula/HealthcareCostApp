import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi"; // Importing arrow icons

  export default function Navbar({ sidebarOpen, setSidebarOpen }) {
    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
    };
    
  return (
    <div className="relative">
      {/* Sidebar Toggle Button (Arrow) */}
      <motion.div
        className={`fixed top-1/2 left-0 z-50 transform -translate-y-1/2 p-2 bg-gray-700 text-white rounded-r-full cursor-pointer ${
          sidebarOpen ? "rotate-180" : ""
        }`}
        onClick={toggleSidebar}
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -40, opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {sidebarOpen ? <FiChevronLeft size={24} /> : <FiChevronRight size={24} />}
      </motion.div>

      {/* Sidebar Menu */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed top-0 left-0 h-full w-60 bg-gray-700 text-white shadow-lg z-40 flex flex-col py-6 px-4 gap-6"
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: "transform" }}
          >

            {/* Menu Items */}
            {[
              { name: "AI Assistant", href: "#title" },
              { name: "Explore", href: "#data" },
              { name: "Our Mission", href: "#mission_statement" },
            ].map((item) => (
              <motion.div
                key={item.name}
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Link
                  href={item.href}
                  className="block w-full px-6 py-3 text-center text-white bg-transparent border-b-2 border-gray-600 hover:text-orange-400 hover:border-orange-400 transition-all duration-300"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}

            {/* Log In & Contact buttons */}
            <div className="mt-auto space-y-4">
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Link
                  href="/login"
                  className="block w-full px-6 py-3 text-center text-white bg-gray-800 rounded-lg hover:text-orange-400 transition-all duration-300"
                >
                  Log In
                </Link>
              </motion.div>
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Link
                  href="/contact"
                  className="block w-full px-6 py-3 text-center text-white bg-transparent border-t-2 border-gray-600 hover:text-orange-400 hover:border-orange-400 transition-all duration-300"
                >
                  Contact
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visible Sidebar Indication (on the left side) */}
      <motion.div
        className={`fixed top-0 left-0 h-full w-2 bg-gray-700 z-30 transition-all duration-600 ${
          sidebarOpen ? "w-60" : "w-2"
        }`}
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -40, opacity: 0 }}
        transition={{ duration: 0.6 }}
      ></motion.div>
    </div>
  );
}



// Old Nav Bar Code
// import { useState } from 'react';
// import Link from 'next/link';

// export default function Navbar() {
//     const [dropdownOpen, setDropdownOpen] = useState(false);

//     return (
//         <nav className="bg-[#212f3d] text-white shadow-md sticky top-0 z-50">
//             <div className="container mx-auto flex items-center justify-between px-4 py-3">
//                 {/* Logo */}
//                 <div className="text-xl font-bold">
//                     <Link href="/" className="hover:text-gray-300">
//                         Healthcare Cost Transparency App
//                     </Link>
//                 </div>

//                 {/* Navigation Links */}
//                 <ul className="hidden md:flex space-x-6">
//                     <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
//                     <li><Link href="#data" className="hover:text-gray-300">Data</Link></li>
//                     <li><Link href="#chatbot" className="hover:text-gray-300">Healthcare Cost Assistant</Link></li> {/*Change '/' to '#' as you go*/}
//                     <li className="relative">
//                         <button 
//                             className="hover:text-gray-300" 
//                             onClick={() => setDropdownOpen(!dropdownOpen)}>
//                             My Account
//                         </button>
//                         {dropdownOpen && (
//                             <ul className="absolute right-0 mt-2 bg-[#2d3a4a] text-sm shadow-md rounded">
//                                 <li><Link href="/profile" className="block px-4 py-2 hover:bg-gray-700">Profile</Link></li>
//                                 <li><Link href="/settings" className="block px-4 py-2 hover:bg-gray-700">Settings</Link></li>
//                                 <li><Link href="/logout" className="block px-4 py-2 hover:bg-gray-700">Logout</Link></li>
//                             </ul>
//                         )}
//                     </li>
//                 </ul>

//                 {/* Login Button */}
//                 <Link href="/login" className="bg-[#2F855A] px-4 py-2 rounded hover:bg-[#276749]">
//                     Login
//                 </Link>
//             </div>
//         </nav>
//     );
// }
