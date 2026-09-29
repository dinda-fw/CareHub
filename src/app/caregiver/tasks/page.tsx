'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Camera, MapPin, ShieldCheck, AlertTriangle, ArrowLeft, 
  CheckCircle2, Clock, Eye, Sparkles, Navigation, UserCheck 
} from 'lucide-react';
import { useCareNest } from '@/lib/CareNestContext';
import { ProgressBar } from '@/components/ProgressBar';
import { TaskChecklist } from '@/components/TaskChecklist';

export default function CaregiverTasksPage() {
  const router = useRouter();
  const { 
    currentUser, orders, gpsActive, setGpsActive, currentGpsCoords, switchRole 
  } = useCareNest();

  const activeOrder = orders.find(o => o.order_status === 'in_progress' || o.order_status === 'confirmed') || orders[0];

  const completedTasks = activeOrder.tasks.filter(t => t.status === 'completed').length;
  const isAllTasksCompleted = completedTasks === activeOrder.tasks.length && activeOrder.tasks.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            href="/caregiver"
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Pengerjaan Task & Verifikasi Bukti</h1>
            <p className="text-xs text-gray-500">
              Order #{activeOrder.order_number} • {activeOrder.recipient_name}
            </p>
          </div>
        </div>

        {/* Quick Switch to Customer View */}
        <button
          onClick={() => {
            switchRole('customer');
            router.push(`/customer/order/${activeOrder.id}`);
          }}
          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Eye className="w-4 h-4" />
          <span>Lihat Pantauan Customer (Live Escrow)</span>
        </button>
      </div>

      {/* 1. GPS ENFORCEMENT & GUARDRAIL ALERT (Strict PRD rule) */}
      <div className={`p-5 rounded-2xl border transition-all ${gpsActive ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-red-600 text-white border-red-700 shadow-lg animate-pulse'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${gpsActive ? 'bg-emerald-600 text-white' : 'bg-white text-red-600'}`}>
              {gpsActive ? <Navigation className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">
                  {gpsActive ? 'GPS AKTIF: Terverifikasi di Lokasi Surabaya' : 'PERINGATAN: GPS NON-AKTIF (PENGERJAAN DIJEDA)'}
                </h3>
                <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${gpsActive ? 'bg-emerald-200 text-emerald-900' : 'bg-red-800 text-white'}`}>
                  {gpsActive ? 'GPS Valid' : 'Wajib Aktif'}
                </span>
              </div>
              <p className={`text-xs mt-1 ${gpsActive ? 'text-emerald-800' : 'text-red-100 font-medium'}`}>
                {gpsActive 
                  ? `Snapshot Lokasi: ${currentGpsCoords.address} (Koordinat: ${currentGpsCoords.lat.toFixed(4)}, ${currentGpsCoords.lng.toFixed(4)})` 
                  : 'Sesuai aturan keamanan CareNest (BR-04), pengasuh dilarang mematikan GPS saat mengerjakan order di Surabaya untuk mencegah kabur dan manipulasi.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setGpsActive(!gpsActive)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${gpsActive ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100' : 'bg-white text-red-700 hover:bg-gray-100 shadow-md'}`}
          >
            {gpsActive ? 'Simulasi Matikan GPS' : 'Nyalakan Izin GPS Sekarang'}
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC PROGRESS BAR */}
      <ProgressBar
        percentage={activeOrder.progress_percentage}
        totalTasks={activeOrder.tasks.length}
        completedTasks={completedTasks}
        escrowStatus={activeOrder.escrow_status}
        orderStatus={activeOrder.order_status}
      />

      {/* 3. ORDER CONTEXT INFO */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <span className="text-gray-400 block text-[10px] uppercase font-bold">Penerima Asuhan</span>
          <span className="font-bold text-gray-900 text-sm block mt-0.5">{activeOrder.recipient_name}</span>
          <span className="text-gray-500 text-[11px]">{activeOrder.recipient_details}</span>
        </div>

        <div>
          <span className="text-gray-400 block text-[10px] uppercase font-bold">Alamat Layanan (Surabaya)</span>
          <span className="font-semibold text-gray-900 text-xs block mt-0.5">{activeOrder.service_address}</span>
          <span className="text-emerald-700 font-medium text-[11px]">Radius: &lt; 10 meter terverifikasi</span>
        </div>

        <div>
          <span className="text-gray-400 block text-[10px] uppercase font-bold">Imbalan Payout Escrow</span>
          <span className="font-extrabold text-emerald-700 text-sm block mt-0.5">
            Rp {(activeOrder.base_price - activeOrder.discount_amount).toLocaleString('id-ID')}
          </span>
          <span className="text-gray-500 text-[11px]">Cair otomatis begitu customer konfirmasi</span>
        </div>
      </div>

      {/* 4. TASK CHECKLIST FOR CAREGIVER EXECUTION */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-sm text-gray-900">Tugas yang Harus Dikerjakan & Dilaporkan</h3>
            <p className="text-xs text-gray-500">
              Klik tombol "Lapor Selesai" untuk mengunggah foto bukti beserta koordinat GPS Surabaya.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            {completedTasks} / {activeOrder.tasks.length} Selesai
          </span>
        </div>

        <TaskChecklist
          orderId={activeOrder.id}
          tasks={activeOrder.tasks}
          isCaregiverView={true}
        />
      </div>

      {/* 5. ALL TASKS COMPLETED CALLOUT */}
      {isAllTasksCompleted && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-xl space-y-3 animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Kerja Bagus! Seluruh Tugas Selesai Dilaporkan</h3>
              <p className="text-xs text-emerald-100">
                Semua foto bukti dan verifikasi GPS di Surabaya telah diterima. Customer Budi Santoso akan menerima notifikasi untuk konfirmasi & pencairan dana escrow.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-500/50">
            <span className="text-xs text-emerald-200">
              Status Escrow:{' '}
              <strong className="text-white uppercase">{activeOrder.escrow_status === 'released' ? 'Telah Dicairkan' : 'Tertahan Aman (Siap Cair)'}</strong>
            </span>

            <button
              onClick={() => {
                switchRole('customer');
                router.push(`/customer/order/${activeOrder.id}`);
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Ganti Akun ke Customer untuk Lepas Dana Escrow →</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
