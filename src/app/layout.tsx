import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/sonner';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Workflow Builder',
  description: 'Visual workflow automation platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex h-screen flex-col">
          <Header />
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
