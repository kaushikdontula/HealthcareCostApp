import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { FiUser, FiLogOut } from "react-icons/fi"; // Modern Icons
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

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full bg-gray-700 text-gray-300 shadow-lg z-50 flex items-center justify-between px-8 py-4"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Left Side: Logo / Title */}
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-2xl font-extrabold tracking-wide text-gray-300 hover:text-white transition duration-300">
          Healthcare Transparency
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex space-x-8 text-lg font-medium">
        {[
          { name: "AI Assistant", href: "/dashboard" },
          { name: "Cost Map", href: "/map" },
          { name: "Tabular Data", href: "/tabularData" },
          { name: "Mission Statement", href: "/missionStatement" },
        ].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="relative text-gray-300 hover:text-white transition-all duration-300 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-orange-400 after:bottom-0 after:left-1/2 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Right Side: Profile & Logout */}
      <div className="flex items-center space-x-6">
        {/* Profile Button */}
        {isLoaded && user ? (
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 text-gray-300 hover:text-orange-400 transition-all duration-300"
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
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/60 hover:bg-gray-800/90 text-gray-300 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
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