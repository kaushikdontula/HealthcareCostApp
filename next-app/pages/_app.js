import { ClerkProvider } from "@clerk/nextjs";
import "../styles/global.css";

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider {...pageProps}>
      <div className="flex flex-col min-h-screen">
        <Component {...pageProps} />
      </div>
    </ClerkProvider>
  );
}
