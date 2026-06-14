import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Candid — Track your job search',
  description:
    'Kanban board for job hunters. Track applications, get follow-up reminders and generate emails with AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cn('h-full', 'antialiased', 'font-sans', geist.variable)}>
      <body className="min-h-full flex flex-col font-(--font-inter)">{children}</body>
    </html>
  );
}
