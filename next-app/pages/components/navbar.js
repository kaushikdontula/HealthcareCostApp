import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { MdOutlineHome } from "react-icons/md";
import ProfileModal from "./ProfileModal";

export default function Navbar() {
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut(() => {
      router.push("/");
    });
  };

  const navLinks = [
    { name: "AI Assistant", href: "/chatbot" },
    { name: "Cost Map", href: "/map" },
    { name: "Tabular Data", href: "/tabularData" },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full bg-gray-50 text-gray-900 shadow-lg z-50 px-6 py-4 flex items-center justify-between"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Left Side: Home Icon */}
      <div className="flex items-center">
        <Link href="/" className="text-[#282c34] hover:text-orange-600 transition duration-300">
          <MdOutlineHome size={32} />
        </Link>
      </div>

      {/* Center: Navigation Links (Perfectly Centered) */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8 text-lg font-medium">
        {navLinks.map((item) => {
          const isActive = router.pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative transition-all duration-300 
                ${isActive ? "text-orange-600 font-semibold" : "text-[#282c34] hover:text-orange-600"}
                after:content-[''] after:absolute after:h-[2px] after:bg-orange-400 
                after:bottom-0 after:left-0 after:right-0 after:mx-auto after:transition-all 
                after:duration-300 hover:after:w-full ${isActive ? "after:w-full" : "after:w-0"}
              `}
            >
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Right Side: Profile, Logout, and Mobile Menu */}
      <div className="flex items-center space-x-6 md:space-x-8 ml-auto">
        
        {/* Mobile Menu Toggle Button (On Right) */}
        <button 
          className="md:hidden text-gray-800 hover:text-orange-600 transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

        {/* Desktop Profile & Logout (Hidden on Mobile) */}
        {!isMobileMenuOpen && (
          <div className="hidden md:flex items-center space-x-6">
            {isLoaded && user ? (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 text-[#282c34] hover:text-orange-600 transition-all duration-300"
              >
                <FiUser size={20} />
                <span className="hidden lg:inline">{user.fullName || "Profile"}</span>
              </button>
            ) : (
              <div className="animate-pulse">Loading...</div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-[#282c34] hover:bg-gray-800/90 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FiLogOut size={20} />
              <span className="hidden lg:inline">Log Out</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="absolute top-[60px] left-0 w-full bg-white shadow-lg md:hidden flex flex-col items-center space-y-4 py-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg font-medium text-gray-800 hover:text-orange-600 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Profile & Logout in Mobile */}
            {isLoaded && user && (
              <button
                onClick={() => {
                  setIsProfileModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-800 hover:text-orange-600 transition"
              >
                {user.fullName || "Profile"}
              </button>
            )}

            <button
              onClick={handleLogout}
              className="bg-[#282c34] hover:bg-gray-800/90 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <ProfileModal
            onClose={() => setIsProfileModalOpen(false)}
            user={user}
          />
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
