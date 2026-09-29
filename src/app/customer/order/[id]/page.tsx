'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ShieldCheck, MapPin, Clock, Camera, CheckCircle2, User, 
  ArrowLeft, Star, HeartHandshake, Eye, Sparkles, AlertTriangle 
} from 'lucide-react';
import { useCareNest } from '@/lib/CareNestContext';
import { ProgressBar } from '@/components/ProgressBar';
import { TaskChecklist } from '@/components/TaskChecklist';
import { PaymentModal } from '@/components/PaymentModal';
import Link from 'next/link';

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { orders, releaseEscrow, addReview, switchRole, updateEscrowStatus } = useCareNest();

  const orderId = params.id as string;
  const order = orders.find(o => o.id === orderId) || orders[0];

  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('Pelayanan sangat memuaskan, datang tepat waktu dan ramah sekali!');
  const [showReviewSuccess, setShowReviewSuccess] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

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

  const completedTasks = order.tasks.filter(t => t.status === 'completed').length;
  const isAllTasksCompleted = completedTasks === order.tasks.length && order.tasks.length > 0;
  const isEscrowReleased = order.escrow_status === 'released';

  const handleReleaseEscrow = () => {
    const res = releaseEscrow(order.id);
    if (res.success) {
      alert('Dana sebesar Rp ' + (order.base_price - order.discount_amount).toLocaleString('id-ID') + ' berhasil dicairkan ke dompet pengasuh!');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReview(order.id, reviewRating, reviewComment);
    setShowReviewSuccess(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Breadcrumb & Actions */}
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
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${order.order_status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                {order.order_status === 'completed' ? 'Selesai' : 'Sedang Berjalan'}
              </span>
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

      {/* 1. DYNAMIC PROGRESS BAR COMPONENT */}
      <ProgressBar
        percentage={order.progress_percentage}
        totalTasks={order.tasks.length}
        completedTasks={completedTasks}
        escrowStatus={order.escrow_status}
        orderStatus={order.order_status}
      />

      {/* 2. LIVE GPS LOCATION & RECIPIENT INFORMATION */}
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

            {/* Simulated Live Radar Banner */}
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-emerald-950 via-teal-900 to-gray-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                    <MapPin className="w-5 h-5 animate-bounce" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">Pengasuh Terdeteksi di Lokasi</h4>
                  <p className="text-[11px] text-emerald-200">
                    {order.caregiver_name || 'Mitra Fasilitas'} • GPS Aktif Sesuai PRD
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
            </div>
          </div>

          {/* Caregiver Profile */}
          {order.caregiver_name && (
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Pengasuh Terpilih</h3>
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
                  : '⚠️ Selesaikan pembayaran dengan QRIS atau Virtual Account agar pengasuh dapat segera ditugaskan.'}
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
                    ? 'Bayar Sekarang (QRIS / VA / Midtrans)'
                    : 'Lihat Detail Gateway & Bukti Escrow'}
                </span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* PAYMENT & ESCROW MODAL */}
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
          }}
        />
      )}

    </div>
  );
}
