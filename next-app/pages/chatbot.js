// pages/index.js
import Navbar from './components/navbar';
import ChatComponent from './components/chat'; // Import the ChatComponent
import Footer from './components/footer';
import styles from '../styles/Home.module.css';

export default function Home() {
    return (
        <div>
            <Navbar />
            <main className={styles.main}>
                <h1>Chat With AI</h1>
                <ChatComponent />
            </main>
            <Footer />
        </div>
    );
}