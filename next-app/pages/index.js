// pages/index.js
import Navbar from './components/navbar';
import Footer from './components/footer';
import styles from '../styles/Home.module.css';

export default function Home() {
    return (
        <div>
            <Navbar />
            <main className={styles.main}>
                <h1>Homepage for Capstone project</h1>
                <p>This will be the homepage for the Health Transparency front end.</p>
            </main>
            <Footer />
        </div>
    );
};
