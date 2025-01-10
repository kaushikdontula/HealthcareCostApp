// components/Navbar.js
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-[#212f3d] text-white shadow-md"> {/* Darker Blue */}
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
                    <li><Link href="/about" className="hover:text-gray-300">About</Link></li>
                    <li><Link href="/data" className="hover:text-gray-300">Data</Link></li>
                    <li><Link href="/chatbot" className="hover:text-gray-300">Healthcare Cost Assistant</Link></li>
                    <li><Link href="/account" className="hover:text-gray-300">My Account</Link></li>
                </ul>

                {/* Login Button */}
                <Link href="/login" className="bg-[#2F855A] px-4 py-2 rounded hover:bg-[#276749]"> {/* Dark Forest Green */}
                    Login
                </Link>
            </div>
        </nav>
    );
}
