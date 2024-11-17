import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import { UserProvider } from "@/service/context";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DealsDray",
  description: "Machine test",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <Navbar />
          {children}
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
