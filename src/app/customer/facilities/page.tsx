'use client';

import React, { useState } from 'react';
import { useCareNest } from '@/lib/CareNestContext';
import { FacilityCard } from '@/components/FacilityCard';
import { Building2, Search, MapPin, Filter, Sparkles } from 'lucide-react';

export default function FacilitiesDirectoryPage() {
  const { facilities, currentUser } = useCareNest();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'child_daycare' | 'pet_hotel_care' | 'elderly_daycare' | 'clinic_care'>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');

  const filteredFacilities = facilities.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.amenities.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter;
    const matchesDistrict = districtFilter === 'all' || f.district === districtFilter;
    return matchesSearch && matchesCategory && matchesDistrict;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <Building2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Fasilitas Mitra Resmi Surabaya</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Direktori Daycare, Pet Hotel & Klinik Terdekat
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-2xl">
          Fasilitas terakreditasi di Surabaya dengan kuota harian transparan, dokter visit, dan pengawasan CCTV. Pilih mitra terdekat dari lokasi Anda di {currentUser?.district || 'Surabaya'}.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Search Input */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nama fasilitas, layanan, CCTV..."
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
              <option value="all">Semua Kategori Fasilitas</option>
              <option value="child_daycare">👶 Daycare Anak & Balita</option>
              <option value="pet_hotel_care">🐾 Pet Hotel & Daycare Hewan</option>
              <option value="elderly_daycare">👵 Senior Activity Center</option>
              <option value="clinic_care">🏥 Klinik & Rawat Inap Hewan/Lansia</option>
            </select>
          </div>

          {/* District Dropdown */}
          <div>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Semua Wilayah Surabaya</option>
              <option value="Gubeng">Gubeng (Surabaya Timur/Pusat)</option>
              <option value="Tegalsari">Tegalsari (Surabaya Pusat)</option>
              <option value="Wonokromo">Wonokromo (Surabaya Selatan)</option>
              <option value="Rungkut">Rungkut & MERR (Surabaya Timur)</option>
              <option value="Sukolilo">Sukolilo (Surabaya Timur)</option>
              <option value="Wiyung">Wiyung (Surabaya Barat)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Menampilkan {filteredFacilities.length} mitra di Kota Surabaya</span>
        <span className="text-emerald-700 font-medium">Aturan Booking H-1 Berlaku</span>
      </div>

      {/* Grid of Facilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((facility, idx) => (
          <FacilityCard
            key={facility.id}
            facility={facility}
            distanceKm={1.5 + (idx % 4) * 0.8}
          />
        ))}
      </div>

      {filteredFacilities.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-bold text-gray-800 text-sm">Tidak ada fasilitas yang cocok</h3>
          <p className="text-xs text-gray-500">Coba ubah kata kunci pencarian atau wilayah Surabaya lainnya.</p>
        </div>
      )}

    </div>
  );
}
