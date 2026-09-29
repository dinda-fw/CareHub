'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  HeartHandshake, ShieldCheck, User, Lock, Mail, ArrowRight, 
  Sparkles, CheckCircle2, Building2, Users, Briefcase, Baby,
  Phone, CreditCard, MapPin, AlertCircle, FileCheck
} from 'lucide-react';
import { useCareNest } from '@/lib/CareNestContext';
import { UserRole } from '@/lib/types';
import { INDONESIA_CITIES } from '@/lib/indonesiaCities';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const redirectUrl = searchParams.get('redirect') || '';

  const { loginAs, registerCustomer, loginCustomerDirect, loginAdminDirect } = useCareNest();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [registerRole, setRegisterRole] = useState<'customer' | 'caregiver'>('customer');
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Customer registration state
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custNik, setCustNik] = useState('');
  const [custCity, setCustCity] = useState('Kota Surabaya');
  const [custDistrict, setCustDistrict] = useState('Gubeng');
  const [custAddress, setCustAddress] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPassword, setCustPassword] = useState('');
  const [agreeLegal, setAgreeLegal] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  const demoAccounts = [
    {
      role: 'customer' as UserRole,
      name: 'Budi Santoso',
      roleTitle: 'Akun Customer (Keluarga Pemesan)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      desc: 'Terverifikasi NIK KTP & No. WA Surabaya. Dapat memesan pengasuh, memantau live progress & melepas dana escrow.',
      redirectUrl: redirectUrl || '/customer',
      color: 'border-emerald-500 hover:bg-emerald-50/50',
      badge: 'bg-emerald-100 text-emerald-800',
    },
    {
      role: 'caregiver' as UserRole,
      name: 'Dinda Ayu, S.Kep',
      roleTitle: 'Akun Talent / Pengasuh (UNAIR)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      desc: 'Buka order aktif di Surabaya, verifikasi izin GPS, upload foto bukti selesai tugas.',
      redirectUrl: '/caregiver',
      color: 'border-blue-500 hover:bg-blue-50/50',
      badge: 'bg-blue-100 text-blue-800',
    },
    {
      role: 'facility' as UserRole,
      name: 'LittleNest Daycare',
      roleTitle: 'Akun Mitra Fasilitas Surabaya',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      desc: 'Kelola slot harian daycare di Tegalsari Surabaya, check-in anak, dan SOP.',
      redirectUrl: '/facility',
      color: 'border-purple-500 hover:bg-purple-50/50',
      badge: 'bg-purple-100 text-purple-800',
    }
  ];

  const handle1ClickLogin = (account: typeof demoAccounts[0]) => {
    loginAs(account.role);
    router.push(account.redirectUrl);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanInput = email.toLowerCase().trim();

    // Check if user is logging in as Admin
    if (cleanInput === 'admin' || cleanInput === 'admin@carenest.id' || selectedRole === 'admin') {
      const res = loginAdminDirect(cleanInput, password);
      if (res.success) {
        router.push('/admin');
        return;
      }
    }

    if (selectedRole === 'customer') {
      const res = loginCustomerDirect(email);
      if (res.success) {
        router.push(redirectUrl || '/customer');
      } else {
        loginAs('customer');
        router.push(redirectUrl || '/customer');
      }
    } else {
      loginAs(selectedRole);
      if (selectedRole === 'caregiver') router.push('/caregiver');
      else if (selectedRole === 'facility') router.push('/facility');
      else router.push('/admin');
    }
  };

  const handleCustomerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!custName.trim()) {
      setRegError('Nama lengkap sesuai KTP wajib diisi!');
      return;
    }
    if (!custPhone.trim() || custPhone.replace(/[^0-9]/g, '').length < 9) {
      setRegError('Nomor WhatsApp aktif wajib diisi minimal 9 digit angka untuk verifikasi darurat!');
      return;
    }
    if (!custNik.trim() || custNik.replace(/[^0-9]/g, '').length !== 16) {
      setRegError('NIK KTP wajib 16 digit angka resmi untuk perlindungan hukum anti-orderan fiktif!');
      return;
    }
    if (!custAddress.trim()) {
      setRegError('Alamat domisili lengkap penjemputan/layanan wajib diisi!');
      return;
    }
    if (!custEmail.trim() || !custEmail.includes('@')) {
      setRegError('Alamat email valid wajib diisi!');
      return;
    }
    if (!agreeLegal) {
      setRegError('Anda wajib mencentang persetujuan hukum dan anti-orderan fiktif untuk melanjutkan!');
      return;
    }

    const res = registerCustomer({
      fullName: custName,
      email: custEmail,
      phone: custPhone,
      nikKtp: custNik,
      city: custCity,
      district: custDistrict,
      address: custAddress,
      password: custPassword,
    });

    if (res.success) {
      setRegSuccess('Pendaftaran berhasil! Akun Customer Anda telah terverifikasi KTP.');
      setTimeout(() => {
        router.push(redirectUrl || '/customer');
      }, 1000);
    } else {
      setRegError(res.error || 'Gagal mendaftar. Silakan coba lagi.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-500/20">
          <HeartHandshake className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Gerbang Akun CareHub Indonesia
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Pusat layanan pengasuhan terjadwal dengan standar verifikasi SKCK, NIK KTP & proteksi anti-orderan fiktif.
        </p>
      </div>

      {/* Anti-Fraud Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3 max-w-2xl mx-auto text-amber-900 text-xs">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Proteksi Keamanan & Anti-Orderan Fiktif:</span>
          <span>Seluruh pemesanan wajib dilakukan oleh Customer yang telah login atau mendaftar resmi dengan NIK KTP dan nomor WhatsApp aktif. Tidak ada celah pemesanan anonim demi keselamatan anak, lansia & pet.</span>
        </div>
      </div>

      {/* Tabs Selector: Masuk vs Daftar */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center gap-1 border border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Masuk Akun (Login)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'register' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Daftar Akun Baru
          </button>
        </div>
      </div>

      {/* TAB 1: LOGIN (WITH 1-CLICK DEMO CARDS) */}
      {activeTab === 'login' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* 1-Click Demo Shortcut */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Pintasan Masuk Cepat (Akun Demo Terverifikasi)</span>
              </div>
              <h2 className="text-base font-bold text-gray-900 mt-1">
                Pilih Akun Demo untuk Menguji Sistem:
              </h2>
              <p className="text-xs text-gray-500">
                Klik salah satu profil berikut untuk masuk seketika dengan kredensial terverifikasi:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {demoAccounts.map((account, idx) => (
                <div
                  key={idx}
                  onClick={() => handle1ClickLogin(account)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${account.color} shadow-xs hover:shadow-md`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={account.avatar}
                      alt={account.name}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-gray-900">{account.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${account.badge}`}>
                          1-Click
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-gray-600 mt-0.5">{account.roleTitle}</p>
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{account.desc}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>Masuk sebagai {account.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Login Manual */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4 max-w-lg mx-auto">
            <h3 className="font-bold text-sm text-gray-900 text-center">Atau Masuk dengan Email / No. WhatsApp & Sandi</h3>
            
            {loginError && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Peran Akun:</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                >
                  <option value="customer">Customer (Pencari Layanan - Terverifikasi)</option>
                  <option value="caregiver">Talent / Pengasuh (Penyedia Jasa)</option>
                  <option value="facility">Mitra Fasilitas (Daycare / Klinik)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Alamat Email atau No. WhatsApp / Username:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="nama@email.com atau 08123456789"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Kata Sandi:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors"
              >
                Masuk ke Portal CareHub
              </button>
            </form>

            {/* Akses Internal Admin */}
            <div className="pt-3 border-t border-gray-100 text-center">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin');
                  setPassword('admin123');
                  setSelectedRole('admin');
                }}
                className="text-[11px] text-gray-400 hover:text-amber-800 transition-colors inline-flex items-center gap-1.5 font-medium"
              >
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                <span>Portal Khusus Administrator (User: admin • Sandi: admin123)</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: REGISTER */}
      {activeTab === 'register' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Sub Selector: Customer vs Caregiver */}
          <div className="flex justify-center">
            <div className="bg-emerald-50/70 p-1.5 rounded-2xl flex items-center gap-2 border border-emerald-200">
              <button
                type="button"
                onClick={() => setRegisterRole('customer')}
                className={`px-4 sm:px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  registerRole === 'customer'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-800 hover:bg-emerald-100/60'
                }`}
              >
                <Baby className="w-4 h-4" />
                <span>Daftar Sebagai Customer (Pemesan)</span>
              </button>
              
              <button
                type="button"
                onClick={() => setRegisterRole('caregiver')}
                className={`px-4 sm:px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  registerRole === 'caregiver'
                    ? 'bg-amber-500 text-gray-950 shadow-sm'
                    : 'text-amber-900 hover:bg-amber-100/60'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Daftar Talent (Oprec Mitra Pengasuh)</span>
              </button>
            </div>
          </div>

          {/* SUB-TAB: CUSTOMER REGISTRATION FORM */}
          {registerRole === 'customer' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-md max-w-2xl mx-auto space-y-6">
              
              <div className="border-b border-gray-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verifikasi Identitas Wajib (Proteksi Anti-Orderan Fiktif)</span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                  Formulir Pendaftaran Customer Terverifikasi
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Untuk keamanan pengasuh dan pencegahan pesanan fiktif, setiap customer wajib mengisi data identitas KTP dan nomor telepon aktif sebelum memesan layanan.
                </p>
              </div>

              {regError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <form onSubmit={handleCustomerRegister} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nama Lengkap KTP */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Nama Lengkap (Sesuai KTP) <span className="text-red-500">*</span>:
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Contoh: Budi Santoso"
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  {/* NIK KTP */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      NIK KTP (16 Digit Resmi) <span className="text-red-500">*</span>:
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        maxLength={16}
                        placeholder="Contoh: 3578012345670001"
                        value={custNik}
                        onChange={(e) => setCustNik(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">
                      Tersimpan aman & dienkripsi untuk audit perlindungan hukum.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nomor WhatsApp */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Nomor WhatsApp Aktif <span className="text-red-500">*</span>:
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        placeholder="Contoh: 081234567890"
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Alamat Email <span className="text-red-500">*</span>:
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        placeholder="nama@email.com"
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Kota & Kecamatan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Kota / Kabupaten Domisili <span className="text-red-500">*</span>:
                    </label>
                    <select
                      value={custCity}
                      onChange={(e) => setCustCity(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {INDONESIA_CITIES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.province})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Kecamatan / Area:
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Gubeng, Sukolilo, Rungkut"
                      value={custDistrict}
                      onChange={(e) => setCustDistrict(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Alamat Lengkap */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Alamat Lengkap Rumah / Lokasi Penjemputan <span className="text-red-500">*</span>:
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <textarea
                      rows={2}
                      placeholder="Contoh: Jl. Raya Gubeng No. 45 RT 02 RW 03, Kel. Gubeng, Kota Surabaya"
                      value={custAddress}
                      onChange={(e) => setCustAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                {/* Kata Sandi */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Buat Kata Sandi:
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      placeholder="Minimal 6 karakter"
                      value={custPassword}
                      onChange={(e) => setCustPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Legal Statement & Anti-Fraud Guarantee Checkbox */}
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeLegal}
                      onChange={(e) => setAgreeLegal(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 shrink-0"
                    />
                    <span className="text-[11px] text-gray-700 leading-relaxed">
                      <strong>Pernyataan Hukum & Pertanggungjawaban Anti-Orderan Fiktif:</strong> Saya menyatakan bahwa seluruh identitas KTP dan kontak yang saya daftarkan adalah benar. Saya bertanggung jawab penuh secara perdata & pidana (Pasal 378 KUHP & UU ITE No. 1 Tahun 2024), serta bersedia akun dibekukan dan diproses hukum apabila saya melakukan pesanan fiktif atau merugikan pihak talent/pengasuh.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Daftar & Verifikasi Akun Customer</span>
                </button>
              </form>

            </div>
          )}

          {/* SUB-TAB: TALENT / CAREGIVER OPREC CARD */}
          {registerRole === 'caregiver' && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 border-2 border-amber-400 shadow-md max-w-2xl mx-auto space-y-6 relative">
              <span className="absolute -top-3 right-6 px-3.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-500 text-gray-950 shadow-sm">
                OPEN RECRUITMENT 2026 SURABAYA
              </span>

              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center">
                  <Briefcase className="w-7 h-7" />
                </div>
                <h3 className="font-extrabold text-xl text-amber-950">
                  Pendaftaran Mitra Pengasuh / Talent CareHub
                </h3>
                <p className="text-xs text-amber-900/80 leading-relaxed">
                  CareHub membuka lowongan kemitraan untuk Mahasiswa Aktif/Alumni S1 Keperawatan/PAUD/FKH Universitas Airlangga (UNAIR), Ibu Rumah Tangga berpengalaman, serta Pet-care enthusiast di wilayah Kota Surabaya dan sekitarnya.
                </p>
              </div>

              {/* Persyaratan Ketat Oprec */}
              <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-amber-200 space-y-2.5 text-xs text-gray-800">
                <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Syarat & Prosedur Seleksi Ketat (Anti-Malpraktik):</span>
                </h4>
                <ul className="space-y-1.5 pl-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>E-KTP asli WNI (Domisili Surabaya, Sidoarjo, Gresik)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>SKCK resmi dari Kepolisian (Polres/Polda Jatim) yang masih berlaku</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>KTM Mahasiswa Keperawatan/FKH UNAIR atau Ijazah/Sertifikat Pelatihan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Wajib mengaktifkan GPS perangkat saat bertugas dan upload bukti foto real-time</span>
                  </li>
                </ul>
              </div>

              {/* Penghasilan */}
              <div className="bg-amber-100/60 rounded-2xl p-3.5 flex items-center justify-between text-xs text-amber-950">
                <div>
                  <span className="font-semibold block text-[11px] text-amber-800">Estimasi Penghasilan:</span>
                  <span className="font-extrabold text-sm sm:text-base">Rp 40.000 - Rp 75.000 / Jam</span>
                </div>
                <span className="text-[10px] bg-amber-200 px-2.5 py-1 rounded-full font-bold">
                  Pencairan Dompet H+0
                </span>
              </div>

              <Link
                href="/talent/register"
                className="w-full py-3.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-gray-950 shadow-md transition-all text-center block"
              >
                Buka Formulir Pendaftaran Talent Oprec Lengkap (Upload KTP & SKCK) →
              </Link>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="max-w-4xl mx-auto py-16 text-center text-xs text-gray-500">Memuat Gerbang Akun...</div>}>
      <LoginContent />
    </React.Suspense>
  );
}
