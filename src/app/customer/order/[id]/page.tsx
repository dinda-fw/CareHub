'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ShieldCheck, MapPin, Clock, Camera, CheckCircle2, User, 
  ArrowLeft, Star, HeartHandshake, Eye, Sparkles, AlertTriangle,
  GraduationCap, Briefcase, Award, FileCheck, Phone, Check, RefreshCw, 
  ChevronRight, X, AlertCircle, UserCheck, Lock, DollarSign, Quote
} from 'lucide-react';
import { useCareNest } from '@/lib/CareNestContext';
import { ProgressBar } from '@/components/ProgressBar';
import { TaskChecklist } from '@/components/TaskChecklist';
import { PaymentModal } from '@/components/PaymentModal';
import { JobBid } from '@/lib/types';
import Link from 'next/link';

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { 
    orders, releaseEscrow, addReview, switchRole, updateEscrowStatus,
    bids, acceptJobBid, cancelCaregiverSelection, simulateApplicant, caregivers, currentUser 
  } = useCareNest();

  const orderId = params.id as string;
  const order = orders.find(o => o.id === orderId) || orders[0];

  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('Pelayanan sangat memuaskan, datang tepat waktu dan ramah sekali!');
  const [showReviewSuccess, setShowReviewSuccess] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  // HR Candidate Selection State
  const [selectedCandidateForModal, setSelectedCandidateForModal] = useState<JobBid | null>(null);
  const [candidateFilter, setCandidateFilter] = useState<'all' | 'highest_rating' | 'lowest_rate' | 'medical'>('all');
  const [dealSuccessToast, setDealSuccessToast] = useState<string | null>(null);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Pesanan Tidak Ditemukan</h2>
        <Link href="/" className="text-xs font-semibold text-emerald-600 underline">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // Filter bids for this specific order
  const orderBids = bids.filter(b => b.order_id === order.id);

  // Apply candidate filters
  let filteredBids = [...orderBids];
  if (candidateFilter === 'highest_rating') {
    filteredBids = filteredBids.filter(b => b.caregiver_rating >= 4.9);
  } else if (candidateFilter === 'lowest_rate') {
    filteredBids = filteredBids.sort((a, b) => a.proposed_rate - b.proposed_rate);
  } else if (candidateFilter === 'medical') {
    filteredBids = filteredBids.filter(b => 
      b.education?.toLowerCase().includes('ners') || 
      b.education?.toLowerCase().includes('keperawatan') || 
      b.education?.toLowerCase().includes('fisioterapi') ||
      b.education?.toLowerCase().includes('hewan') ||
      b.badges?.some(bg => bg.toLowerCase().includes('str') || bg.toLowerCase().includes('perawat'))
    );
  }

  const completedTasks = order.tasks.filter(t => t.status === 'completed').length;
  const isAllTasksCompleted = completedTasks === order.tasks.length && order.tasks.length > 0;
  const isEscrowReleased = order.escrow_status === 'released';

  // Handle release escrow
  const handleReleaseEscrow = () => {
    const res = releaseEscrow(order.id);
    if (res.success) {
      alert('Dana sebesar Rp ' + (order.base_price - order.discount_amount).toLocaleString('id-ID') + ' berhasil dicairkan ke dompet pengasuh!');
    }
  };

  // Handle submit review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReview(order.id, reviewRating, reviewComment);
    setShowReviewSuccess(true);
  };

  // Handle dealing with chosen candidate
  const handleSelectCandidate = (bid: JobBid) => {
    const res = acceptJobBid(order.id, bid.id);
    if (res.success) {
      setSelectedCandidateForModal(null);
      setDealSuccessToast(`Deal Berhasil dengan ${bid.caregiver_name}! Silakan lanjutkan ke pembayaran aman (Escrow) untuk mengunci jadwal.`);
      setShowPaymentModal(true);
    }
  };

  // Handle cancel selection & choose another candidate
  const handleCancelSelection = () => {
    if (confirm('Apakah Anda ingin membatalkan pilihan pengasuh ini dan kembali menyeleksi kandidat lain?')) {
      if (cancelCaregiverSelection) {
        cancelCaregiverSelection(order.id);
      }
      setDealSuccessToast(null);
    }
  };

  // Handle add simulated applicant
  const handleSimulateNewApplicant = () => {
    if (simulateApplicant) {
      const res = simulateApplicant(order.id);
      if (res.success && res.bid) {
        alert(`Pelamar baru "${res.bid.caregiver_name}" baru saja mengirimkan lamaran untuk pesanan ini!`);
      }
    }
  };

  // Calculate estimated total based on a bid's proposed rate
  const calculateBidTotal = (proposedRate: number) => {
    const baseSubtotal = proposedRate * order.duration_hours * order.days_count;
    let discountRate = 0;
    if (order.package_type === 'weekly') discountRate = 0.05;
    if (order.package_type === 'monthly') discountRate = 0.15;
    const discountAmount = Math.round(baseSubtotal * discountRate);
    const afterDiscount = baseSubtotal - discountAmount;
    const platformFee = Math.round(afterDiscount * 0.10);
    return afterDiscount + platformFee;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Breadcrumb & Status Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            href="/customer"
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">Pesanan #{order.order_number}</h1>
              
              {/* Contextual Status Badge */}
              {order.order_status === 'awaiting_applicants' ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Tahap Seleksi Pelamar ({orderBids.length} Melamar)</span>
                </span>
              ) : order.order_status === 'completed' ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Selesai
                </span>
              ) : order.escrow_status === 'pending' ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-900 border border-orange-300">
                  Deal Tercapai • Menunggu Bayar Escrow
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  Terkonfirmasi • Dana di Escrow
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Dibuat pada {new Date(order.created_at).toLocaleDateString('id-ID')} • Wilayah {order.district}, Surabaya
            </p>
          </div>
        </div>

        {/* Quick Testing Switcher */}
        <button
          onClick={() => {
            switchRole('caregiver');
            router.push('/caregiver/tasks');
          }}
          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Camera className="w-4 h-4" />
          <span>Ganti ke Pengasuh untuk Upload Foto & GPS</span>
        </button>
      </div>

      {/* Toast Alert for Deal */}
      {dealSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 text-xs flex items-center justify-between gap-3 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{dealSuccessToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setDealSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold text-xs"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 1. DYNAMIC PROGRESS BAR COMPONENT */}
      <ProgressBar
        percentage={order.progress_percentage}
        totalTasks={order.tasks.length}
        completedTasks={completedTasks}
        escrowStatus={order.escrow_status}
        orderStatus={order.order_status}
      />

      {/* ========================================================================= */}
      {/* 2. HR APPLICANT SELECTION HUB (SELEKSI PELAMAR ALA HRD SEBELUM PEMBAYARAN) */}
      {/* ========================================================================= */}
      {order.order_status === 'awaiting_applicants' || (!order.caregiver_id) ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/80 shadow-md space-y-6">
          
          {/* Header Seleksi */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold mb-2">
                <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pusat Seleksi Pengasuh (HR Recruiter View)</span>
              </div>
              <h2 className="text-xl font-extrabold text-gray-900">
                Pilih & Seleksi Mitra Pengasuh untuk {order.recipient_name}
              </h2>
              <p className="text-xs text-gray-600 mt-1 max-w-2xl leading-relaxed">
                Tinjau kandidat yang telah melamar pekerjaan ini. Periksa <strong>latar belakang pendidikan, STR resmi, rekam jejak SKCK Polda Jatim, ulasan pelanggan</strong>, dan penawaran tarif. Bayar hanya setelah Anda sepakat (deal) dengan pengasuh pilihan.
              </p>
            </div>

            {/* Quick Simulate Bid Button for testing */}
            <button
              type="button"
              onClick={handleSimulateNewApplicant}
              className="px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>+ Simulasikan Pelamar Masuk</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-700">Filter Kandidat:</span>
              {[
                { id: 'all', label: `Semua Pelamar (${orderBids.length})` },
                { id: 'highest_rating', label: '⭐ Rating Tertinggi (4.9+)' },
                { id: 'lowest_rate', label: '💰 Tarif Termurah' },
                { id: 'medical', label: '🩺 Tenaga Medis / STR' },
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCandidateFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    candidateFilter === f.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-gray-500 font-medium">
              Menampilkan {filteredBids.length} pengasuh siap tugas di Surabaya
            </span>
          </div>

          {/* Applicants List */}
          {filteredBids.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-gray-50 border border-dashed border-gray-300 space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <h4 className="font-bold text-sm text-gray-800">Belum Ada Pelamar Sesuai Filter</h4>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Silakan ganti filter atau klik tombol "Simulasikan Pelamar Masuk" di kanan atas untuk memicu lamaran pengasuh.
              </p>
              <button
                type="button"
                onClick={() => setCandidateFilter('all')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white"
              >
                Tampilkan Semua Pelamar
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredBids.map(bid => {
                const totalForBid = calculateBidTotal(bid.proposed_rate);
                return (
                  <div
                    key={bid.id}
                    className="p-5 sm:p-6 rounded-2xl border-2 border-gray-200 hover:border-emerald-500 hover:shadow-md bg-white transition-all space-y-4"
                  >
                    {/* Top Row: Avatar, Names, Rating, Badges */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={bid.caregiver_avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200'}
                          alt={bid.caregiver_name}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-sm shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-base text-gray-900">{bid.caregiver_name}</h3>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span>{bid.caregiver_rating.toFixed(2)}</span>
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                            {bid.education && (
                              <span className="flex items-center gap-1 font-semibold text-emerald-800">
                                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{bid.education}</span>
                              </span>
                            )}
                            {bid.experience_years && (
                              <span className="flex items-center gap-1 text-gray-600">
                                <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                                <span>{bid.experience_years} Tahun Pengalaman</span>
                              </span>
                            )}
                          </div>

                          {/* Badges row */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {bid.verified_ktp && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                ✓ KTP Sah Dukcapil
                              </span>
                            )}
                            {bid.verified_skck && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                ✓ SKCK Polda Jatim
                              </span>
                            )}
                            {bid.badges?.slice(0, 2).map((b, i) => (
                              <span key={i} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right side: Proposed Rate & Deal Calculation */}
                      <div className="text-left sm:text-right w-full sm:w-auto p-3 sm:p-0 rounded-xl bg-emerald-50/60 sm:bg-transparent">
                        <span className="text-[11px] text-gray-500 block">Tarif Penawaran Pelamar:</span>
                        <div className="text-lg font-black text-emerald-700">
                          Rp {bid.proposed_rate.toLocaleString('id-ID')} <span className="text-xs font-semibold text-gray-600">/ jam</span>
                        </div>
                        <span className="text-[11px] text-gray-500 block mt-0.5">
                          Total Estimasi: <strong>Rp {totalForBid.toLocaleString('id-ID')}</strong> ({order.duration_hours} jam x {order.days_count} hari)
                        </span>
                      </div>
                    </div>

                    {/* Proposal Note (Surat Lamaran dari Caregiver) */}
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 text-xs space-y-1">
                      <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        <Quote className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Surat Lamaran & Pesan dari Pelamar:</span>
                      </div>
                      <p className="text-gray-700 italic leading-relaxed">
                        "{bid.proposal_note}"
                      </p>
                    </div>

                    {/* Action Buttons: Lihat CV Lengkap vs Pilih / Deal */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setSelectedCandidateForModal(bid)}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FileCheck className="w-4 h-4 text-gray-500" />
                        <span>Lihat Profil & Latar Belakang Lengkap</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectCandidate(bid)}
                        className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <HeartHandshake className="w-4 h-4" />
                        <span>Pilih & Deal dengan Pengasuh Ini</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      ) : order.escrow_status === 'pending' ? (
        /* ========================================================================= */
        /* 2B. DEAL SUDAH DIBUAT DENGAN CAREGIVER TERTENTU - MENUNGGU PEMBAYARAN ESCROW */
        /* ========================================================================= */
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 border-2 border-amber-400 shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-2.5 py-0.5 rounded-full">
                  Deal Berhasil • Menunggu Pembayaran Escrow
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  Anda Telah Memilih Pengasuh: {order.caregiver_name}
                </h3>
                <p className="text-xs text-gray-600">
                  Untuk mengonfirmasi jadwal kedatangan dan memulai persiapan care plan, silakan selesaikan pembayaran ke rekening Escrow CareHub.
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-500">Nominal Escrow di-Hold:</span>
              <div className="text-xl font-black text-emerald-800">
                Rp {order.total_amount.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={order.caregiver_avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
                alt=""
                className="w-12 h-12 rounded-xl object-cover border border-emerald-400"
              />
              <div>
                <h4 className="font-bold text-sm text-gray-900">{order.caregiver_name}</h4>
                <p className="text-gray-500">Kontak: {order.caregiver_phone || '0821-5566-7788'} • Terverifikasi KTP & SKCK</p>
                <p className="text-emerald-700 font-semibold text-[11px]">✓ Dana aman di rekening penampung CareHub (tidak langsung ke pengasuh)</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCancelSelection}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 font-bold text-xs transition-colors"
              >
                Ganti Pengasuh Lain
              </button>

              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-1.5 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Bayar Sekarang (Kunci ke Escrow)</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* 3. LIVE GPS LOCATION & RECIPIENT INFORMATION (SETELAH DEAL & ESCROW HELD) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Details & GPS Map simulation */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Surabaya Location Card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Pemantauan Lokasi Layanan di Surabaya</span>
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                GPS Verified
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1">
              <p className="text-gray-500">Alamat Layanan:</p>
              <p className="font-semibold text-gray-800">{order.service_address}</p>
              <p className="font-mono text-gray-500 text-[11px]">
                Koordinat Presisi: {order.latitude.toFixed(4)}, {order.longitude.toFixed(4)} (Surabaya)
              </p>
            </div>

            {/* Live Radar Banner */}
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-emerald-950 via-teal-900 to-gray-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                    <MapPin className="w-5 h-5 animate-bounce" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">
                    {order.caregiver_name ? `Pengasuh: ${order.caregiver_name}` : 'Menunggu Pilihan Pengasuh'}
                  </h4>
                  <p className="text-[11px] text-emerald-200">
                    {order.escrow_status === 'held' ? 'Pengasuh Siap Hadir Sesuai Jadwal' : 'Pilih pengasuh dan bayar escrow untuk memulai tugas'}
                  </p>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="px-2 py-1 bg-emerald-800/80 rounded-md font-mono text-[10px] text-emerald-300">
                  Radius Aman: &lt; 15 meter
                </span>
              </div>
            </div>
          </div>

          {/* Custom Tasks Checklist with Evidence Viewer */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900">Care Plan & Checklist Tugas Terjadwal</h3>
              <span className="text-xs text-gray-500 font-semibold">{order.tasks.length} Tugas Dikerjakan</span>
            </div>
            <TaskChecklist
              orderId={order.id}
              tasks={order.tasks}
              isCaregiverView={false}
            />
          </div>

          {/* Release Escrow Card when completed */}
          {isAllTasksCompleted && !isEscrowReleased && (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-500 rounded-2xl p-6 shadow-md text-emerald-950 space-y-4 animate-in zoom-in-95">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-base">Semua Tugas Selesai Dikerjakan!</h3>
                  <p className="text-xs text-emerald-800/90 mt-1 leading-relaxed">
                    Pengasuh telah mengunggah semua foto bukti dan diverifikasi via GPS Surabaya. Silakan periksa hasil kerja, lalu konfirmasi untuk mencairkan dana escrow ke dompet pengasuh.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-200">
                <div className="text-xs">
                  <span className="text-emerald-800">Total Pembayaran Aman:</span>{' '}
                  <span className="font-bold text-emerald-950 text-sm">
                    Rp {order.total_amount.toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleReleaseEscrow}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Konfirmasi Selesai & Lepas Dana</span>
                </button>
              </div>
            </div>
          )}

          {/* Rating & Review Section if Escrow is Released */}
          {isEscrowReleased && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Ulasan & Penilaian Pelayanan</span>
              </h3>

              {order.reviewed || showReviewSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                  <p className="font-bold">Terima kasih atas ulasan Anda! ⭐⭐⭐⭐⭐</p>
                  <p className="text-[11px] text-emerald-700 mt-1">"{reviewComment}"</p>
                  <p className="text-[10px] text-gray-400 mt-1">Ulasan tersimpan di profil pengasuh.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <p className="text-xs text-gray-500">
                    Bagaimana pengalaman pendampingan oleh {order.caregiver_name || 'pengasuh'}?
                  </p>
                  
                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-gray-700 ml-2">{reviewRating} dari 5 Bintang</span>
                  </div>

                  <textarea
                    rows={2}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tulis ulasan pengalaman Anda..."
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                  >
                    Kirim Ulasan Resmi
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Right Col: Recipient & Caregiver Profile & Escrow Breakdown */}
        <div className="space-y-6">
          
          {/* Recipient Profile */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Penerima Asuhan</h3>
            <div>
              <h4 className="font-bold text-sm text-gray-900">{order.recipient_name}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{order.recipient_details}</p>
            </div>
            <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-600 space-y-1">
              <p>Paket: <span className="font-semibold text-gray-800 uppercase">{order.package_type} ({order.days_count} Hari)</span></p>
              <p>Durasi: <span className="font-semibold text-gray-800">{order.duration_hours} Jam / Hari</span></p>
              {order.caregiver_criteria && (
                <p>Kriteria Dicari: <span className="font-medium text-emerald-800">{order.caregiver_criteria}</span></p>
              )}
            </div>
          </div>

          {/* Caregiver Profile Card (if selected) */}
          {order.caregiver_name && (
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Pengasuh Terpilih</h3>
                {order.escrow_status === 'pending' && (
                  <button
                    type="button"
                    onClick={handleCancelSelection}
                    className="text-[11px] font-bold text-amber-700 hover:underline"
                  >
                    Ganti
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={order.caregiver_avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border border-emerald-400"
                />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{order.caregiver_name}</h4>
                  <p className="text-xs text-emerald-700 font-medium">SKCK & KTP Terverifikasi</p>
                  <p className="text-[11px] text-gray-400">{order.caregiver_phone || '0821-5566-7788'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment & Escrow Card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Detail Pembayaran & Escrow</h3>
            <div className="text-xs space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Tarif Layanan:</span>
                <span>Rp {order.base_price.toLocaleString('id-ID')}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Diskon Paket:</span>
                  <span>- Rp {order.discount_amount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Biaya Layanan (10%):</span>
                <span>Rp {order.platform_fee.toLocaleString('id-ID')}</span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between font-bold text-sm text-gray-900">
                <span>Total Escrow:</span>
                <span className="text-emerald-700">Rp {order.total_amount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-[11px] text-gray-600 space-y-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Status Escrow:{' '}
                  <strong className={order.escrow_status === 'held' ? 'text-emerald-700 uppercase' : order.escrow_status === 'released' ? 'text-blue-700 uppercase' : 'text-amber-700 uppercase'}>
                    {order.escrow_status === 'held' ? 'Tertahan Aman (Held)' : order.escrow_status === 'released' ? 'Telah Dicairkan (Released)' : 'Menunggu Pembayaran (Pending)'}
                  </strong>
                </span>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                {order.escrow_status === 'held'
                  ? '🛡️ Dana aman di rekening bersama CareHub. Akan diteruskan ke pengasuh setelah seluruh tugas diselesaikan.'
                  : order.escrow_status === 'released'
                  ? '✓ Dana telah dicairkan ke dompet pengasuh.'
                  : '⚠️ Selesaikan pembayaran dengan QRIS atau Virtual Account setelah memilih pengasuh agar pengasuh dapat segera ditugaskan.'}
              </p>
            </div>

            {/* Payment Button for Pending or to re-open Payment Gateway */}
            {order.escrow_status !== 'released' && (
              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                  order.escrow_status === 'pending'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25'
                    : 'bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 border border-gray-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  {order.escrow_status === 'pending'
                    ? 'Bayar Sekarang (Kunci ke Escrow)'
                    : 'Lihat Detail Gateway & Bukti Escrow'}
                </span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL DETAIL RESUME / CV KANDIDAT ALA HRD */}
      {/* ========================================================================= */}
      {selectedCandidateForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-gray-200 shadow-2xl relative my-8">
            
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedCandidateForModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Candidate Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
              <img
                src={selectedCandidateForModal.caregiver_avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200'}
                alt=""
                className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-md shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-black text-gray-900">{selectedCandidateForModal.caregiver_name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{selectedCandidateForModal.caregiver_rating.toFixed(2)} Rating</span>
                  </span>
                </div>
                <p className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>{selectedCandidateForModal.education || 'Tenaga Terlatih CareHub'}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Pengalaman: <strong>{selectedCandidateForModal.experience_years || 3} Tahun</strong> • Wilayah Layanan: Surabaya
                </p>
              </div>
            </div>

            {/* Credentials / HR Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Verifikasi Dokumen Legalitas (HR Checklist)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-800">KTP Kependudukan (Dukcapil)</p>
                    <p className="text-[10px] text-gray-500">Identitas sah bebas orderan fiktif</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-800">SKCK Polda Jatim Aktif</p>
                    <p className="text-[10px] text-gray-500">Catatan kepolisian bersih & terverifikasi</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-800">Sertifikasi & STR Tenaga Kesehatan</p>
                    <p className="text-[10px] text-gray-500">Ijazah & lisensi profesi terverifikasi</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-800">Deklarasi Bebas Rokok & Riwayat Sehat</p>
                    <p className="text-[10px] text-gray-500">Bebas penyakit menular & tes kesehatan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Latar Belakang & Bio */}
            <div className="space-y-2 text-xs">
              <h4 className="font-extrabold uppercase tracking-wider text-gray-400">Latar Belakang & Profil Asuhan</h4>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200">
                {selectedCandidateForModal.bio || 'Pengasuh profesional berdedikasi tinggi dengan rekam jejak pendampingan keluarga yang terpercaya di Surabaya. Memiliki keahlian komunikasi hangat, kesabaran, dan ketepatan waktu dalam menjalankan care plan.'}
              </p>
            </div>

            {/* Surat Lamaran */}
            <div className="space-y-2 text-xs">
              <h4 className="font-extrabold uppercase tracking-wider text-gray-400">Catatan Proposal untuk Permintaan Anda</h4>
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-950 italic leading-relaxed">
                "{selectedCandidateForModal.proposal_note}"
              </div>
            </div>

            {/* Footer Modal: Tarif & CTA Deal */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-gray-500">Tarif Disepakati:</span>
                <div className="text-base font-extrabold text-emerald-800">
                  Rp {selectedCandidateForModal.proposed_rate.toLocaleString('id-ID')} / jam
                  <span className="text-xs font-normal text-gray-500 ml-2">
                    (Total: Rp {calculateBidTotal(selectedCandidateForModal.proposed_rate).toLocaleString('id-ID')})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectCandidate(selectedCandidateForModal)}
                className="px-6 py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Pilih & Deal dengan Pengasuh Ini</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. PAYMENT & ESCROW MODAL (DIBUKA SETELAH MEMILIH CAREGIVER) */}
      {/* ========================================================================= */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          orderId={order.id}
          orderNumber={order.order_number}
          totalAmount={order.total_amount}
          customerName={order.customer_name}
          customerPhone={order.customer_phone}
          serviceCategory={order.service_category}
          onPaymentSuccess={() => {
            updateEscrowStatus(order.id, 'held');
            setShowPaymentModal(false);
            setDealSuccessToast(`Pembayaran Berhasil! Dana Anda resmi di-HOLD di rekening Escrow CareHub. Pengasuh ${order.caregiver_name || 'terpilih'} telah resmi ditugaskan.`);
          }}
        />
      )}

    </div>
  );
}
