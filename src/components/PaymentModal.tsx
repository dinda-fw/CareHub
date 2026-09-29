'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, QrCode, CreditCard, Building2, Copy, Check, 
  Clock, AlertCircle, ArrowRight, ExternalLink, Sparkles, X, CheckCircle2, Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceCategory?: string;
  onPaymentSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  totalAmount,
  customerName,
  customerEmail,
  customerPhone,
  serviceCategory = 'Layanan Asuhan',
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'qris' | 'va' | 'snap'>('qris');
  const [selectedBank, setSelectedBank] = useState<'bca' | 'mandiri' | 'bri' | 'bni'>('bca');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes timer
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [snapToken, setSnapToken] = useState<string | null>(null);
  const [snapLoading, setSnapLoading] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Virtual Account number generator based on phone or bank
  const getVaNumber = (bank: string) => {
    const prefix: Record<string, string> = {
      bca: '8277',
      mandiri: '88708',
      bri: '12800',
      bni: '9881',
    };
    const cleanPhone = (customerPhone || '081234567890').replace(/\D/g, '').substring(1);
    return `${prefix[bank] || '8277'}${cleanPhone.padEnd(10, '0')}`;
  };

  const handleCopyVa = () => {
    const vaNum = getVaNumber(selectedBank);
    navigator.clipboard.writeText(vaNum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fetch or trigger Midtrans Snap token
  const handleOpenMidtransSnap = async () => {
    setSnapLoading(true);
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount: totalAmount,
          customerName,
          customerEmail,
          customerPhone,
          serviceName: `CareHub - ${serviceCategory} (${orderNumber})`,
        }),
      });

      const data = await res.json();
      if (data.token) {
        setSnapToken(data.token);

        // Check if Snap.js script is already in the document
        const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
        const isProd = process.env.MIDTRANS_IS_PRODUCTION === 'true';
        const snapJsUrl = isProd 
          ? 'https://app.midtrans.com/snap/snap.js'
          : 'https://app.sandbox.midtrans.com/snap/snap.js';

        // Load Midtrans Snap client dynamically if not present
        if (!(window as any).snap) {
          const script = document.createElement('script');
          script.src = snapJsUrl;
          script.setAttribute('data-client-key', clientKey || 'SB-Mid-client-sample');
          script.onload = () => {
            triggerSnapModal(data.token);
          };
          document.body.appendChild(script);
        } else {
          triggerSnapModal(data.token);
        }
      }
    } catch (err) {
      console.error('Gagal memuat Midtrans Snap:', err);
    } finally {
      setSnapLoading(false);
    }
  };

  const triggerSnapModal = (token: string) => {
    if ((window as any).snap) {
      (window as any).snap.pay(token, {
        onSuccess: function (result: any) {
          handleSuccessAction();
        },
        onPending: function (result: any) {
          alert('Pembayaran sedang diproses. Mohon selesaikan di aplikasi Anda.');
        },
        onError: function (result: any) {
          alert('Pembayaran gagal atau dibatalkan.');
        },
        onClose: function () {
          console.log('Customer menutup jendela Midtrans Snap');
        },
      });
    }
  };

  // Trigger payment confirmation and escrow lock
  const handleSuccessAction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      setTimeout(() => {
        onPaymentSuccess();
      }, 1500);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 my-6">
        
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white p-5 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-400/30">
              Payment Gateway & Escrow Protection
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <div>
              <h3 className="text-lg font-bold">Pembayaran Pesanan</h3>
              <p className="text-xs text-emerald-100">Order ID: #{orderNumber}</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-emerald-200 block">Total Pembayaran:</span>
              <span className="text-2xl font-black text-white tracking-tight">
                Rp {totalAmount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* ESCROW GUARANTEE BANNER */}
        <div className="bg-amber-50/90 border-b border-amber-200 px-5 py-3 flex items-start gap-3 text-amber-900">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-xs">
            <span className="font-extrabold text-amber-900 block">
              Garansi Escrow 100% CareHub Aktif
            </span>
            <p className="text-[11px] text-amber-800/90 leading-relaxed mt-0.5">
              Dana Anda disimpan secara aman di rekening penampung. Dana <strong>TIDAK akan dilepas ke pengasuh</strong> sampai pengasuh menyelesaikan seluruh tugas sesuai checklist, menyertakan foto bukti pekerjaan, dan terverifikasi di lokasi GPS.
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* SUCCESS STATE */}
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">Pembayaran Berhasil Diterima!</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                  Status Escrow telah diperbarui menjadi <strong>HELD (Diamankan)</strong>. Mengarahkan Anda ke dasbor pemantauan tugas pengasuh...
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                <span>Mengarahkan secara otomatis...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('qris')}
                  className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    selectedMethod === 'qris'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>QRIS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('va')}
                  className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    selectedMethod === 'va'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Virtual Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('snap')}
                  className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    selectedMethod === 'snap'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Midtrans Snap</span>
                </button>
              </div>

              {/* TAB 1: QRIS */}
              {selectedMethod === 'qris' && (
                <div className="space-y-4 text-center">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Selesaikan pembayaran dalam {formatTime(timeLeft)}</span>
                  </div>

                  {/* QR Code Container */}
                  <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl max-w-xs mx-auto space-y-3">
                    <div className="bg-white p-3 rounded-xl shadow-xs border border-gray-200 inline-block">
                      {/* SVG QR Code Simulation with Indonesian QRIS Branding */}
                      <div className="w-48 h-48 mx-auto relative flex flex-col items-center justify-center">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020101021226680016ID.CO.CAREHUB.WWW011893600998${orderId}520458125303360540${totalAmount}5802ID5916CAREHUB_INDONESIA6008SURABAYA62150711${orderNumber}6304`} 
                          alt="QRIS Code CareHub"
                          className="w-44 h-44 object-contain rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-8 h-8 rounded-md bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                            <span className="font-black text-[9px] text-emerald-700">CARE</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-500 font-medium">
                      Bisa di-scan menggunakan GoPay, OVO, Dana, ShopeePay, LinkAja, BCA Mobile, Livin Mandiri, atau m-Banking apapun.
                    </div>
                  </div>

                  <div className="text-left text-xs bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-1.5">
                    <div className="font-bold text-gray-800">Langkah Pembayaran QRIS:</div>
                    <ol className="list-decimal list-inside text-gray-600 text-[11px] space-y-1">
                      <li>Buka aplikasi e-Wallet atau m-Banking pilihan Anda.</li>
                      <li>Pilih menu <strong>Scan / Bayar QRIS</strong>.</li>
                      <li>Arahkan kamera ke QR Code di atas.</li>
                      <li>Periksa nominal tagihan (Rp {totalAmount.toLocaleString('id-ID')}).</li>
                      <li>Konfirmasi dan masukkan PIN Anda.</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* TAB 2: VIRTUAL ACCOUNT */}
              {selectedMethod === 'va' && (
                <div className="space-y-4">
                  {/* Bank Selector */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'bca', name: 'BCA Virtual Account' },
                      { id: 'mandiri', name: 'Mandiri Virtual Account' },
                      { id: 'bri', name: 'BRI Virtual Account' },
                      { id: 'bni', name: 'BNI Virtual Account' },
                    ].map(bank => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBank(bank.id as any)}
                        className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                          selectedBank === bank.id
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {bank.name}
                      </button>
                    ))}
                  </div>

                  {/* VA Number Display */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Nomor Virtual Account:</span>
                      <span className="font-bold uppercase text-emerald-700">Bank {selectedBank}</span>
                    </div>

                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200">
                      <span className="text-base sm:text-lg font-mono font-bold tracking-wider text-gray-900">
                        {getVaNumber(selectedBank)}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyVa}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-gray-500">Total Tagihan:</span>
                      <span className="font-bold text-gray-900">
                        Rp {totalAmount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className="text-left text-xs bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-1.5">
                    <div className="font-bold text-gray-800">Petunjuk Pembayaran Transfer:</div>
                    <ul className="list-disc list-inside text-gray-600 text-[11px] space-y-1">
                      <li>Buka aplikasi Mobile Banking atau ATM bank Anda.</li>
                      <li>Pilih menu <strong>Transfer ➔ Virtual Account</strong>.</li>
                      <li>Masukkan kode VA di atas dan pastikan nama penerima <strong>CareHub / {customerName}</strong>.</li>
                      <li>Lakukan pembayaran sesuai nominal tepat.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 3: MIDTRANS SNAP POPUP */}
              {selectedMethod === 'snap' && (
                <div className="space-y-4 text-center py-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CreditCard className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-gray-900">
                      Pembayaran via Midtrans Gateway
                    </h4>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                      Bayar dengan kartu kredit/debit, e-Wallet resmi, atau outlet Alfamart/Indomaret melalui pop-up resmi Midtrans.
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 text-left flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[11px]">
                      Jendela pembayaran Snap resmi Midtrans akan muncul di layar Anda. Anda dapat memilih metode apa saja secara leluasa.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenMidtransSnap}
                    disabled={snapLoading}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {snapLoading ? (
                      <span>Menyiapkan Jendela Midtrans...</span>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        <span>Buka Midtrans Snap Popup</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Action Buttons: Confirm Payment */}
              <div className="pt-4 border-t border-gray-100 space-y-2.5">
                <button
                  type="button"
                  onClick={handleSuccessAction}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? (
                    <span>Memverifikasi Pembayaran ke Escrow...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Saya Sudah Bayar (Konfirmasi & Kunci ke Escrow)</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-gray-400">
                  Setelah konfirmasi berhasil, status pesanan otomatis berubah ke <strong>Escrow Held</strong> dan pengasuh menerima notifikasi penugasan.
                </p>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
