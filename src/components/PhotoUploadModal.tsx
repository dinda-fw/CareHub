'use client';

import React, { useState } from 'react';
import { 
  Camera, MapPin, AlertTriangle, Upload, CheckCircle2, X, ShieldAlert, Sparkles 
} from 'lucide-react';
import { useCareNest } from '@/lib/CareNestContext';
import { OrderTask } from '@/lib/types';

interface PhotoUploadModalProps {
  orderId: string;
  task: OrderTask;
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  orderId,
  task,
  isOpen,
  onClose,
}) => {
  const { gpsActive, currentGpsCoords, updateTaskStatus, setGpsActive } = useCareNest();
  
  // Sample realistic evidence photos for instant testing
  const sampleEvidencePhotos = [
    { label: 'Cek Tensi & Obat', url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600' },
    { label: 'Jalan Santai Lansia', url: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600' },
    { label: 'Makan & Belajar Anak', url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600' },
    { label: 'Perawatan Hewan / Pet Care', url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600' },
  ];

  const [selectedPhoto, setSelectedPhoto] = useState<string>(sampleEvidencePhotos[0].url);
  const [customPhotoInput, setCustomPhotoInput] = useState<string>('');
  const [notes, setNotes] = useState<string>('Tugas selesai dikerjakan sesuai arahan care plan.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    setErrorMessage(null);

    // PRD Security guardrail: If GPS is disabled, block task completion!
    if (!gpsActive) {
      setErrorMessage(
        'PERINGATAN SISTEM: GPS Anda tidak aktif! Sesuai aturan CareHub (BR-04), tugas dihentikan/dijeda sampai GPS dinyalakan untuk verifikasi kehadiran pengasuh di lokasi Surabaya.'
      );
      return;
    }

    setIsSubmitting(true);

    const result = updateTaskStatus({
      orderId,
      taskId: task.id,
      status: 'completed',
      photoUrl: customPhotoInput.trim() || selectedPhoto,
      notes: notes.trim(),
      latitude: currentGpsCoords.lat,
      longitude: currentGpsCoords.lng,
      addressSnapshot: currentGpsCoords.address,
    });

    setIsSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setErrorMessage(result.error || 'Gagal menyimpan bukti tugas.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-200" />
            <div>
              <h3 className="font-bold text-base">Upload Bukti Tugas & Verifikasi GPS</h3>
              <p className="text-xs text-emerald-100">{task.title}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* GPS Status Box - Strict Guardrail */}
          <div className={`p-4 rounded-xl border transition-all ${gpsActive ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-300 text-red-900'}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <MapPin className={`w-5 h-5 mt-0.5 shrink-0 ${gpsActive ? 'text-emerald-600' : 'text-red-600'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {gpsActive ? 'GPS Terverifikasi Aktif di Surabaya' : 'GPS NON-AKTIF (TASK DIJEDA)'}
                    </span>
                    {gpsActive && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-200 text-emerald-900 rounded">
                        Live Tracking
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-1 font-mono text-gray-700">
                    {currentGpsCoords.address}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Koordinat: {currentGpsCoords.lat.toFixed(5)}, {currentGpsCoords.lng.toFixed(5)}
                  </p>
                </div>
              </div>

              {/* Toggle GPS to test the safety guardrail */}
              <button
                type="button"
                onClick={() => setGpsActive(!gpsActive)}
                className={`text-[11px] font-semibold px-2 py-1 rounded border cursor-pointer ${gpsActive ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100' : 'bg-red-600 text-white border-red-700 hover:bg-red-700'}`}
              >
                {gpsActive ? 'Simulasi Matikan GPS' : 'Nyalakan GPS'}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 text-xs text-red-700">
              <ShieldAlert className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          {/* Photo Preview & Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Pilih Foto Bukti Pekerjaan (Kamera / File / Preset):
            </label>

            {/* Current photo preview with GPS Watermark */}
            <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-video bg-gray-900 flex items-center justify-center group mb-3">
              <img
                src={customPhotoInput.trim() || selectedPhoto}
                alt="Bukti Pekerjaan"
                className="w-full h-full object-cover"
              />
              {/* Overlay GPS Watermark */}
              <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-sm rounded-lg p-2 text-white text-[11px] flex items-center justify-between">
                <div>
                  <p className="font-semibold flex items-center gap-1 text-emerald-400">
                    <MapPin className="w-3 h-3" /> CareHub GPS Verification (Surabaya)
                  </p>
                  <p className="text-[10px] text-gray-300 font-mono">
                    Lat: {currentGpsCoords.lat.toFixed(4)} | Lng: {currentGpsCoords.lng.toFixed(4)}
                  </p>
                </div>
                <div className="text-right text-[10px] text-gray-300">
                  <p>{new Date().toLocaleDateString('id-ID')}</p>
                  <p className="text-emerald-400 font-bold">{new Date().toLocaleTimeString('id-ID')}</p>
                </div>
              </div>
            </div>

            {/* Quick Presets for Easy 1-Click Testing */}
            <p className="text-[11px] font-medium text-gray-500 mb-1">Preset Foto Bukti Sesuai Tugas:</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {sampleEvidencePhotos.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { setSelectedPhoto(preset.url); setCustomPhotoInput(''); }}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-all ${selectedPhoto === preset.url && !customPhotoInput ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <img src={preset.url} alt="" className="w-8 h-8 rounded object-cover" />
                  <span className="truncate">{preset.label}</span>
                </button>
              ))}
            </div>

            {/* File Upload & URL option */}
            <div className="flex items-center gap-2">
              <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-xl hover:bg-gray-50 text-xs text-gray-700 font-medium">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Unggah Foto dari HP / PC</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Catatan Pengerjaan / Kondisi Penerima Asuhan:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Eyang Broto sudah makan sup habis 1 porsi, tensi 124/82 mmHg normal..."
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

        </div>

        {/* Modal Actions */}
        <div className="bg-gray-50 px-6 py-3.5 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !gpsActive}
            className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all ${!gpsActive ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'}`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Memproses...' : 'Kirim Bukti & Tandai Selesai'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
