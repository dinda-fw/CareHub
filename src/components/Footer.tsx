import React from 'react';
import Link from 'next/link';
import { HeartHandshake, ShieldCheck, MapPin, Phone, Lock, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-800">
          
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Care<span className="text-emerald-400">Hub</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Platform marketplace layanan pengasuhan terjadwal untuk Anak, Lansia, dan Hewan di Kota Surabaya. Terverifikasi KTP, SKCK, dan pemantauan GPS real-time.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-800/50">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Garansi 100% Escrow Aman: Dana dicairkan setelah tugas selesai.</span>
            </div>
          </div>

          {/* Cakupan Surabaya */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Wilayah Surabaya
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Surabaya Pusat (Tegalsari, Genteng, Bubutan)</li>
              <li>Surabaya Timur (Gubeng, Sukolilo, Mulyorejo, Rungkut)</li>
              <li>Surabaya Selatan (Wonokromo, Wonocolo, Gayungan)</li>
              <li>Surabaya Barat (Wiyung, Dukuh Pakis, Sambikerep)</li>
              <li>Surabaya Utara (Kenjeran, Semampir, Pabean)</li>
            </ul>
          </div>

          {/* Layanan & Jalur Pemenuhan */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Layanan Utama
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Home Visit Caregiver (Datang ke Rumah)</li>
              <li>• Titip di Mitra Daycare Anak Surabaya</li>
              <li>• Pet Hotel & Daycare Hewan Terakreditasi</li>
              <li>• Pendampingan Lansia & Pemulihan Stroke</li>
              <li>• Paket Hemat: Harian, Mingguan (5%), Bulanan (15%)</li>
            </ul>
          </div>

          {/* Keamanan & Hubungi Kami */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              Pusat Keamanan
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              Hub Operasional Surabaya: Jl. Sumatra No. 10, Gubeng, Surabaya, Jawa Timur.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Hotline 24/7: 031-8900-HUB</span>
              </div>
              <p className="text-xs text-gray-500">
                Patuhi aturan PRD: Wajib reservasi minimal H-1 (24 jam sebelumnya).
              </p>
            </div>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 CareHub Indonesia. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-emerald-400">Kebijakan Privasi</Link>
            <Link href="/" className="hover:text-emerald-400">Syarat & Ketentuan</Link>
            <Link href="/admin" className="hover:text-emerald-400">Audit Trail</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
