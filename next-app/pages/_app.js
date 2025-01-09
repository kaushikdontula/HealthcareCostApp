import '../styles/global.css'; // Import global Tailwind CSS styles

export default function App({ Component, pageProps }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Component {...pageProps} />
        </div>
    );
}