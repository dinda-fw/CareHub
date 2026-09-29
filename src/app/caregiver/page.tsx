'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  HeartHandshake, ShieldCheck, MapPin, Camera, Clock, 
  Wallet, Star, AlertTriangle, ArrowRight, Eye, CheckCircle2, 
  Sparkles, DollarSign, Send, User, Award, Edit3, Save, 
  Phone, AlertOctagon, BatteryCharging, Radio, Navigation, Check, History, Briefcase, FileCheck
} from 'lucide-react';
import { useCareNest } from '@/lib/CareNestContext';
import { ProgressBar } from '@/components/ProgressBar';
import { TaskChecklist } from '@/components/TaskChecklist';

export default function CaregiverPortalPage() {
  const router = useRouter();
  const { 
    currentUser, isLoggedIn, orders, bids, gpsActive, setGpsActive, 
    currentGpsCoords, applyToJob, acceptJobBid, updateCaregiverProfile, switchRole 
  } = useCareNest();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'jobs' | 'tasks' | 'profile' | 'history'>('tasks');

  // Job Application Form State
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [proposedRate, setProposedRate] = useState<number>(50000);
  const [proposalNote, setProposalNote] = useState<string>('Halo, saya siap mendampingi sesuai seluruh care plan dan checklist tugas yang ditentukan.');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editBio, setEditBio] = useState<string>(
    currentUser?.role === 'caregiver'
      ? 'Lulusan Ners Keperawatan UNAIR Surabaya. Berpengalaman 3 tahun mendampingi lansia geriatri pasca stroke, kontrol jadwal obat rutin, cek tensi & gula darah, serta pendampingan anak.'
      : 'Mitra Pengasuh CareNest Terverifikasi Surabaya.'
  );
  const [editRate, setEditRate] = useState<number>(50000);
  const [editEducation, setEditEducation] = useState<string>('S1 Ners Keperawatan Universitas Airlangga');
  const [editDistrict, setEditDistrict] = useState<string>('Sukolilo, Surabaya');
  const [editAvailable, setEditAvailable] = useState<boolean>(true);

  // If not logged in, show access prompt or 1-click login
  if (!isLoggedIn || currentUser?.role !== 'caregiver') {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto shadow-md">
          <Briefcase className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Portal Khusus Mitra Talent / Pengasuh</h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
            Halaman ini khusus untuk mitra pengasuh CareNest di Surabaya. Silakan masuk sebagai talent atau daftar open recruitment.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => switchRole('caregiver')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>Masuk Cepat Sebagai Pengasuh (Dinda UNAIR)</span>
          </button>

          <Link
            href="/talent/register"
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-gray-950 shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Daftar Mitra Baru (Oprec)</span>
          </Link>
        </div>
      </div>
    );
  }

  // Active assigned orders
  const activeOrder = orders.find(o => o.order_status === 'in_progress' || o.order_status === 'confirmed') || orders[0];
  const completedTasksCount = activeOrder ? activeOrder.tasks.filter(t => t.status === 'completed').length : 0;
  const isAllTasksCompleted = activeOrder && completedTasksCount === activeOrder.tasks.length && activeOrder.tasks.length > 0;

  // Open Jobs waiting for caregivers in Surabaya
  const openCareRequests = orders.filter(o => o.order_status === 'awaiting_applicants' || o.id === 'ord00000-0000-0000-0000-000000000003');

  // Handle Apply Job
  const handleApply = (orderId: string) => {
    const res = applyToJob(orderId, proposedRate, proposalNote);
    if (res.success) {
      setAppliedJobs([...appliedJobs, orderId]);
      alert('Lamaran & penawaran Anda berhasil dikirim ke customer! Notifikasi akan dikirim jika customer menyetujui (ACC).');
      setSelectedJobId(null);
    }
  };

  // Simulate Customer ACCing the bid for demo
  const handleSimulateCustomerAccept = (orderId: string) => {
    // Find bid or create accepted
    const res = acceptJobBid(orderId, 'bid-simulated');
    alert('Simulasi: Customer Budi Santoso telah Menerima (ACC) lamaran Anda! Order kini aktif dan siap dikerjakan di tab "Tugas Aktif".');
    setActiveTab('tasks');
  };

  // Save profile updates
  const handleSaveProfile = () => {
    updateCaregiverProfile({
      bio: editBio,
      hourly_rate: editRate,
      education: editEducation,
      is_available: editAvailable,
    });
    setIsEditingProfile(false);
    alert('Profil dan tarif layanan Anda berhasil diperbarui!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. TOP HEADER & TALENT SUMMARY BANNER */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatar_url}
              alt={currentUser.full_name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/60 shadow-md"
            />
            {editAvailable && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-2 border-blue-900 rounded-full flex items-center justify-center text-[10px] text-gray-900 font-bold" title="Siap Menerima Order">
                ✓
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold">{currentUser.full_name}</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/50 rounded-full border border-blue-300/40 text-blue-100 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-300" /> SKCK & KTP Verified
              </span>
            </div>
            <p className="text-xs text-blue-200">
              {editEducation} • Rating: <strong className="text-amber-300">4.95 ⭐</strong> (48 Ulasan Customer)
            </p>
            <p className="text-[11px] text-blue-300 font-mono flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span>Wilayah Operasi: {editDistrict}</span>
            </p>
          </div>
        </div>

        {/* Wallet & Payout Snapshot */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center w-full md:w-auto min-w-[200px] space-y-2">
          <span className="text-[11px] text-blue-200 block">Saldo Dompet Caregiver:</span>
          <span className="text-2xl font-extrabold text-white block">
            Rp {currentUser.wallet_balance.toLocaleString('id-ID')}
          </span>
          <button
            onClick={() => alert('Pencairan dana sebesar Rp ' + currentUser.wallet_balance.toLocaleString('id-ID') + ' telah diproses ke Rekening BCA Anda!')}
            className="w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-white transition-all shadow-sm"
          >
            Tarik ke Rekening (Payout)
          </button>
        </div>
      </div>

      {/* 2. SECURITY GUARDRAIL & OPTIONS (Saran Pengaman Lengkap) */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${gpsActive ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-red-600 text-white border-red-700 shadow-lg animate-pulse'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${gpsActive ? 'bg-emerald-600 text-white' : 'bg-white text-red-600'}`}>
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">
                  {gpsActive ? 'GPS AKTIF & TERVERIFIKASI DI SURABAYA' : 'PERINGATAN KERAS: GPS NON-AKTIF (TASK DIJEDA)'}
                </h3>
                <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${gpsActive ? 'bg-emerald-200 text-emerald-900' : 'bg-red-900 text-white'}`}>
                  PRD BR-04
                </span>
              </div>
              <p className={`text-xs mt-1 ${gpsActive ? 'text-emerald-800' : 'text-red-100 font-medium'}`}>
                {gpsActive 
                  ? `Snapshot Posisi: ${currentGpsCoords.address} (${currentGpsCoords.lat.toFixed(4)}, ${currentGpsCoords.lng.toFixed(4)})` 
                  : 'Sesuai aturan keamanan CareNest, pengerjaan tugas dihentikan/dijeda otomatis jika GPS dimatikan untuk mencegah kabur & manipulasi.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setGpsActive(!gpsActive)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${gpsActive ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100' : 'bg-white text-red-700 hover:bg-gray-100 shadow-md'}`}
            >
              {gpsActive ? 'Uji Simulasi Matikan GPS' : 'Nyalakan Izin GPS Kembali'}
            </button>
          </div>
        </div>

        {/* Additional Safety Features Row */}
        <div className="mt-3 pt-3 border-t border-current/15 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 opacity-90">
            <Radio className="w-3.5 h-3.5" />
            <span>Geofencing: <strong>Radius 8m</strong></span>
          </div>
          <div className="flex items-center gap-1.5 opacity-90">
            <BatteryCharging className="w-3.5 h-3.5" />
            <span>Baterai HP: <strong>88% Normal</strong></span>
          </div>
          <div className="flex items-center gap-1.5 opacity-90">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Contact Masking: <strong>Aktif</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => alert('🚨 Tombol Darurat SOS ditekan! Laporan & koordinat langsung terkirim ke Tim Keamanan CareNest Surabaya & Keluarga Pemesan.')}
              className="text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded font-bold flex items-center gap-1"
            >
              <AlertOctagon className="w-3 h-3 text-red-600" /> SOS Darurat
            </button>
          </div>
        </div>
      </div>

      {/* 3. TABS NAVIGATION FOR TALENT */}
      <div className="border-b border-gray-200 flex items-center gap-2 sm:gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition-all ${activeTab === 'tasks' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          <Camera className="w-4 h-4" />
          <span>Tugas Aktif & Bukti GPS ({activeOrder ? 1 : 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition-all ${activeTab === 'jobs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Lowongan Job di Surabaya ({openCareRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition-all ${activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          <User className="w-4 h-4" />
          <span>Profil, Rating & Badge</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition-all ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          <History className="w-4 h-4" />
          <span>Riwayat Pesanan</span>
        </button>
      </div>

      {/* TAB 1: TUGAS AKTIF SAYA (PENGERJAAN TASK, PROGRES BAR, FOTO BUKTI & GPS) */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {activeOrder ? (
            <div className="bg-white rounded-3xl p-6 border-2 border-blue-500 shadow-md space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
                    <h2 className="text-base font-bold text-gray-900">
                      Tugas Aktif: #{activeOrder.order_number} ({activeOrder.recipient_name})
                    </h2>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Alamat: <span className="font-semibold text-gray-800">{activeOrder.service_address}{activeOrder.district ? `, ${activeOrder.district}` : ''}{activeOrder.city ? `, ${activeOrder.city}` : ''}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full font-bold text-xs">
                    Imbalan: Rp {(activeOrder.base_price - activeOrder.discount_amount).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Progress Bar Dinamis: 0% -> 33% -> 67% -> 100% */}
              <ProgressBar
                percentage={activeOrder.progress_percentage}
                totalTasks={activeOrder.tasks.length}
                completedTasks={completedTasksCount}
                escrowStatus={activeOrder.escrow_status}
                orderStatus={activeOrder.order_status}
              />

              {/* Task Checklist Execution */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-gray-900">Checklist Instruksi Tugas dari Customer:</h3>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {completedTasksCount} dari {activeOrder.tasks.length} Selesai
                  </span>
                </div>

                <TaskChecklist
                  orderId={activeOrder.id}
                  tasks={activeOrder.tasks}
                  isCaregiverView={true}
                />
              </div>

              {/* Completion Banner */}
              {isAllTasksCompleted && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold">
                      Semua tugas telah dilaporkan dengan foto bukti dan koordinat GPS Surabaya! Menunggu Customer melepaskan dana escrow.
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      switchRole('customer');
                      router.push(`/customer/order/${activeOrder.id}`);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shrink-0"
                  >
                    Beralih ke Customer untuk Melepas Dana →
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
              <Camera className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-bold text-gray-800 text-sm">Tidak ada tugas aktif</h3>
              <p className="text-xs text-gray-500">Buka tab "Lowongan Job di Surabaya" untuk mencari dan melamar order baru.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LOWONGAN JOB & APPLY (CARE REQUESTS DARI CUSTOMER SURABAYA) */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Lowongan Care Request Terjadwal H-1/ min 5 jam</h2>
              <p className="text-xs text-gray-500">Lamar lowongan sesuai target asuhan dan area terdekat Anda.</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Peluang Tersedia
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {openCareRequests.map(job => {
              const isApplied = appliedJobs.includes(job.id);
              const isSelected = selectedJobId === job.id;

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3 hover:border-blue-400 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-gray-900">#{job.order_number}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          {job.service_category === 'child' ? '👶 Anak & Balita' : job.service_category === 'elderly' ? '👵 Lansia' : '🐾 Hewan'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700">
                          Paket {job.package_type.toUpperCase()} ({job.duration_hours} Jam)
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-gray-900 mt-1">{job.recipient_name}</h3>
                      <p className="text-xs text-gray-600">{job.recipient_details}</p>

                      {job.caregiver_criteria && (
                        <div className="mt-2 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-1.5">
                          <span className="font-bold shrink-0 text-blue-700">🎯 Kriteria Dicari:</span>
                          <span>{job.caregiver_criteria}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-2 flex-wrap">
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {job.district ? `${job.district}, ` : ''}{job.city || 'Kota Surabaya'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Jadwal: {new Date(job.scheduled_start).toLocaleDateString('id-ID')}
                        </span>
                        <span>•</span>
                        <span className="font-extrabold text-blue-700">
                          Estimasi Honor: Rp {job.base_price.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      {isApplied ? (
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Lamaran Terkirim
                          </span>
                          <button
                            onClick={() => handleSimulateCustomerAccept(job.id)}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-gray-950 text-[11px] font-bold rounded-xl shadow-xs"
                            title="Simulasikan Customer Menyetujui Lamaran Anda"
                          >
                            Simulasi ACC Customer ➔
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedJobId(isSelected ? null : job.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isSelected ? 'Tutup Form' : 'Lamar Pekerjaan Ini'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Task Previews for this Job */}
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-[11px] text-gray-500 font-medium">Tugas yang diminta customer:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 mt-1.5">
                      {job.tasks.map((task, idx) => (
                        <div key={idx} className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-[11px] text-gray-700">
                          <span className="font-bold text-emerald-800">{task.scheduled_time}</span>: {task.title}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expandable Application Form */}
                  {isSelected && !isApplied && (
                    <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3 animate-in fade-in">
                      <h4 className="font-bold text-xs text-blue-950 flex items-center gap-1">
                        <Send className="w-3.5 h-3.5 text-blue-600" />
                        <span>Kirimkan Proposal & Penawaran Tarif:</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Tarif Penawaran (Rp/Jam):</label>
                          <input
                            type="number"
                            step={5000}
                            value={proposedRate}
                            onChange={(e) => setProposedRate(Number(e.target.value))}
                            className="w-full p-2 rounded-lg border border-gray-300 bg-white font-bold text-blue-900"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-bold text-gray-700 mb-1">Catatan Proposal untuk Customer:</label>
                          <input
                            type="text"
                            value={proposalNote}
                            onChange={(e) => setProposalNote(e.target.value)}
                            className="w-full p-2 rounded-lg border border-gray-300 bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedJobId(null)}
                          className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-200 rounded-lg"
                        >
                          Batal
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApply(job.id)}
                          className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                        >
                          Kirim Proposal Lamaran
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PROFIL, EDIT PROFIL, RATING & BADGE */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Col: Badges & Rating */}
          <div className="space-y-4">
            
            {/* Rating Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Rating & Reputasi</h3>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-extrabold text-amber-500">4.95</div>
                <div>
                  <div className="flex items-center text-amber-400">
                    {'★★★★★'}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">48 Ulasan dari Customer</p>
                </div>
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg">
                ✓ 52 Pesanan Berhasil Diselesaikan di Surabaya
              </p>
            </div>

            {/* Badges Resmi Terverifikasi */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Badge Kompetensi Resmi</h3>
              <div className="flex flex-col gap-2">
                {[
                  { title: 'Perawat Terverifikasi', desc: 'S1 Ners Keperawatan UNAIR', icon: Award },
                  { title: 'SKCK Polda Jatim Verified', desc: 'Bebas catatan kriminal kepolisian', icon: ShieldCheck },
                  { title: 'Elderly Care Specialist', desc: 'Pendampingan lansia & stroke', icon: HeartHandshake },
                  { title: 'First Aid Bersertifikat', desc: 'Pertolongan pertama medis', icon: CheckCircle2 },
                ].map((b, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
                    <b.icon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs text-gray-900">{b.title}</h5>
                      <p className="text-[10px] text-gray-500">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Col: Edit Profile Form */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-base text-gray-900">Informasi & Pengaturan Profil Pengasuh</h3>
                <p className="text-xs text-gray-500">Data ini ditampilkan kepada customer saat memilih kandidat.</p>
              </div>

              {!isEditingProfile ? (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profil</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-sm transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              )}
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nama Lengkap:</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.full_name}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Pendidikan & Almamater:</label>
                  <input
                    type="text"
                    disabled={!isEditingProfile}
                    value={editEducation}
                    onChange={(e) => setEditEducation(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border ${isEditingProfile ? 'border-blue-400 bg-white' : 'border-gray-200 bg-gray-50'}`}
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tarif Layanan Dasar (Rp/Jam):</label>
                  <input
                    type="number"
                    step={5000}
                    disabled={!isEditingProfile}
                    value={editRate}
                    onChange={(e) => setEditRate(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-xl border font-bold text-blue-900 ${isEditingProfile ? 'border-blue-400 bg-white' : 'border-gray-200 bg-gray-50'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Wilayah Layanan di Surabaya:</label>
                <input
                  type="text"
                  disabled={!isEditingProfile}
                  value={editDistrict}
                  onChange={(e) => setEditDistrict(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border ${isEditingProfile ? 'border-blue-400 bg-white' : 'border-gray-200 bg-gray-50'}`}
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Bio & Ringkasan Pengalaman:</label>
                <textarea
                  rows={4}
                  disabled={!isEditingProfile}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border ${isEditingProfile ? 'border-blue-400 bg-white' : 'border-gray-200 bg-gray-50'}`}
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editAvailable}
                    onChange={(e) => setEditAvailable(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-bold text-gray-800">Status Availability: Siap Menerima Order Baru di Surabaya</span>
                </label>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 4: RIWAYAT PESANAN (HISTORY) */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900">Riwayat Layanan Selesai (Payout Ledger)</h2>
          <div className="divide-y divide-gray-100 text-xs">
            {[
              { id: 'h-01', num: 'CN-SBY-2026-0812', name: 'Eyang Broto (Gubeng)', date: '25 Sep 2026', total: 250000, status: 'Dana Telah Dicairkan ke Rekening BCA' },
              { id: 'h-02', num: 'CN-SBY-2026-0801', name: 'Balita Kenzo (Rungkut)', date: '21 Sep 2026', total: 180000, status: 'Dana Telah Dicairkan ke Rekening BCA' },
              { id: 'h-03', num: 'CN-SBY-2026-0780', name: 'Pendampingan Fisioterapi (Darmo)', date: '15 Sep 2026', total: 320000, status: 'Dana Telah Dicairkan ke Rekening BCA' },
            ].map(item => (
              <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-gray-900">#{item.num}</span> • {item.name}
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.date} • {item.status}</p>
                </div>
                <span className="font-bold text-emerald-700 text-sm">
                  + Rp {item.total.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
