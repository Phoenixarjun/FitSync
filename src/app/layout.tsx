import type { Metadata } from "next";
import "../styles/globals.css";
import { UserProvider } from "@/context/UserContext";


export const metadata: Metadata = {
  title: "FitSync",
  description: "Personalized fitness tracking and coaching",
    icons: {
    icon: "/logoTransparent.png", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
