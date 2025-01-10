// pages/index.js
import Navbar from './components/navbar';
import ChatComponent from './components/chat'; // Import the ChatComponent
import Footer from './components/footer';

export default function Home() {
    return (
        <div>
            <Navbar />
            <main className>
                <ChatComponent />
            </main>
            <Footer />
        </div>
    );
}