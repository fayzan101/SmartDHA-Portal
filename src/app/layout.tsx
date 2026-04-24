import "./globals.css";
import { Inter } from "next/font/google";
import { Poppins } from 'next/font/google';
import ReactQueryProvider from "../components/ReactQueryProvider";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'], // Add weights as needed
  variable: '--font-poppins', // Optional: for Tailwind or CSS variables
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smart DHA",
  description: "DHA PORTAL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} antialiased`}
      >
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
