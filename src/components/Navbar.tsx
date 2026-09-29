'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCareNest } from '@/lib/CareNestContext';
import { 
  ShieldCheck, MapPin, User, ChevronDown, Bell, Wallet, 
  Sparkles, HeartHandshake, Compass, Users, Clock, AlertTriangle, 
  LogOut, LogIn, UserPlus, Briefcase 
} from 'lucide-react';
import { UserRole } from '@/lib/types';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isLoggedIn, logout, switchRole, gpsActive, setGpsActive } = useCareNest();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [talentMenuOpen, setTalentMenuOpen] = useState(false);

  const roleLabelMap: Record<UserRole, { label: string; badge: string; color: string }> = {
    customer: { label: 'Customer', badge: 'Keluarga Pemesan', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    caregiver: { label: 'Talent / Pengasuh', badge: 'Mitra Pengasuh UNAIR', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    facility: { label: 'Mitra Fasilitas', badge: 'LittleNest Daycare', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    admin: { label: 'Admin CareHub', badge: 'Trust & Safety Hub', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      {/* Top Banner Alert if GPS is off for active caregiver */}
      {isLoggedIn && !gpsActive && currentUser?.role === 'caregiver' && (
        <div className="bg-red-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Perhatian: GPS Anda non-aktif. Sesuai ketentuan CareHub, tugas pengasuhan di Surabaya hanya dapat dilaporkan bila GPS aktif.
            </span>
            <button
              onClick={() => setGpsActive(true)}
              className="ml-auto underline hover:text-red-100 cursor-pointer bg-red-700 px-2 py-0.5 rounded text-[11px]"
            >
              Aktifkan GPS Sekarang
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & City Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-emerald-600 transition-colors">
                  Care<span className="text-emerald-600">Hub</span>
                </span>
                <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                  Surabaya
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Surabaya</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-700">
            <Link 
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${pathname === '/' ? 'text-emerald-600 bg-emerald-50 font-semibold' : 'hover:text-emerald-600 hover:bg-gray-50'}`}
            >
              Beranda
            </Link>

            <Link 
              href="/customer/booking" 
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${pathname === '/customer/booking' ? 'text-emerald-600 bg-emerald-50 font-semibold' : 'hover:text-emerald-600 hover:bg-gray-50'}`}
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Pesan Care (H-1)</span>
            </Link>

            <Link 
              href="/customer/facilities" 
              className={`px-3 py-1.5 rounded-lg transition-colors ${pathname === '/customer/facilities' ? 'text-emerald-600 bg-emerald-50 font-semibold' : 'hover:text-emerald-600 hover:bg-gray-50'}`}
            >
              Mitra Terdekat
            </Link>

            {/* Combined Talent Menu: Daftar Talent & Pendaftaran Oprec */}
            <div 
              className="relative"
              onMouseEnter={() => setTalentMenuOpen(true)}
              onMouseLeave={() => setTalentMenuOpen(false)}
            >
              <button 
                type="button"
                onClick={() => setTalentMenuOpen(!talentMenuOpen)}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${(pathname === '/customer/talent' || pathname === '/talent/register') ? 'text-emerald-600 bg-emerald-50 font-semibold' : 'hover:text-emerald-600 hover:bg-gray-50'}`}
              >
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Talent/Pengasuh</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${talentMenuOpen ? 'rotate-180 text-emerald-600' : 'text-gray-400'}`} />
              </button>

              {talentMenuOpen && (
                <div className="absolute left-0 mt-1 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <Link
                    href="/customer/talent"
                    onClick={() => setTalentMenuOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50/70 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-gray-900 group-hover:text-emerald-700 flex items-center gap-1.5">
                        <span>Daftar & Profil Talent</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                        Katalog caregiver UNAIR, guru PAUD & pet sitter terverifikasi di Surabaya.
                      </p>
                    </div>
                  </Link>

                  <div className="border-t border-gray-100 my-1" />

                  <Link
                    href="/talent/register"
                    onClick={() => setTalentMenuOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/70 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-gray-900 group-hover:text-amber-800 flex items-center gap-1.5">
                        <span>Pendaftaran Talent</span>
                        <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-amber-200 text-amber-900 rounded-full">
                          Buka
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                        Gabung mitra pengasuh: syarat KTP, SKCK Polda Jatim, & seleksi ketat.
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Portal link if logged in */}
            {isLoggedIn && currentUser?.role === 'customer' && (
              <Link 
                href="/customer" 
                className={`px-3 py-1.5 rounded-lg transition-colors ${pathname === '/customer' ? 'text-emerald-600 bg-emerald-50 font-semibold' : 'hover:text-emerald-600 hover:bg-gray-50'}`}
              >
                Dashboard Customer
              </Link>
            )}

            {isLoggedIn && currentUser?.role === 'caregiver' && (
              <Link 
                href="/caregiver" 
                className={`px-3 py-1.5 rounded-lg transition-colors ${pathname.startsWith('/caregiver') ? 'text-blue-600 bg-blue-50 font-semibold' : 'hover:text-blue-600 hover:bg-gray-50'}`}
              >
                Menu Pengasuh
              </Link>
            )}

            {isLoggedIn && currentUser?.role === 'facility' && (
              <Link 
                href="/facility" 
                className={`px-3 py-1.5 rounded-lg transition-colors ${pathname.startsWith('/facility') ? 'text-purple-600 bg-purple-50 font-semibold' : 'hover:text-purple-600 hover:bg-gray-50'}`}
              >
                Menu Fasilitas
              </Link>
            )}

            {isLoggedIn && currentUser?.role === 'admin' && (
              <Link 
                href="/admin" 
                className={`px-3 py-1.5 rounded-lg transition-colors ${pathname.startsWith('/admin') ? 'text-amber-600 bg-amber-50 font-semibold' : 'hover:text-amber-600 hover:bg-gray-50'}`}
              >
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Right Section: Guest vs Logged In */}
          <div className="flex items-center gap-3">
            
            {/* If NOT Logged In (Guest View: Bersih hanya Masuk & Daftar) */}
            {!isLoggedIn && (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </Link>

                <Link
                  href="/login?tab=register"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* If Logged In */}
            {isLoggedIn && currentUser && (
              <>
                {/* Wallet / Escrow pill */}
                <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200 text-xs font-semibold">
                  <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Rp {currentUser.wallet_balance.toLocaleString('id-ID')}</span>
                </div>

                {/* Role Switcher & User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all shadow-sm ${roleLabelMap[currentUser.role].color}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                    <span className="font-bold">{currentUser.full_name.split(' ')[0]}</span>
                    <span className="text-[10px] opacity-75">({roleLabelMap[currentUser.role].label})</span>
                    <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-gray-500" />
                  </button>

                  {roleMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                      onMouseLeave={() => setRoleMenuOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-900">{currentUser.full_name}</p>
                        <p className="text-[11px] text-gray-500">{currentUser.email}</p>
                      </div>

                      <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        Ganti Peran Demo:
                      </div>

                      <button
                        onClick={() => { switchRole('customer'); setRoleMenuOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-emerald-50 ${currentUser.role === 'customer' ? 'font-bold text-emerald-700 bg-emerald-50/50' : 'text-gray-700'}`}
                      >
                        <span>Customer (Budi Santoso)</span>
                        {currentUser.role === 'customer' && <span className="text-emerald-600 text-xs">✓</span>}
                      </button>

                      <button
                        onClick={() => { switchRole('caregiver'); setRoleMenuOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-blue-50 ${currentUser.role === 'caregiver' ? 'font-bold text-blue-700 bg-blue-50/50' : 'text-gray-700'}`}
                      >
                        <span>Pengasuh (Dinda Ayu UNAIR)</span>
                        {currentUser.role === 'caregiver' && <span className="text-blue-600 text-xs">✓</span>}
                      </button>

                      <button
                        onClick={() => { switchRole('facility'); setRoleMenuOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-purple-50 ${currentUser.role === 'facility' ? 'font-bold text-purple-700 bg-purple-50/50' : 'text-gray-700'}`}
                      >
                        <span>Mitra (LittleNest Daycare)</span>
                        {currentUser.role === 'facility' && <span className="text-purple-600 text-xs">✓</span>}
                      </button>

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => { switchRole('admin'); setRoleMenuOpen(false); }}
                          className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-amber-50 ${currentUser.role === 'admin' ? 'font-bold text-amber-700 bg-amber-50/50' : 'text-gray-700'}`}
                        >
                          <span>Admin Trust & Safety</span>
                          <span className="text-amber-600 text-xs">✓</span>
                        </button>
                      )}

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setRoleMenuOpen(false);
                            router.push('/');
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-1.5 font-semibold"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Keluar (Logout)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Avatar */}
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.full_name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                />
              </>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
