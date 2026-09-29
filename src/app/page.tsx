'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HeartHandshake, ShieldCheck, MapPin, Sparkles, Clock, Calendar, 
  Baby, Heart, PawPrint, Home, Building2, Star, CheckCircle2, 
  ArrowRight, Users, ChevronRight, Lock, Award, Eye
} from 'lucide-react';
import { useCareNest } from '@/lib/CareNestContext';
import { FacilityCard } from '@/components/FacilityCard';
import { CaregiverCard } from '@/components/CaregiverCard';

export default function HomePage() {
  const { facilities, caregivers, orders } = useCareNest();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'child' | 'elderly' | 'pet'>('all');

  const filteredFacilities = selectedCategory === 'all' 
    ? facilities 
    : facilities.filter(f => {
        if (selectedCategory === 'child') return f.category === 'child_daycare';
        if (selectedCategory === 'elderly') return f.category === 'elderly_daycare';
        if (selectedCategory === 'pet') return f.category === 'pet_hotel_care' || f.category === 'clinic_care';
        return true;
      });

  const filteredCaregivers = selectedCategory === 'all'
    ? caregivers
    : caregivers.filter(c => c.service_categories.includes(selectedCategory as any));

  const activeOrder = orders.find(o => o.order_status === 'in_progress') || orders[0];

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. HERO SECTION (Gojek / Shopee Style Modern Banner) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-600 via-teal-700 to-emerald-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Marketplace Pengasuhan Terjadwal No. 1 di Indonesia</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Pesan Pengasuh & Mitra Care Terpercaya di <span className="text-emerald-300 underline decoration-amber-400 decoration-wavy decoration-2">Indonesia</span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl leading-relaxed">
                Solusi terjadwal untuk <span className="font-semibold text-white">Anak, Lansia, dan Hewan</span>. Pilihan datang ke rumah (Home Visit) atau titip di Daycare/Klinik mitra terdekat. Aman dengan verifikasi KTP, SKCK, pantauan GPS aktif, dan sistem escrow.
              </p>

              {/* H-1 Rule Highlight */}
              <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-3 text-xs text-emerald-100 max-w-xl">
                <Clock className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Aturan Booking Wajib H-1 (Minimal 24 Jam):</span>{' '}
                  Memberi waktu untuk verifikasi ketat kandidat, persiapan care plan khusus, dan kesiapan fasilitas mitra di Surabaya.
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/customer/booking"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-amber-400 hover:bg-amber-300 text-gray-950 shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Pesan Care Sekarang (H-1)</span>
                </Link>

                <Link
                  href="/talent/register"
                  className="px-5 py-3.5 rounded-xl font-bold text-sm bg-white text-emerald-950 hover:bg-emerald-50 shadow-md transition-all flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Daftar Jadi Talent (Oprec)</span>
                </Link>

                <Link
                  href="/customer/facilities"
                  className="px-5 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all backdrop-blur-xs flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Cari Daycare / Klinik Mitra</span>
                </Link>
              </div>
            </div>

            {/* Right Card: Gojek/Shopee Style Service Picker Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 shadow-2xl text-gray-900 border border-white/20">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-sm text-gray-900">Lokasi Layanan: Kota Surabaya</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Tersedia Hari Ini
                  </span>
                </div>

                <p className="text-xs text-gray-500 mb-3 font-medium">Pilih Kategori Kebutuhan Anda:</p>

                {/* 3 Categories Grid */}
                <div className="grid grid-cols-3 gap-2.5 mb-5">
                  <Link
                    href="/customer/booking?category=child"
                    className="p-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/60 hover:bg-emerald-100 transition-all text-center flex flex-col items-center group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                      <Baby className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-xs text-gray-800">Anak</span>
                    <span className="text-[10px] text-gray-500">Daycare & Nanny</span>
                  </Link>

                  <Link
                    href="/customer/booking?category=elderly"
                    className="p-3.5 rounded-2xl border border-teal-100 bg-teal-50/60 hover:bg-teal-100 transition-all text-center flex flex-col items-center group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                      <Heart className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-xs text-gray-800">Lansia</span>
                    <span className="text-[10px] text-gray-500">Perawat & Terapi</span>
                  </Link>

                  <Link
                    href="/customer/booking?category=pet"
                    className="p-3.5 rounded-2xl border border-amber-100 bg-amber-50/60 hover:bg-amber-100 transition-all text-center flex flex-col items-center group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                      <PawPrint className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-xs text-gray-800">Hewan</span>
                    <span className="text-[10px] text-gray-500">Pet Hotel & Sitter</span>
                  </Link>
                </div>

                {/* 2 Fulfillment Modes */}
                <p className="text-xs text-gray-500 mb-2 font-medium">Jalur Pemenuhan Layanan:</p>
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="p-2.5 rounded-xl border border-gray-200 bg-gray-50/80 flex items-center gap-2">
                    <Home className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold text-gray-800 text-[11px]">Home Visit</p>
                      <p className="text-[10px] text-gray-500">Pengasuh ke rumah Anda</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl border border-gray-200 bg-gray-50/80 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <div>
                      <p className="font-bold text-gray-800 text-[11px]">Titip di Mitra</p>
                      <p className="text-[10px] text-gray-500">Daycare & Klinik terdekat</p>
                    </div>
                  </div>
                </div>

                {/* Quick Area Coverage info */}
                <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    100% Escrow Terlindungi
                  </span>
                  <span className="font-semibold text-emerald-700">Surabaya Siap Pesan</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PROMO PAKET HARGA (Shopee / Gojek Style Bundling Banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Paket 1: Harian */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-700 rounded-full">
                  Pilihan Fleksibel
                </span>
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
              <h3 className="font-bold text-base text-gray-900">Paket Sesi (Minimal 5 Jam)</h3>
              <p className="text-xs text-gray-500 mt-1">Cocok untuk kebutuhan pendampingan insidental dengan durasi minimal 5 jam per kunjungan.</p>
              <div className="mt-3 text-emerald-700 font-bold text-lg">
                Tarif Reguler
                <span className="text-xs font-normal text-gray-500 ml-1">Mulai Rp 35.000 - Rp 50.000/jam</span>
              </div>
            </div>
            <Link
              href="/customer/booking?package=daily"
              className="mt-4 w-full text-center py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
            >
              Pilih Paket Sesi (Min. 5 Jam) →
            </Link>
          </div>

          {/* Paket 2: Mingguan (Hemat 5%) */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border-2 border-emerald-500 shadow-md hover:shadow-lg transition-all flex flex-col justify-between relative">
            <span className="absolute -top-3 right-4 px-3 py-0.5 text-[10px] font-extrabold bg-emerald-600 text-white rounded-full shadow-sm">
              POPULER • HEMAT 5%
            </span>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-200/80 text-emerald-900 rounded-full">
                  Paket 7 Hari
                </span>
                <Calendar className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-bold text-base text-emerald-950">Paket Mingguan (7 Hari)</h3>
              <p className="text-xs text-emerald-800/80 mt-1">Solusi ideal untuk orang tua bekerja atau pendampingan pemulihan lansia sepekan.</p>
              <div className="mt-3 text-emerald-800 font-bold text-lg">
                Diskon 5% Langsung
                <span className="text-xs font-normal text-emerald-700 block">Biaya per jam lebih terjangkau</span>
              </div>
            </div>
            <Link
              href="/customer/booking?package=weekly"
              className="mt-4 w-full text-center py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
            >
              Pilih Paket Mingguan →
            </Link>
          </div>

          {/* Paket 3: Bulanan (Hemat 15% Super Saver) */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-300 shadow-md hover:shadow-lg transition-all flex flex-col justify-between relative">
            <span className="absolute -top-3 right-4 px-3 py-0.5 text-[10px] font-extrabold bg-amber-500 text-gray-950 rounded-full shadow-sm">
              SUPER SAVER • HEMAT 15%
            </span>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-200 text-amber-900 rounded-full">
                  Langganan 30 Hari
                </span>
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="font-bold text-base text-amber-950">Paket Bulanan (30 Hari)</h3>
              <p className="text-xs text-amber-900/80 mt-1">Perawatan rutin berkelanjutan. Prioritas caregiver tetap & kontrak repeat care.</p>
              <div className="mt-3 text-amber-900 font-bold text-lg">
                Diskon 15% Maksimal
                <span className="text-xs font-normal text-amber-800 block">Jaminan pengganti jika izin</span>
              </div>
            </div>
            <Link
              href="/customer/booking?package=monthly"
              className="mt-4 w-full text-center py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-gray-950 shadow-sm transition-colors"
            >
              Pilih Paket Bulanan →
            </Link>
          </div>

        </div>
      </section>

      {/* 3. SIMULASI LIVE TRACKING DEMO BANNER */}
      {activeOrder && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-900 via-emerald-950 to-gray-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-900/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Order Sedang Berjalan di Surabaya</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">
                {activeOrder.recipient_name} • {activeOrder.service_address}
              </h3>
              <p className="text-xs text-gray-300 max-w-xl">
                Pengasuh: <span className="text-white font-semibold">{activeOrder.caregiver_name}</span>. GPS aktif di Surabaya, foto bukti telah diunggah dengan cap lokasi & timestamp akurat.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-48 bg-gray-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all"
                    style={{ width: `${activeOrder.progress_percentage}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-emerald-400">{activeOrder.progress_percentage}% Selesai</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href={`/customer/order/${activeOrder.id}`}
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>Lihat Live Tracker Customer</span>
              </Link>

              <Link
                href="/caregiver"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Buka Layar Tugas Pengasuh (Upload Foto + GPS) →</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 4. DIREKTORI MITRA FASILITAS TERDEKAT SURABAYA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Mitra Fasilitas Surabaya</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              Daycare Anak, Pet Hotel & Klinik Terdekat
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Fasilitas terakreditasi di Surabaya dengan kuota transparan, CCTV, dan tenaga profesional.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/customer/facilities"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Lihat Semua Mitra Surabaya ({facilities.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {(['all', 'child', 'elderly', 'pet'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              {cat === 'all' && 'Semua Kategori'}
              {cat === 'child' && '👶 Daycare Anak'}
              {cat === 'elderly' && '👵 Senior Activity Center'}
              {cat === 'pet' && '🐾 Pet Hotel & Klinik'}
            </button>
          ))}
        </div>

        {/* Grid of Facilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.slice(0, 3).map((facility, idx) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              distanceKm={1.5 + idx * 0.8}
            />
          ))}
        </div>
      </section>

      {/* 5. DAFTAR TALENT / PENGASUH TERVERIFIKASI SURABAYA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Caregiver Marketplace</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              Daftar Talent & Pengasuh Terverifikasi di Surabaya
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Mahasiswa Keperawatan UNAIR, eks Pendidik PAUD, dan lulusan Kedokteran Hewan dengan verifikasi KTP & SKCK.
            </p>
          </div>

          <Link
            href="/customer/talent"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>Lihat Semua Talent ({caregivers.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid of Caregivers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCaregivers.slice(0, 3).map((caregiver, idx) => (
            <CaregiverCard
              key={caregiver.id}
              caregiver={caregiver}
              distanceKm={1.2 + idx * 0.9}
            />
          ))}
        </div>
      </section>

      {/* 6. TRUST & SAFETY LAYER (PRD Guardrails Highlight) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Mengapa CareHub Lebih Aman & Terpercaya?
            </h2>
            <p className="text-xs text-gray-500 mt-1.5">
              Standar keamanan ketat untuk menjamin ketenangan hati keluarga Anda di Surabaya.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Booking H-1 & Min. 5 Jam</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Pemesanan wajib minimal 24 jam sebelum mulai dengan durasi minimal 5 jam demi persiapan care plan optimal.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">KYC & SKCK Verified</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Caregiver yang datang ke rumah wajib memiliki SKCK resmi Polda Jatim serta verifikasi identitas dan pendidikan.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">GPS Surabaya & Foto Bukti</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                GPS wajib aktif saat mengerjakan task. Setiap bukti pekerjaan dicap dengan koordinat dan alamat aktual.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">100% Escrow Protection</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Dana ditahan aman di sistem. Pembayaran baru cair ke rekening pengasuh setelah Anda mengonfirmasi pekerjaan selesai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM BANNER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Butuh Pengasuh Terpercaya di Surabaya Besok?
          </h2>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto">
            Buat care request sekarang untuk jadwal minimal 24 jam ke depan. Bandingkan profil kandidat, pilih paket harga hemat, dan pantau progres secara real-time.
          </p>
          <div className="pt-2">
            <Link
              href="/customer/booking"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-amber-400 hover:bg-amber-300 text-gray-950 shadow-lg shadow-amber-500/25 transition-all"
            >
              <span>Mulai Buat Care Request</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
