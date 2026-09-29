import React from 'react';
import { CheckCircle2, Clock, ShieldCheck, MapPin, Camera } from 'lucide-react';
import { EscrowStatus } from '@/lib/types';

interface ProgressBarProps {
  percentage: number;
  totalTasks: number;
  completedTasks: number;
  escrowStatus: EscrowStatus;
  orderStatus: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  totalTasks,
  completedTasks,
  escrowStatus,
  orderStatus,
}) => {
  // Determine milestone stages
  const step1Done = true; // Confirmed & Escrow held
  const step2Done = percentage > 0 || orderStatus === 'in_progress' || orderStatus === 'completed';
  const step3Done = percentage >= 50;
  const step4Done = percentage === 100 && escrowStatus === 'released';

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">Progres Layanan Pengasuhan</span>
            <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full">
              {percentage}% Selesai
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {completedTasks} dari {totalTasks} tugas telah dikerjakan & diverifikasi foto GPS
          </p>
        </div>

        {/* Escrow Status Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border bg-amber-50 text-amber-800 border-amber-200">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>
            {escrowStatus === 'held' && 'Dana Tertahan di Escrow (Aman)'}
            {escrowStatus === 'released' && 'Dana Berhasil Dicairkan ke Pengasuh'}
            {escrowStatus === 'pending' && 'Menunggu Pembayaran'}
          </span>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="relative w-full h-3.5 bg-gray-100 rounded-full overflow-hidden p-0.5">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 rounded-full transition-all duration-700 ease-out shadow-sm"
          style={{ width: `${Math.max(5, Math.min(100, percentage))}%` }}
        />
      </div>

      {/* Gojek/Shopee 4-Step Tracker */}
      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-50 text-center">
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-sm mb-1">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-gray-800">Booking H-1</span>
          <span className="text-[10px] text-gray-400">Escrow Aktif</span>
        </div>

        <div className="flex flex-col items-center">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-sm mb-1 ${step2Done ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-semibold text-gray-800">GPS Surabaya</span>
          <span className="text-[10px] text-gray-400">{step2Done ? 'Terverifikasi' : 'Menunggu'}</span>
        </div>

        <div className="flex flex-col items-center">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-sm mb-1 ${step3Done ? 'bg-emerald-500 text-white' : percentage > 0 ? 'bg-teal-500 text-white animate-pulse' : 'bg-gray-200 text-gray-500'}`}>
            <Camera className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-semibold text-gray-800">Bukti Foto</span>
          <span className="text-[10px] text-gray-400">{completedTasks}/{totalTasks} Task</span>
        </div>

        <div className="flex flex-col items-center">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-sm mb-1 ${step4Done ? 'bg-emerald-600 text-white' : percentage === 100 ? 'bg-amber-500 text-white animate-bounce' : 'bg-gray-200 text-gray-500'}`}>
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-semibold text-gray-800">Selesai & Review</span>
          <span className="text-[10px] text-gray-400">{step4Done ? 'Cair' : percentage === 100 ? 'Konfirmasi' : 'Tahap Akhir'}</span>
        </div>
      </div>
    </div>
  );
};
