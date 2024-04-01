import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';

import { Sidebar } from '@/components/Sidebar/Sidebar';
import './globals.css';
import { LibraryProvider } from '@/contexts/LibraryContext';

const font = Figtree({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Spotify',
  description: 'Listen to music!'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <LibraryProvider>
          <Sidebar>{children}</Sidebar>
        </LibraryProvider>
      </body>
    </html>
  );
}
