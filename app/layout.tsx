import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: 'Candid — Suivi de candidatures avec IA',
    template: '%s | Candid',
  },
  description:
    "Kanban visuel, relances automatiques et génération d'emails par IA. Gratuit et sans carte bancaire.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://follow-candid.vercel.app'),
  openGraph: {
    title: 'Candid — Suivi de candidatures avec IA',
    description: "Kanban visuel, relances automatiques et génération d'emails par IA.",
    url: `${process.env.NEXT_PUBLIC_APP_URL}`,
    siteName: 'Candid',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Candid — Suivi de candidatures avec IA',
    description: "Kanban visuel, relances automatiques et génération d'emails par IA.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cn('h-full', 'antialiased', 'font-sans', geist.variable)}>
      <body className="min-h-full flex flex-col font-(--font-inter)">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
