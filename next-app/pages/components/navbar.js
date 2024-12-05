// components/navbar.js
import Link from 'next/link';
import styles from '../../styles/Home.module.css';

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/data">Data</Link></li>
                <li><Link href="/chatbot">Chat with a Bot</Link></li>
                <li><Link href="/account">My Account</Link></li>
            </ul>
            <Link href="/login" className={styles.loginButton}>Login</Link>
        </nav>
    );
};