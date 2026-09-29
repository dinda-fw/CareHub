'use client';

import React from 'react';
import { Facility } from '@/lib/types';
import { MapPin, Star, ShieldCheck, Check, Sparkles, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FacilityCardProps {
  facility: Facility;
  distanceKm?: number;
  onSelect?: (facility: Facility) => void;
  selected?: boolean;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  facility,
  distanceKm = 2.4,
  onSelect,
  selected = false,
}) => {
  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between ${selected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-200'}`}>
      
      {/* Photo & Badges */}
      <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
        <img
          src={facility.photos[0] || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600'}
          alt={facility.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/90 text-gray-800 backdrop-blur-xs shadow-xs">
            {facility.category_label}
          </span>
          {facility.is_verified && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
              <ShieldCheck className="w-3 h-3" /> Mitra Terverifikasi
            </span>
          )}
        </div>

        <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{facility.rating.toFixed(2)}</span>
          <span className="text-gray-300">({facility.review_count})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base text-gray-900 line-clamp-1">{facility.name}</h3>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded text-[11px]">
              {distanceKm} km dari lokasi Anda
            </span>
            <span>• {facility.district}, Surabaya</span>
          </div>

          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{facility.address}</p>

          {/* Amenities Pills */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            {facility.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-100"
              >
                ✓ {amenity}
              </span>
            ))}
            {facility.amenities.length > 3 && (
              <span className="text-[10px] text-gray-400">+{facility.amenities.length - 3} lainnya</span>
            )}
          </div>
        </div>

        {/* Pricing & Booking Action */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-gray-500">Mulai dari:</div>
            <div className="text-base font-bold text-emerald-700">
              Rp {facility.daily_rate.toLocaleString('id-ID')}
              <span className="text-[11px] font-normal text-gray-500">/hari</span>
            </div>
            <div className="text-[10px] font-semibold text-amber-700">
              Sisa {facility.slots_available} slot hari ini
            </div>
          </div>

          {onSelect ? (
            <button
              type="button"
              onClick={() => onSelect(facility)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${selected ? 'bg-emerald-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
            >
              {selected ? 'Terpilih ✓' : 'Pilih Mitra'}
            </button>
          ) : (
            <Link
              href={`/customer/booking?facilityId=${facility.id}`}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm flex items-center gap-1"
            >
              <span>Booking H-1</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

      </div>

    </div>
  );
};
