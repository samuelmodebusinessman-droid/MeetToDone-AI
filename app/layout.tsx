import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MTD - MeetToDone",
  description: "Transformez vos réunions en actions",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: {
    icon: "https://i.ibb.co/S7xJ8Ncy/Design-sans-titre-removebg-preview.png",
    shortcut: "https://i.ibb.co/S7xJ8Ncy/Design-sans-titre-removebg-preview.png",
    apple: "https://i.ibb.co/S7xJ8Ncy/Design-sans-titre-removebg-preview.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
