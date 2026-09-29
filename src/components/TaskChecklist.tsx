'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, Clock, Camera, MapPin, AlertCircle, Eye, ChevronRight 
} from 'lucide-react';
import { OrderTask } from '@/lib/types';
import { PhotoUploadModal } from './PhotoUploadModal';
import { useCareNest } from '@/lib/CareNestContext';

interface TaskChecklistProps {
  orderId: string;
  tasks: OrderTask[];
  isCaregiverView?: boolean;
}

export const TaskChecklist: React.FC<TaskChecklistProps> = ({
  orderId,
  tasks,
  isCaregiverView = false,
}) => {
  const { currentUser } = useCareNest();
  const [activeUploadTask, setActiveUploadTask] = useState<OrderTask | null>(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);

  const canExecute = isCaregiverView || currentUser?.role === 'caregiver';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>Daftar Custom Care Tasks ({tasks.length})</span>
        </h4>
        <span className="text-xs text-gray-500">
          Wajib foto & verifikasi GPS di Surabaya
        </span>
      </div>

      <div className="space-y-2.5">
        {tasks.map((task, idx) => {
          const isDone = task.status === 'completed';
          const isInProgress = task.status === 'in_progress';

          return (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all ${isDone ? 'bg-emerald-50/40 border-emerald-200' : isInProgress ? 'bg-blue-50/40 border-blue-200' : 'bg-white border-gray-200'}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  {/* Status Indicator Icon */}
                  <div className="mt-0.5">
                    {isDone ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : isInProgress ? (
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center animate-pulse">
                        <Clock className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-gray-900">{task.title}</span>
                      <span className="px-2 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-700 rounded-full">
                        {task.scheduled_time}
                      </span>
                      {task.is_required_photo && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded flex items-center gap-0.5">
                          <Camera className="w-3 h-3" /> Wajib Foto
                        </span>
                      )}
                      {task.is_required_gps && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-teal-100 text-teal-800 rounded flex items-center gap-0.5">
                          <MapPin className="w-3 h-3" /> GPS Surabaya
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                    )}
                  </div>
                </div>

                {/* Right Side: Action Button or Evidence View */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {isDone && task.evidence && (
                    <button
                      type="button"
                      onClick={() => setPreviewPhotoUrl(task.evidence!.photo_url)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-medium hover:bg-emerald-50 transition-colors shadow-xs"
                    >
                      <img
                        src={task.evidence.photo_url}
                        alt="Bukti"
                        className="w-5 h-5 rounded object-cover"
                      />
                      <span>Lihat Bukti Foto</span>
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    </button>
                  )}

                  {!isDone && canExecute && (
                    <button
                      type="button"
                      onClick={() => setActiveUploadTask(task)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isInProgress ? 'Lapor Selesai (Foto+GPS)' : 'Mulai & Upload'}</span>
                    </button>
                  )}

                  {!isDone && !canExecute && (
                    <span className="px-2.5 py-1 text-xs text-gray-500 bg-gray-100 rounded-md">
                      {isInProgress ? 'Sedang Dikerjakan' : 'Belum Mulai'}
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded Evidence Details if Completed */}
              {isDone && task.evidence && (
                <div className="mt-3 pt-2.5 border-t border-emerald-100/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-600 gap-2">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-mono">{task.evidence.addressSnapshot}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 italic">
                    "{task.evidence.notes}"
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      {activeUploadTask && (
        <PhotoUploadModal
          orderId={orderId}
          task={activeUploadTask}
          isOpen={true}
          onClose={() => setActiveUploadTask(null)}
        />
      )}

      {/* Image Preview Modal */}
      {previewPhotoUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-3 bg-gray-900 text-white flex justify-between items-center text-xs">
              <span className="font-semibold flex items-center gap-1 text-emerald-400">
                <MapPin className="w-3.5 h-3.5" /> Bukti Pelaksanaan Pekerjaan (Surabaya)
              </span>
              <button 
                onClick={() => setPreviewPhotoUrl(null)} 
                className="text-gray-400 hover:text-white px-2 py-0.5 rounded"
              >
                Tutup ✕
              </button>
            </div>
            <img 
              src={previewPhotoUrl} 
              alt="Bukti Pekerjaan" 
              className="w-full max-h-[70vh] object-cover" 
            />
          </div>
        </div>
      )}
    </div>
  );
};
