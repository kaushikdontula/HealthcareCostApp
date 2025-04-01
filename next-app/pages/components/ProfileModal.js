import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20, duration: 0.2 },
  },
  exit: { scale: 0, opacity: 0, transition: { duration: 0.15 } },
};

export default function ProfileModal({ onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    name: user?.fullName || "",
    email: user?.emailAddresses?.[0]?.emailAddress || "",
    location: "",
    phone: "",
    theme: "Light",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        className="fixed inset-0 z-[9999] flex justify-center items-center bg-black bg-opacity-70"
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[95vh] overflow-hidden"
          variants={modal}
        >
          {/* Scrollable content wrapper */}
          <div className="p-6 overflow-y-auto max-h-[95vh]">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Profile Settings</h2>

            <div className="flex flex-col items-center mb-6">
              <img
                src={user?.imageUrl || "/default-user.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4 shadow-åmd"
              />
              <p className="text-gray-600">Update your profile details below.</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="shadow border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Your City, State"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="XXX-XXX-XXXX"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Theme Preference</label>
              <select
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
