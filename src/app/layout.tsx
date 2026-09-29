import type { Metadata } from 'next';
import './globals.css';
import { CareNestProvider } from '@/lib/CareNestContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'CareHub Indonesia - Trusted Scheduled Care Platform (Surabaya)',
  description: 'Marketplace pengasuhan terjadwal untuk Anak, Lansia, dan Hewan di Surabaya. Verifikasi KTP & SKCK, pemantauan GPS real-time, dan garansi escrow aman.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="flex flex-col min-h-screen">
        <CareNestProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </CareNestProvider>
      </body>
    </html>
  );
}
