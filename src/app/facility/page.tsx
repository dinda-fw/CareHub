'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, Users, Calendar, Clock, ShieldCheck, CheckCircle2, 
  MapPin, Plus, Camera, Bell, ArrowRight, Eye, Sparkles 
} from 'lucide-react';
import { useCareNest } from '@/lib/CareNestContext';

export default function FacilityDashboard() {
  const { facilities, currentUser, orders } = useCareNest();

  const myFacility = facilities[0]; // LittleNest Premium Daycare Tegalsari Surabaya
  const [slotsAvailable, setSlotsAvailable] = useState<number>(myFacility.slots_available);
  const [checkedInIds, setCheckedInIds] = useState<string[]>(['k-01']);

  // Sample attendee list in Surabaya daycare
  const attendees = [
    { id: 'k-01', name: 'Kenzo Pratama (4 Tahun)', parent: 'Budi Santoso (Gubeng)', package: 'Paket Mingguan', time: '07:30 - 16:30 WIB', status: 'Checked In', diet: 'Alergi Telur Mentah' },
    { id: 'k-02', name: 'Arka Putra (3 Tahun)', parent: 'Ibu Ratna (Tegalsari)', package: 'Paket Harian', time: '08:00 - 17:00 WIB', status: 'Menunggu Antar', diet: 'Bawa Bekal Sendiri' },
    { id: 'k-03', name: 'Aisyah Putri (5 Tahun)', parent: 'Bpk Hendra (Darmo)', package: 'Paket Bulanan', time: '07:00 - 18:00 WIB', status: 'Checked In', diet: 'Tidak Ada Alergi' },
  ];

  const handleToggleCheckIn = (id: string) => {
    if (checkedInIds.includes(id)) {
      setCheckedInIds(checkedInIds.filter(i => i !== id));
    } else {
      setCheckedInIds([...checkedInIds, id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Facility Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-purple-200">
            <Building2 className="w-3.5 h-3.5 text-purple-300" />
            <span>Mitra Resmi Terakreditasi • Surabaya Pusat</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">{myFacility.name}</h1>
          <p className="text-xs sm:text-sm text-purple-200 max-w-xl">
            {myFacility.address} • Jam Operasional: {myFacility.operating_hours}
          </p>
          <div className="flex items-center gap-3 text-xs text-purple-200 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-300" /> Izin Operasional Kemendikbud Valid
            </span>
            <span>•</span>
            <span>4.94 ⭐ (84 Ulasan)</span>
          </div>
        </div>

        {/* Financial & Slot Snapshot */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center w-full md:w-auto min-w-[220px] space-y-2">
          <span className="text-[11px] text-purple-200 block">Saldo Mitra Fasilitas:</span>
          <span className="text-xl font-extrabold text-white block">
            Rp {(currentUser?.wallet_balance ?? 4200000).toLocaleString('id-ID')}
          </span>
          <div className="text-[11px] text-emerald-300 font-semibold bg-white/10 py-1 rounded">
            Okupansi Hari Ini: {myFacility.capacity - slotsAvailable}/{myFacility.capacity} Slot ({Math.round(((myFacility.capacity - slotsAvailable) / myFacility.capacity) * 100)}%)
          </div>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">Anak Dititipkan Hari Ini</span>
            <div className="text-2xl font-bold text-gray-900 mt-1">{checkedInIds.length} Anak</div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Semua dalam kondisi sehat</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">Sisa Slot / Kuota Harian</span>
            <div className="text-2xl font-bold text-gray-900 mt-1">{slotsAvailable} Kuota</div>
            <span className="text-[11px] text-gray-400 mt-0.5 block">Dari kapasitas total {myFacility.capacity}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSlotsAvailable(Math.max(0, slotsAvailable - 1))}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
            >
              -
            </button>
            <button
              onClick={() => setSlotsAvailable(Math.min(myFacility.capacity, slotsAvailable + 1))}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">Status CCTV 24 Jam</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">Live Online</div>
            <span className="text-[11px] text-gray-400 mt-0.5 block">Dapat diakses orang tua</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Camera className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* CHECK-IN & ATTENDEE MANAGER */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Daftar Kehadiran & Check-in Penitipan</h2>
            <p className="text-xs text-gray-500">Pantau anak/hewan yang dititipkan di fasilitas Anda hari ini di Surabaya.</p>
          </div>
          <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
            Surabaya Barat & Pusat
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {attendees.map(item => {
            const isCheckedIn = checkedInIds.includes(item.id);
            return (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 mt-0.5 ${isCheckedIn ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                    {isCheckedIn ? '✓' : '...'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{item.name}</h3>
                    <p className="text-gray-500">Orang tua: {item.parent} • {item.package}</p>
                    <p className="text-purple-800 font-medium mt-0.5">Catatan Khusus / Alergi: {item.diet}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${isCheckedIn ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {isCheckedIn ? 'Sudah Check-In di Daycare' : 'Menunggu Kedatangan'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleCheckIn(item.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${isCheckedIn ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                  >
                    {isCheckedIn ? 'Check Out' : 'Check In'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DAILY FACILITY SOP CHECKLIST */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">SOP Fasilitas Berkala (Quality Assurance)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            'Sterilisasi Mainan & Ruang Edukasi (06:30 WIB)',
            'Pemberian Snack Pagi Buah & Susu (09:30 WIB)',
            'Sesi Belajar Interaktif & Motorik Halus (10:30 WIB)',
            'Makan Siang Bernutrisi Rendah Garam (12:00 WIB)',
            'Tidur Siang Ruangan Hening Ber-AC (13:00 - 14:30 WIB)',
            'Pemeriksaan Suhu & Laporan Digital Harian (16:00 WIB)',
          ].map((sop, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-gray-700 font-medium">{sop}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
