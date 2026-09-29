'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  HeartHandshake, ShieldCheck, FileText, Camera, Upload, 
  MapPin, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, 
  GraduationCap, Sparkles, Building2, User, Phone, Mail, Award, Lock, Navigation
} from 'lucide-react';
import { useCareNest } from '@/lib/CareNestContext';
import { ServiceCategory } from '@/lib/types';

export default function TalentRegisterPage() {
  const router = useRouter();
  const { registerTalent } = useCareNest();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [nikKtp, setNikKtp] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Sukolilo');
  
  // Education & Experience
  const [education, setEducation] = useState('S1 Keperawatan Universitas Airlangga');
  const [categories, setCategories] = useState<ServiceCategory[]>(['elderly', 'child']);
  const [experienceYears, setExperienceYears] = useState(2);
  const [hourlyRate, setHourlyRate] = useState(50000);
  const [bio, setBio] = useState('Mahasiswa Keperawatan tingkat akhir di Surabaya. Siap mendampingi lansia geriatri dan balita dengan SOP medis terstandar.');

  // Document verification mock files
  const [ktpUploaded, setKtpUploaded] = useState(true);
  const [selfieUploaded, setSelfieUploaded] = useState(true);
  const [skckUploaded, setSkckUploaded] = useState(true);
  const [ijazahUploaded, setIjazahUploaded] = useState(true);
  const [skckNumber, setSkckNumber] = useState('SKCK/2026/POLDA-JATIM/8812');

  // Payout & Security Agreement
  const [bankAccount, setBankAccount] = useState('BCA - 0881928371 a/n ' + (fullName || 'Pendaftar'));
  const [agreeGps, setAgreeGps] = useState(true);
  const [agreeNoLeakage, setAgreeNoLeakage] = useState(true);
  const [agreeSop, setAgreeSop] = useState(true);

  const toggleCategory = (cat: ServiceCategory) => {
    if (categories.includes(cat)) {
      if (categories.length > 1) {
        setCategories(categories.filter(c => c !== cat));
      }
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!fullName.trim() || !phone.trim() || !nikKtp.trim()) {
        alert('Mohon lengkapi Nama, NIK KTP, dan Nomor Telepon.');
        return;
      }
      if (nikKtp.length < 16) {
        alert('NIK KTP harus 16 digit sesuai standar kependudukan.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeGps || !agreeNoLeakage || !agreeSop) {
      alert('Anda wajib menyetujui seluruh klausul keamanan, GPS wajib aktif, dan SOP CareHub.');
      return;
    }

    const result = registerTalent({
      name: fullName.trim(),
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}@carenest.id`,
      phone: phone.trim(),
      education: education.trim(),
      bio: bio.trim(),
      hourlyRate: Number(hourlyRate),
      experienceYears: Number(experienceYears),
      categories: categories,
      areas: [district, 'Surabaya Pusat', 'Surabaya Timur'],
      ktpNumber: nikKtp.trim(),
      skckNumber: skckNumber.trim(),
      bankAccount: bankAccount.trim(),
      badges: ['Mitra Baru Terverifikasi', 'SKCK Polda Jatim', education.includes('UNAIR') ? 'Mahasiswa UNAIR' : 'Pendidik Terlatih'],
    });

    if (result.success) {
      alert(`Selamat ${fullName}! Pendaftaran Mitra Pengasuh berhasil. Dokumen Anda telah tervalidasi dan Anda otomatis masuk ke Dashboard Talent.`);
      router.push('/caregiver');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* 1. OPREC INFO BANNER & CRITERIA */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Open Recruitment Mitra Talent / Pengasuh CareHub Surabaya 2026</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
          Bergabung Jadi Mitra Pengasuh Terpercaya di Surabaya
        </h1>

        <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
          Dapatkan penghasilan fleksibel dengan tarif transparan mulai <span className="text-amber-300 font-bold">Rp 40.000 – Rp 75.000/jam</span>. CareHub menjamin pembayaran aman melalui sistem escrow serta perlindungan kerja terjadwal (H-1).
        </p>

        {/* Criteria & Requirements Highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-1">
            <span className="text-amber-300 font-bold text-xs flex items-center gap-1">
              <GraduationCap className="w-4 h-4" /> Kriteria Utama:
            </span>
            <p className="text-[11px] text-emerald-100">
              Mahasiswa/Alumni Keperawatan, PAUD, Kedokteran Hewan, Fisioterapi (UNAIR, UNESA, dll) atau IRT berpengalaman.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-1">
            <span className="text-emerald-300 font-bold text-xs flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Syarat Dokumen Ketat:
            </span>
            <p className="text-[11px] text-emerald-100">
              Wajib KTP asli, SKCK aktif Kepolisian (Polda/Polres Jatim), dan bukti pendidikan (KTM / Ijazah).
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-1">
            <span className="text-teal-300 font-bold text-xs flex items-center gap-1">
              <Navigation className="w-4 h-4" /> Keamanan & GPS:
            </span>
            <p className="text-[11px] text-emerald-100">
              GPS wajib aktif saat pengerjaan tugas di Surabaya. Pembayaran dicairkan otomatis setelah customer konfirmasi.
            </p>
          </div>
        </div>
      </div>

      {/* 2. REGISTRATION STEPPER */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        {[
          { num: 1, title: 'Data Diri & KTP' },
          { num: 2, title: 'Kualifikasi' },
          { num: 3, title: 'Unggah SKCK/KTP' },
          { num: 4, title: 'Rekening & SOP' },
        ].map(s => (
          <div key={s.num} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1 transition-all ${step === s.num ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : step > s.num ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > s.num ? '✓' : s.num}
            </div>
            <span className={`text-[11px] font-semibold ${step === s.num ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* 3. MULTI-STEP FORM */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        
        {/* STEP 1: IDENTITAS RESMI */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Langkah 1: Identitas & Data Kontak</h2>
              <p className="text-xs text-gray-500">
                Pendaftaran mitra kerja terverifikasi sesuai standar keamanan CareHub Indonesia.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nama Lengkap (Sesuai KTP):</label>
                <input
                  type="text"
                  placeholder="Contoh: Dinda Ayu Permata"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Nomor Induk Kependudukan (NIK KTP 16 Digit):</label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="357801xxxxxxxxxx"
                  value={nikKtp}
                  onChange={(e) => setNikKtp(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Nomor WhatsApp / HP Aktif:</label>
                <input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Alamat Email:</label>
                <input
                  type="email"
                  placeholder="dinda@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">Domisili Kecamatan di Surabaya:</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Sukolilo">Sukolilo (Dekat UNAIR Kampus C / ITS)</option>
                  <option value="Gubeng">Gubeng (Dekat UNAIR Kampus A & B)</option>
                  <option value="Tegalsari">Tegalsari (Surabaya Pusat)</option>
                  <option value="Wonokromo">Wonokromo (Surabaya Selatan / Dekat UNESA Ketintang)</option>
                  <option value="Rungkut">Rungkut & MERR (Surabaya Timur / UPN)</option>
                  <option value="Wiyung">Wiyung (Surabaya Barat / UNESA Lidah)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5"
              >
                <span>Lanjut ke Kualifikasi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PENDIDIKAN & KEAHLIAN */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Langkah 2: Kualifikasi & Kategori Layanan</h2>
              <p className="text-xs text-gray-500">
                Tentukan bidang spesialisasi pengasuhan yang Anda kuasai.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Pilih Kategori yang Dapat Anda Layani (Bisa lebih dari 1):</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'elderly', title: '👵 Lansia', desc: 'Pendampingan & Fisioterapi' },
                    { id: 'child', title: '👶 Anak & Balita', desc: 'Stimulasi Belajar & Nanny' },
                    { id: 'pet', title: '🐾 Hewan Peliharaan', desc: 'Sitter & Dog Walking' },
                  ].map(cat => {
                    const isSel = categories.includes(cat.id as ServiceCategory);
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id as ServiceCategory)}
                        className={`p-3 rounded-xl border text-center transition-all ${isSel ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                      >
                        <p className="text-xs font-bold">{cat.title}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{cat.desc}</p>
                        {isSel && <span className="text-emerald-600 text-[10px] block mt-1">✓ Dipilih</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Pendidikan Terakhir / Sedang Ditempuh:</label>
                <input
                  type="text"
                  placeholder="Contoh: S1 Keperawatan Univ. Airlangga (Semester 7)"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Pengalaman Pengasuhan (Tahun):</label>
                  <select
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={1}>1 Tahun (Fresh Talent / Mahasiswa)</option>
                    <option value={2}>2 Tahun (Berpengalaman)</option>
                    <option value={3}>3 - 4 Tahun (Mahir)</option>
                    <option value={5}>5+ Tahun (Senior Caregiver)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tarif Layanan Dasar (Rp/Jam):</label>
                  <input
                    type="number"
                    step={5000}
                    min={35000}
                    max={100000}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-800"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Saran tarif CareHub Surabaya: Rp 45.000 – Rp 65.000/jam</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Bio & Ringkasan Pengalaman:</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                ← Kembali
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5"
              >
                <span>Lanjut ke Upload Dokumen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: UNGGAH DOKUMEN & VERIFIKASI KETAT */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Langkah 3: Unggah Dokumen Verifikasi (KYC)</h2>
              <p className="text-xs text-gray-500">
                Untuk menjamin keselamatan keluarga, setiap mitra pengasuh yang berkunjung ke rumah wajib melampirkan berkas resmi.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* KTP */}
              <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Foto KTP Asli</h4>
                    <p className="text-gray-500 text-[11px]">Foto jelas, tidak buram dan tidak terpotong</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Terunggah
                </span>
              </div>

              {/* Selfie KTP */}
              <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Foto Selfie Memegang KTP</h4>
                    <p className="text-gray-500 text-[11px]">Memastikan pemilik akun sesuai dengan identitas fisik</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Terunggah
                </span>
              </div>

              {/* SKCK (CRITICAL PRD REQUIREMENT) */}
              <div className="p-3.5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-gray-900">SKCK Aktif Kepolisian (Polda/Polres Jatim)</h4>
                      <span className="px-1.5 py-0.2 bg-red-100 text-red-800 text-[9px] font-extrabold rounded">WAJIB</span>
                    </div>
                    <p className="text-gray-600 text-[11px]">Nomor: {skckNumber}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Validasi Berhasil
                </span>
              </div>

              {/* KTM / Ijazah */}
              <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">KTM / Ijazah / STR Keperawatan</h4>
                    <p className="text-gray-500 text-[11px]">Bukti klaim pendidikan tenaga terdidik</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                </span>
              </div>

            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                ← Kembali
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5"
              >
                <span>Lanjut ke Rekening & Komitmen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REKENING & KOMITMEN KEAMANAN */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Langkah 4: Rekening Payout & Komitmen Keamanan</h2>
              <p className="text-xs text-gray-500">
                Pencairan penghasilan dan penandatanganan pakta integritas mitra CareHub.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nomor Rekening Bank / E-Wallet untuk Pencairan:</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="Contoh: BCA 123456789 a/n Nama Anda"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-gray-800"
                  required
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">Honor dicairkan otomatis setelah customer konfirmasi selesai di platform.</span>
              </div>

              {/* Strict Security Agreements */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-3">
                <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Pakta Integritas & Keamanan Mitra Pengasuh (Wajib Disetujui):</span>
                </h4>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeGps}
                    onChange={(e) => setAgreeGps(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-gray-700 text-[11px] leading-relaxed">
                    <strong>Wajib GPS Aktif:</strong> Saya bersedia menyalakan GPS di perangkat selama bertugas. Jika GPS dimatikan, saya mengerti bahwa sistem CareHub akan langsung menjeda dan menghentikan pengerjaan tugas demi keamanan pelanggan.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeNoLeakage}
                    onChange={(e) => setAgreeNoLeakage(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-gray-700 text-[11px] leading-relaxed">
                    <strong>Anti-Leakage Policy:</strong> Saya berkomitmen tidak meminta transaksi di luar platform (misal WhatsApp) kepada customer CareHub, demi menjaga asuransi perlindungan kerja, riwayat reputasi, dan kepastian escrow.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeSop}
                    onChange={(e) => setAgreeSop(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-gray-700 text-[11px] leading-relaxed">
                    <strong>Kepatuhan Care Plan & Bukti Foto:</strong> Saya bersedia menjalankan seluruh tugas sesuai instruksi customer serta mengunggah bukti foto pengerjaan tugas tepat waktu.
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                ← Kembali
              </button>

              <button
                type="submit"
                className="px-8 py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Kirim Pendaftaran & Masuk Sebagai Mitra Talent</span>
              </button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
}
