import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { FiUser, FiLogOut } from "react-icons/fi"; // Modern Icons
import { MdOutlineHome } from "react-icons/md";
import ProfileModal from "./ProfileModal";

export default function Navbar() {
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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
      className="fixed top-0 left-0 w-full bg-gray-50 text-gray-900 shadow-lg z-50 flex items-center px-8 py-4"
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

      {/* Center: Navigation Links (Absolutely Centered) */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-8 text-lg font-medium">
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
      </div>

      {/* Right Side: Profile & Logout */}
      <div className="ml-auto flex items-center space-x-6">
        {/* Profile Button */}
        {isLoaded && user ? (
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 text-[#282c34] hover:text-orange-600 transition-all duration-300"
          >
            <FiUser size={20} />
            <span className="hidden md:inline">{user.fullName || "Profile"}</span>
          </button>
        ) : (
          <div className="animate-pulse">Loading...</div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-[#282c34] hover:bg-gray-800/90 text-gray-300 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FiLogOut size={20} />
          <span className="hidden md:inline">Log Out</span>
        </button>
      </div>

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
