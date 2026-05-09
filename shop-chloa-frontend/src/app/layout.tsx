import type { Metadata } from "next";
import { Playfair_Display, Poppins, Roboto } from "next/font/google";
import "./globals.css";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import MobileCheck from "./MobileCheck";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ShopChlao Dashboard",
    template: "%s - ShopChlao",
  },

  description:
    "Affordable interest rates, quick and easy loan application, best in class support, commissions, etc.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${playfairDisplay.variable} `}>
        <AppRouterCacheProvider>
          {children}

          <SonnerToaster />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
