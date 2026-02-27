import { Inter, Tinos } from "next/font/google"; // Importing the necessary Google Fonts
import "./globals.css";
import Header from "@/components/major/Header"; // Global Header
import Footer from "@/components/major/Footer"; // Global Footer

// Configuring Inter font
const inter = Inter({
  variable: "--font-inter",      // This will create a CSS variable for Inter
  subsets: ["latin"],            // Including the Latin subset for Inter
  weight: ["100", "200", "300", "400", "500", "600", "700"], // Defining all weights needed for Inter
  display: "swap",               // Ensures text uses fallback font until Inter is loaded
});

// Configuring Tinos font
const tinos = Tinos({
  variable: "--font-tinos",      // This will create a CSS variable for Tinos
  subsets: ["latin"],            // Including the Latin subset for Tinos
  weight: ["400", "700"],        // Defining the regular (400) and bold (700) weights for Tinos
  display: "swap",               // Ensures text uses fallback font until Tinos is loaded
});

export const metadata = {
  title: "Holid helps publishers to take on new heights",
  description: "Holid helps publishers to take on new heights by providing the latest Ad Tech, optimization of ad inventory and sales towards leading advertisers &amp; agencies. We help 100&#039;s of websites and apps to face a continuously evolving market.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${tinos.variable} antialiased`} // Applying the fonts globally
      >
        <Header />   {/* Sticky global header */}
        {children}   {/* Page content (contains <main> from pages) */}
        <Footer />   {/* Global footer */}
      </body>
    </html>
  );
}
