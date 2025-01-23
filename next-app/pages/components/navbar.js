import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav className="bg-[#212f3d] text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between px-4 py-3">
                {/* Logo */}
                <div className="text-xl font-bold">
                    <Link href="/" className="hover:text-gray-300">
                        Healthcare Cost Transparency App
                    </Link>
                </div>

                {/* Navigation Links */}
                <ul className="hidden md:flex space-x-6">
                    <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
                    <li><Link href="#data" className="hover:text-gray-300">Data</Link></li>
                    <li><Link href="#chatbot" className="hover:text-gray-300">Healthcare Cost Assistant</Link></li> {/*Change '/' to '#' as you go*/}
                    <li className="relative">
                        <button 
                            className="hover:text-gray-300" 
                            onClick={() => setDropdownOpen(!dropdownOpen)}>
                            My Account
                        </button>
                        {dropdownOpen && (
                            <ul className="absolute right-0 mt-2 bg-[#2d3a4a] text-sm shadow-md rounded">
                                <li><Link href="/profile" className="block px-4 py-2 hover:bg-gray-700">Profile</Link></li>
                                <li><Link href="/settings" className="block px-4 py-2 hover:bg-gray-700">Settings</Link></li>
                                <li><Link href="/logout" className="block px-4 py-2 hover:bg-gray-700">Logout</Link></li>
                            </ul>
                        )}
                    </li>
                </ul>

                {/* Login Button */}
                <Link href="/login" className="bg-[#2F855A] px-4 py-2 rounded hover:bg-[#276749]">
                    Login
                </Link>
            </div>
        </nav>
    );
}
