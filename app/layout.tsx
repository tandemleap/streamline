import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Streamline Workshop — We Find the Friction. We Fix It.",
  description:
    "Streamline Workshop is Scott and Corazon — a foster dad and daughter who find what's slowing small businesses down and fix it. Custom solutions that fit the way you actually work.",
  openGraph: {
    title: "Streamline Workshop",
    description: "We find the friction. We fix it.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
