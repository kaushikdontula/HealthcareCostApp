import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser(); // Get isLoaded
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Open the sidebar when the component mounts
    setSidebarOpen(true);
  }, []);

  const handleLogout = () => {
    signOut(() => {
      router.push('/'); // Redirect to the intro page after signing out
    });
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
              { name: "Map", href: "#map" },
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

            {/* Log Out & Contact buttons */}
            <div className="mt-auto space-y-4">

              {/* Profile/Settings Button */}
              {isLoaded ? (
                user ? (
                    <motion.div
                        initial={{ x: -40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -40, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link
                            href="/profile"
                            className="block w-full px-6 py-3 text-center text-white bg-gray-800 rounded-lg hover:text-orange-400 transition-all duration-300 flex items-center gap-4"
                        >
                            <img
                                src={user.imageUrl || '/default-user.png'} // Use user.imageUrl
                                alt="Profile"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            Profile / Settings
                        </Link>
                    </motion.div>
                ) : (
                    <div>Not signed in</div>
                )
            ) : (
                <div>Loading profile...</div>
            )}

              
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <button
                  onClick={handleLogout}
                  className="block w-full px-6 py-3 text-center text-white bg-gray-800 rounded-lg hover:text-orange-400 transition-all duration-300"
                >
                  Log Out
                </button>
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
