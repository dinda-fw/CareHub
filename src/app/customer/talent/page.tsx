'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCareNest } from '@/lib/CareNestContext';
import { CaregiverCard } from '@/components/CaregiverCard';
import { Users, Search, ShieldCheck, Award, Sparkles, Briefcase, ArrowRight } from 'lucide-react';
import { ServiceCategory } from '@/lib/types';

export default function TalentDirectoryPage() {
  const { caregivers, currentUser } = useCareNest();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ServiceCategory>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');

  const filteredCaregivers = caregivers.filter(cg => {
    const matchesSearch = cg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cg.education.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cg.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cg.badges.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || cg.service_categories.includes(categoryFilter);
    const matchesArea = areaFilter === 'all' || cg.service_areas.some(a => a.toLowerCase().includes(areaFilter.toLowerCase()));
    return matchesSearch && matchesCategory && matchesArea;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <Users className="w-3.5 h-3.5 text-emerald-600" />
          <span>Talent Marketplace Terverifikasi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Daftar Caregiver & Pengasuh Profesional di Surabaya
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-2xl">
          Tenaga terlatih dari Keperawatan UNAIR, eks Pendidik PAUD, dan Kedokteran Hewan. Wajib lolos verifikasi identitas KTP dan SKCK resmi Polda Jatim sebelum melayani kunjungan ke rumah.
        </p>
      </div>

      {/* Oprec Talent Callout Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-emerald-500/10 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-gray-950 flex items-center justify-center font-bold shrink-0 shadow-sm">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm sm:text-base text-gray-900">
                Buka Lowongan Mitra Talent / Pengasuh CareNest
              </h3>
              <span className="px-2 py-0.2 text-[10px] font-extrabold bg-amber-400 text-gray-950 rounded-full">
                Oprec Terbuka
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1 max-w-2xl">
              Khusus mahasiswa & lulusan Keperawatan UNAIR, PG-PAUD, Kedokteran Hewan, atau berpengalaman. Syarat ketat: KTP, SKCK resmi Polda Jatim, verifikasi ijazah, dan akun bank.
            </p>
          </div>
        </div>
        <Link
          href="/talent/register"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-gray-950 shadow-sm flex items-center justify-center gap-2 shrink-0 transition-all"
        >
          <span>Daftar Jadi Talent (Oprec)</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Search Input */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nama, keahlian, kampus UNAIR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Semua Kategori Keahlian</option>
              <option value="elderly">👵 Lansia & Geriatri</option>
              <option value="child">👶 Anak & Balita</option>
              <option value="pet">🐾 Hewan Peliharaan</option>
            </select>
          </div>

          {/* Area Filter */}
          <div>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Semua Wilayah Layanan Surabaya</option>
              <option value="Surabaya Pusat">Surabaya Pusat</option>
              <option value="Surabaya Timur">Surabaya Timur (Gubeng, Sukolilo, Rungkut)</option>
              <option value="Surabaya Selatan">Surabaya Selatan (Wonokromo)</option>
              <option value="Surabaya Barat">Surabaya Barat (Wiyung)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Trust Callout */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Setiap caregiver yang datang ke rumah telah melewati audit SKCK dan verifikasi ijazah.</span>
        </div>
        <span className="font-bold text-emerald-800">Menampilkan {filteredCaregivers.length} Talent</span>
      </div>

      {/* Grid of Caregivers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCaregivers.map((caregiver, idx) => (
          <CaregiverCard
            key={caregiver.id}
            caregiver={caregiver}
            distanceKm={1.3 + (idx % 3) * 0.9}
          />
        ))}
      </div>

      {filteredCaregivers.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
          <Users className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-bold text-gray-800 text-sm">Tidak ada caregiver yang cocok</h3>
          <p className="text-xs text-gray-500">Coba atur ulang pencarian atau pilih kategori keahlian lain.</p>
        </div>
      )}

    </div>
  );
}
