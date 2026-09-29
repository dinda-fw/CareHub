'use client';

import React from 'react';
import { CaregiverProfile } from '@/lib/types';
import { Star, ShieldCheck, MapPin, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CaregiverCardProps {
  caregiver: CaregiverProfile;
  distanceKm?: number;
  onSelect?: (caregiver: CaregiverProfile) => void;
  selected?: boolean;
}

export const CaregiverCard: React.FC<CaregiverCardProps> = ({
  caregiver,
  distanceKm = 1.9,
  onSelect,
  selected = false,
}) => {
  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 p-5 shadow-sm hover:shadow-md flex flex-col justify-between ${selected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-200'}`}>
      
      <div>
        {/* Top Header: Avatar, Name, Rating */}
        <div className="flex items-start gap-3.5">
          <div className="relative">
            <img
              src={caregiver.avatar_url}
              alt={caregiver.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-sm"
            />
            {caregiver.is_available && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Siap Menerima Order" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-base text-gray-900 truncate">{caregiver.name}</h3>
              {caregiver.verified_skck && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded flex items-center gap-0.5" title="SKCK Polda Jatim Terverifikasi">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> SKCK Verified
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600 font-medium mt-0.5 line-clamp-1">{caregiver.education}</p>

            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-bold text-gray-800">{caregiver.rating.toFixed(2)}</span>
                <span className="text-gray-400">({caregiver.total_reviews})</span>
              </div>
              <span>•</span>
              <span className="text-emerald-700 font-medium">{caregiver.total_orders_completed} order selesai</span>
            </div>
          </div>
        </div>

        {/* Location & Bio */}
        <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded text-[11px]">
            {distanceKm} km dari lokasi Anda
          </span>
          <span>• {caregiver.district}, Surabaya</span>
        </div>

        <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
          {caregiver.bio}
        </p>

        {/* Badges / Competencies */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {caregiver.badges.map((badge, idx) => (
            <span
              key={idx}
              className="text-[10px] font-semibold bg-gray-50 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200 flex items-center gap-1"
            >
              <Award className="w-2.5 h-2.5 text-emerald-600" /> {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Rate & Selection Footer */}
      <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-gray-400 block">Tarif Layanan:</span>
          <span className="text-base font-bold text-emerald-700">
            Rp {caregiver.hourly_rate.toLocaleString('id-ID')}
            <span className="text-xs font-normal text-gray-500">/jam</span>
          </span>
        </div>

        {onSelect ? (
          <button
            type="button"
            onClick={() => onSelect(caregiver)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${selected ? 'bg-emerald-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
          >
            {selected ? 'Terpilih ✓' : 'Pilih Pengasuh'}
          </button>
        ) : (
          <Link
            href={`/customer/booking?caregiverId=${caregiver.id}`}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm flex items-center gap-1"
          >
            <span>Pesan H-1</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

    </div>
  );
};
