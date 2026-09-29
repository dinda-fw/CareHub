'use client';

import React from 'react';
import Link from 'next/link';
import { 
  HeartHandshake, Sparkles, Clock, Calendar, ShieldCheck, 
  MapPin, Eye, ArrowRight, Baby, Heart, PawPrint, Building2, 
  Wallet, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { useCareNest } from '@/lib/CareNestContext';
import { ProgressBar } from '@/components/ProgressBar';
import { FacilityCard } from '@/components/FacilityCard';
import { CaregiverCard } from '@/components/CaregiverCard';

export default function CustomerDashboard() {
  const { currentUser, orders, facilities, caregivers } = useCareNest();

  const customerOrders = currentUser ? orders.filter(o => o.customer_id === currentUser.id) : orders;
  const awaitingOrder = customerOrders.find(o => o.order_status === 'awaiting_applicants' || (!o.caregiver_id && o.escrow_status === 'pending'));
  const activeOrder = customerOrders.find(o => o.order_status === 'in_progress' || (o.order_status === 'confirmed' && o.escrow_status === 'held'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-emerald-100">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span>Lokasi Anda: {currentUser?.district || 'Gubeng'}, {currentUser?.city || 'Kota Surabaya'}</span>
            </div>
            {currentUser?.is_verified && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-xs font-bold text-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Akun Terverifikasi {currentUser.nik_ktp ? `(NIK: ${currentUser.nik_ktp.slice(0, 6)}******)` : '(Anti-Orderan Fiktif)'}</span>
              </div>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Selamat Datang, {currentUser?.full_name || 'Keluarga CareHub'}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Rencanakan layanan care untuk keluarga dengan tenang. Jadwalkan pengasuh terverifikasi H-1 dengan jaminan dana escrow terlindungi & proteksi data KTP terenkripsi.
          </p>
        </div>

        {/* Right side: Quick Book Button & Wallet */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 text-center">
            <span className="text-[11px] text-emerald-200 block">Saldo Escrow / Dompet:</span>
            <span className="text-base font-bold">Rp {(currentUser?.wallet_balance || 1500000).toLocaleString('id-ID')}</span>
          </div>

          <Link
            href="/customer/booking"
            className="px-5 py-3.5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-gray-950 shadow-md text-center flex items-center justify-center gap-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Pesan Care Baru</span>
          </Link>
        </div>
      </div>

      {/* AWAITING APPLICANTS HR SELECTION CALLOUT */}
      {awaitingOrder && (
        <div className="bg-gradient-to-r from-amber-50 via-amber-100/50 to-orange-50 rounded-3xl p-6 border-2 border-amber-400 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md mt-0.5">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                Lowongan Aktif • Pelamar Masuk
              </span>
              <h2 className="text-base font-bold text-gray-900">
                Pesanan #{awaitingOrder.order_number}: Pengasuh Siap Diseleksi!
              </h2>
              <p className="text-xs text-gray-700 leading-relaxed max-w-xl">
                Beberapa mitra pengasuh terverifikasi di Surabaya telah melamar untuk mendampingi <strong>{awaitingOrder.recipient_name}</strong>. Silakan tinjau profil, STR, SKCK, dan ulasan mereka sebelum deal & bayar ke escrow.
              </p>
            </div>
          </div>

          <Link
            href={`/customer/order/${awaitingOrder.id}`}
            className="px-6 py-3 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-gray-950 shadow-md flex items-center gap-2 transition-all shrink-0 cursor-pointer self-stretch md:self-auto justify-center"
          >
            <span>Seleksi Pelamar Sekarang (HR View)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* ACTIVE ORDER LIVE TRACKING CARD */}
      {activeOrder && (
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500 shadow-md space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-base font-bold text-gray-900">
                Pesanan Aktif: #{activeOrder.order_number}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {activeOrder.recipient_name}
              </span>
            </div>

            <Link
              href={`/customer/order/${activeOrder.id}`}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Buka Live Tracker & Foto GPS</span>
            </Link>
          </div>

          {/* Progress Bar Widget */}
          <ProgressBar
            percentage={activeOrder.progress_percentage}
            totalTasks={activeOrder.tasks.length}
            completedTasks={activeOrder.tasks.filter(t => t.status === 'completed').length}
            escrowStatus={activeOrder.escrow_status}
            orderStatus={activeOrder.order_status}
          />
        </div>
      )}

      {/* QUICK SERVICE SELECTION */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Pilih Layanan Cepat Surabaya</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/customer/booking?category=elderly"
            className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all flex items-start gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">Pendampingan Lansia</h3>
              <p className="text-xs text-gray-500 mt-1">Perawat pasca stroke, kontrol obat, dan stimulasi gerak.</p>
              <span className="text-xs font-semibold text-emerald-600 mt-2 block">Pesan H-1 →</span>
            </div>
          </Link>

          <Link
            href="/customer/booking?category=child"
            className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all flex items-start gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Baby className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">Daycare & Child Care</h3>
              <p className="text-xs text-gray-500 mt-1">Pendidik PAUD tersertifikasi atau titip di daycare resmi.</p>
              <span className="text-xs font-semibold text-emerald-600 mt-2 block">Pesan H-1 →</span>
            </div>
          </Link>

          <Link
            href="/customer/booking?category=pet"
            className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all flex items-start gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <PawPrint className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">Pet Care & Hotel</h3>
              <p className="text-xs text-gray-500 mt-1">Mahasiswa Kedokteran Hewan UNAIR & fasilitas pet hotel AC.</p>
              <span className="text-xs font-semibold text-emerald-600 mt-2 block">Pesan H-1 →</span>
            </div>
          </Link>
        </div>
      </div>

      {/* RECOMMENDED MITRA FASILITAS SURABAYA */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Mitra Fasilitas Terdekat di Surabaya</h2>
            <p className="text-xs text-gray-500">Daycare anak, pet hotel, dan senior center di sekitar {currentUser?.district || 'Surabaya'}</p>
          </div>
          <Link
            href="/customer/facilities"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>Semua Mitra</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.slice(0, 3).map((fac, idx) => (
            <FacilityCard key={fac.id} facility={fac} distanceKm={1.6 + idx * 0.7} />
          ))}
        </div>
      </div>

      {/* RECOMMENDED TALENT / CAREGIVERS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Caregiver Terverifikasi Surabaya</h2>
            <p className="text-xs text-gray-500">Tenaga terlatih dengan verifikasi KTP, SKCK, dan rating tinggi</p>
          </div>
          <Link
            href="/customer/talent"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>Semua Talent</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caregivers.slice(0, 3).map((cg, idx) => (
            <CaregiverCard key={cg.id} caregiver={cg} distanceKm={1.2 + idx * 0.8} />
          ))}
        </div>
      </div>

      {/* ORDER HISTORY LIST */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">Riwayat Pesanan Anda ({customerOrders.length})</h2>
        <div className="divide-y divide-gray-100">
          {customerOrders.map(order => (
            <div key={order.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">#{order.order_number}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                    {order.package_type.toUpperCase()} ({order.days_count} Hari)
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    order.order_status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : order.order_status === 'awaiting_applicants'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : order.escrow_status === 'pending'
                      ? 'bg-orange-100 text-orange-900 border border-orange-300'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.order_status === 'completed'
                      ? 'Selesai'
                      : order.order_status === 'awaiting_applicants'
                      ? 'Seleksi Pelamar'
                      : order.escrow_status === 'pending'
                      ? 'Menunggu Escrow'
                      : 'Aktif'}
                  </span>
                </div>
                <p className="text-gray-600 mt-0.5">
                  {order.recipient_name} • {order.service_address}
                </p>
                <p className="text-[11px] text-gray-400">
                  {order.tasks.length} task terjadwal • Total Rp {order.total_amount.toLocaleString('id-ID')}
                </p>
              </div>

              <Link
                href={`/customer/order/${order.id}`}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
                  order.order_status === 'awaiting_applicants'
                    ? 'bg-amber-500 hover:bg-amber-600 text-gray-950 shadow-xs'
                    : order.escrow_status === 'pending'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    : 'border border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                {order.order_status === 'awaiting_applicants'
                  ? 'Seleksi Pengasuh (HR View) →'
                  : order.escrow_status === 'pending'
                  ? 'Bayar Escrow Sekarang →'
                  : 'Detail & Live Progress →'}
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
