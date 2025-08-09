import type { Metadata } from 'next';
import './globals.css';
import SessionSync from '@/components/auth/SessionSync';

export const metadata: Metadata = {
  title: 'GOMFLOW - Group Buying Made Simple',
  description: 'Turn your bulk purchase into a community win. Create a group buy in 30 seconds, share with one click, and save everyone money on shipping.',
  keywords: 'group buy, bulk purchase, shipping savings, collective buying, group deals',
  authors: [{ name: 'GOMFLOW Team' }],
  openGraph: {
    title: 'GOMFLOW - Group Buying Made Simple',
    description: 'Turn your bulk purchase into a community win. Create a group buy in 30 seconds, share with one click, and save everyone money on shipping.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GOMFLOW - Group Buying Made Simple',
    description: 'Turn your bulk purchase into a community win. Create a group buy in 30 seconds, share with one click, and save everyone money on shipping.',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionSync />
        {children}
      </body>
    </html>
  );
}
