'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, AlertTriangle, Users, Building2, Wallet, 
  MapPin, CheckCircle2, XCircle, FileText, ArrowRight, Eye, Sparkles,
  Trash2, Edit, RefreshCw, Key, Plus, Search, Filter, Lock, Check,
  Camera, Compass, AlertCircle, ChevronDown, UserCheck, UserX,
  Phone, Mail, CreditCard, Clock, Calendar, ArrowLeft, LogOut
} from 'lucide-react';
import { useCareNest } from '@/lib/CareNestContext';
import { UserRole, OrderStatus, EscrowStatus, Profile, Order } from '@/lib/types';

export default function AdminDashboard() {
  const router = useRouter();
  const { 
    currentUser, isLoggedIn, allProfiles, caregivers, facilities, orders, 
    auditLogs, deleteOrder, updateOrder, updateOrderStatus, updateEscrowStatus,
    deleteUser, updateUser, resetUserPassword, createUser, verifyCaregiver,
    loginAdminDirect, logout, switchRole
  } = useCareNest();

  // Authentication gate state for admin
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [authError, setAuthError] = useState<string | null>(null);

  // Active section tab
  const [activeTab, setActiveTab] = useState<'orders' | 'users' | 'verifications' | 'audit'>('orders');

  // Filters & Search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderEscrowFilter, setOrderEscrowFilter] = useState<string>('all');

  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');

  // Modals state
  const [selectedEvidenceOrder, setSelectedEvidenceOrder] = useState<Order | null>(null);
  const [deleteOrderConfirm, setDeleteOrderConfirm] = useState<Order | null>(null);
  const [deleteUserConfirm, setDeleteUserConfirm] = useState<Profile | null>(null);
  const [resetPwNotice, setResetPwNotice] = useState<{ user: Profile; tempPass: string } | null>(null);
  
  // Edit user modal
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editNik, setEditNik] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editWallet, setEditWallet] = useState(0);

  // Add user modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('customer');
  const [newUserNik, setNewUserNik] = useState('');
  const [newUserAddress, setNewUserAddress] = useState('');
  const [newUserWallet, setNewUserWallet] = useState(1000000);

  // Success / Action notification toast
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const showAlert = (msg: string) => {
    setActionAlert(msg);
    setTimeout(() => setActionAlert(null), 4000);
  };

  // If not logged in as Admin, show Admin Gate
  if (!isLoggedIn || currentUser?.role !== 'admin') {
    const handleAdminLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError(null);
      const res = loginAdminDirect(adminUsername, adminPassword);
      if (!res.success) {
        setAuthError(res.error || 'Username atau kata sandi admin tidak valid!');
      }
    };

    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border-2 border-amber-500 shadow-xl max-w-md w-full space-y-6 animate-in fade-in">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7 text-amber-700" />
            </div>
            <h1 className="text-xl font-extrabold text-gray-900">
              Gerbang Otentikasi Administrator CareNest
            </h1>
            <p className="text-xs text-gray-500">
              Area terbatas internal. Harap masukkan kredensial admin untuk mengakses konsol manajemen sistem.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Username / Email Admin:</label>
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="admin atau admin@carenest.id"
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Kata Sandi:</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Masuk Portal Admin</span>
            </button>
          </form>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <Link href="/" className="hover:text-emerald-700 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>
            <span className="text-[11px] text-gray-400">CareNest Security Protocol v2.0</span>
          </div>
        </div>
      </div>
    );
  }

  // Admin KPIs
  const totalGMV = orders.reduce((acc, o) => acc + o.total_amount, 0);
  const totalEscrowHeld = orders.filter(o => o.escrow_status === 'held').reduce((acc, o) => acc + o.total_amount, 0);
  const activeOrdersCount = orders.filter(o => o.order_status === 'in_progress' || o.order_status === 'confirmed').length;
  const completedOrdersCount = orders.filter(o => o.order_status === 'completed').length;

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.order_number.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.recipient_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.caregiver_name && o.caregiver_name.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (o.facility_name && o.facility_name.toLowerCase().includes(orderSearch.toLowerCase()));
    
    const matchesStatus = orderStatusFilter === 'all' || o.order_status === orderStatusFilter;
    const matchesEscrow = orderEscrowFilter === 'all' || o.escrow_status === orderEscrowFilter;

    return matchesSearch && matchesStatus && matchesEscrow;
  });

  // Filtered Users
  const filteredUsers = allProfiles.filter(u => {
    const matchesSearch = 
      u.full_name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone.includes(userSearch) ||
      (u.nik_ktp && u.nik_ktp.includes(userSearch));
    
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;

    return matchesSearch && matchesRole;
  });

  // Action handlers
  const handleExecuteDeleteOrder = () => {
    if (!deleteOrderConfirm) return;
    const res = deleteOrder(deleteOrderConfirm.id);
    if (res.success) {
      showAlert(`Pesanan #${deleteOrderConfirm.order_number} berhasil dihapus dari sistem!`);
      setDeleteOrderConfirm(null);
    }
  };

  const handleExecuteDeleteUser = () => {
    if (!deleteUserConfirm) return;
    const res = deleteUser(deleteUserConfirm.id);
    if (res.success) {
      showAlert(`Pengguna ${deleteUserConfirm.full_name} (${deleteUserConfirm.email}) berhasil dihapus.`);
      setDeleteUserConfirm(null);
    }
  };

  const handleResetPassword = (user: Profile) => {
    const res = resetUserPassword(user.id);
    if (res.success && res.temporaryPassword) {
      setResetPwNotice({ user, tempPass: res.temporaryPassword });
      showAlert(`Kata sandi untuk ${user.full_name} berhasil direset.`);
    }
  };

  const handleOpenEditUser = (user: Profile) => {
    setEditingUser(user);
    setEditFullName(user.full_name);
    setEditPhone(user.phone);
    setEditNik(user.nik_ktp || '');
    setEditAddress(user.address || '');
    setEditWallet(user.wallet_balance || 0);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const res = updateUser(editingUser.id, {
      full_name: editFullName,
      phone: editPhone,
      nik_ktp: editNik,
      address: editAddress,
      wallet_balance: Number(editWallet),
    });
    if (res.success) {
      showAlert(`Data pengguna ${editFullName} berhasil diperbarui!`);
      setEditingUser(null);
    }
  };

  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createUser({
      full_name: newUserName,
      email: newUserEmail,
      phone: newUserPhone,
      role: newUserRole,
      nik_ktp: newUserNik,
      address: newUserAddress,
      wallet_balance: Number(newUserWallet),
    });
    if (res.success) {
      showAlert(`Pengguna baru ${newUserName} (${newUserRole}) berhasil dibuat!`);
      setShowAddUserModal(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPhone('');
      setNewUserNik('');
      setNewUserAddress('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Alert */}
      {actionAlert && (
        <div className="fixed top-20 right-4 z-50 bg-gray-900 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-right-4 border border-emerald-500/50">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionAlert}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Pusat Kendali Trust & Safety CareNest • Area Surabaya & Nasional</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Konsol Manajemen & Audit Administrator</h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
            Audit keamanan KTP/SKCK, kendali penuh CRUD pesanan (hapus/ubah/refund), manajemen akun user, reset kata sandi, dan inspeksi bukti foto GPS.
          </p>
        </div>

        {/* Action button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-amber-950 hover:bg-amber-100 shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah User Baru</span>
          </button>
          
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-red-600/80 hover:bg-red-700 text-white shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Admin</span>
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-1">
          <span className="text-xs text-gray-500 font-medium">Gross Merchandise Value (GMV)</span>
          <div className="text-xl font-extrabold text-gray-900">Rp {totalGMV.toLocaleString('id-ID')}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Total Nilai Transaksi</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-1">
          <span className="text-xs text-gray-500 font-medium">Dana Ditahan di Escrow</span>
          <div className="text-xl font-extrabold text-amber-700">Rp {totalEscrowHeld.toLocaleString('id-ID')}</div>
          <span className="text-[11px] text-amber-700 font-medium">{activeOrdersCount} pesanan berjalan</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-1">
          <span className="text-xs text-gray-500 font-medium">Total Akun Terdaftar</span>
          <div className="text-xl font-extrabold text-blue-700">{allProfiles.length} Pengguna</div>
          <span className="text-[11px] text-blue-600 font-semibold">Customer, Talent & Fasilitas</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-1">
          <span className="text-xs text-gray-500 font-medium">Pesanan Sukses Selesai</span>
          <div className="text-xl font-extrabold text-emerald-700">{completedOrdersCount} Pesanan</div>
          <span className="text-[11px] text-emerald-600 font-semibold">100% Bukti Foto & GPS</span>
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex border-b border-gray-200 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-amber-600 text-amber-900 bg-amber-50/50 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Kelola Semua Pesanan ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'users'
              ? 'border-amber-600 text-amber-900 bg-amber-50/50 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>CRUD Semua Pengguna ({allProfiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('verifications')}
          className={`py-3 px-5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'verifications'
              ? 'border-amber-600 text-amber-900 bg-amber-50/50 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Verifikasi Talent & SKCK ({caregivers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`py-3 px-5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'audit'
              ? 'border-amber-600 text-amber-900 bg-amber-50/50 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Log Audit & Keamanan ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: MANAJEMEN PESANAN (CRUD ORDERS) */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6 animate-in fade-in">
          
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Daftar Semua Pesanan Pelanggan</h2>
              <p className="text-xs text-gray-500">
                Pencarian, pembaruan status, pelepasan/refund escrow, inspeksi foto pengerjaan, dan penghapusan pesanan.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari ID, customer, talent..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="py-1.5 px-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Semua Status</option>
                <option value="in_progress">In Progress</option>
                <option value="confirmed">Confirmed</option>
                <option value="awaiting_applicants">Awaiting Talent</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={orderEscrowFilter}
                onChange={(e) => setOrderEscrowFilter(e.target.value)}
                className="py-1.5 px-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Semua Escrow</option>
                <option value="held">Held (Ditahan)</option>
                <option value="released">Released (Cair)</option>
                <option value="refunded">Refunded (Dikembalikan)</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase font-semibold text-[10px] tracking-wider border-y border-gray-200">
                <tr>
                  <th className="py-3 px-3">No. Order & Jadwal</th>
                  <th className="py-3 px-3">Customer (Pemesan)</th>
                  <th className="py-3 px-3">Penerima & Layanan</th>
                  <th className="py-3 px-3">Petugas / Mitra</th>
                  <th className="py-3 px-3">Biaya & Escrow</th>
                  <th className="py-3 px-3">Status Order</th>
                  <th className="py-3 px-3 text-right">Aksi Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      Tidak ada pesanan yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/70 transition-colors">
                      
                      {/* No Order & Date */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-gray-900 block">#{o.order_number}</span>
                        <span className="text-[10px] text-gray-500">
                          {new Date(o.scheduled_start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-3">
                        <span className="font-semibold text-gray-900 block">{o.customer_name}</span>
                        <span className="text-[10px] text-gray-500">{o.customer_phone}</span>
                      </td>

                      {/* Recipient & Category */}
                      <td className="py-3 px-3">
                        <span className="font-semibold text-gray-800 block">{o.recipient_name}</span>
                        <span className="text-[10px] capitalize px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 inline-block">
                          {o.service_category} ({o.fulfillment_type === 'home_visit' ? 'Home Visit' : 'Fasilitas'})
                        </span>
                      </td>

                      {/* Caregiver / Facility */}
                      <td className="py-3 px-3">
                        <span className="font-medium text-gray-900 block">
                          {o.caregiver_name || o.facility_name || 'Menunggu Talent'}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium">
                          {o.tasks.filter(t => t.status === 'completed').length}/{o.tasks.length} task selesai ({o.progress_percentage}%)
                        </span>
                      </td>

                      {/* Price & Escrow */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-gray-900 block">
                          Rp {o.total_amount.toLocaleString('id-ID')}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block ${
                          o.escrow_status === 'held' ? 'bg-amber-100 text-amber-800' :
                          o.escrow_status === 'released' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          Escrow: {o.escrow_status.toUpperCase()}
                        </span>
                      </td>

                      {/* Order Status */}
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          o.order_status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          o.order_status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          o.order_status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                          o.order_status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {o.order_status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* View Evidence / GPS */}
                          <button
                            type="button"
                            onClick={() => setSelectedEvidenceOrder(o)}
                            title="Lihat Bukti Foto & Audit GPS"
                            className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 transition-colors"
                          >
                            <Camera className="w-3.5 h-3.5 text-gray-600" />
                          </button>

                          {/* Escrow Release Button */}
                          {o.escrow_status === 'held' && (
                            <button
                              type="button"
                              onClick={() => {
                                updateEscrowStatus(o.id, 'released');
                                showAlert(`Dana Escrow order #${o.order_number} berhasil dilepas ke pengasuh.`);
                              }}
                              title="Lepaskan Dana Escrow ke Pengasuh"
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                            >
                              Lepas Escrow
                            </button>
                          )}

                          {/* Escrow Refund Button */}
                          {o.escrow_status === 'held' && (
                            <button
                              type="button"
                              onClick={() => {
                                updateEscrowStatus(o.id, 'refunded');
                                updateOrderStatus(o.id, 'cancelled');
                                showAlert(`Dana Escrow order #${o.order_number} dikembalikan 100% ke dompet customer.`);
                              }}
                              title="Kembalikan Dana ke Customer (Refund)"
                              className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold text-[10px]"
                            >
                              Refund
                            </button>
                          )}

                          {/* Delete Order Button */}
                          <button
                            type="button"
                            onClick={() => setDeleteOrderConfirm(o)}
                            title="Hapus Pesanan Secara Permanen"
                            className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: MANAJEMEN PENGGUNA (CRUD USERS) */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Manajemen Semua Akun Pengguna</h2>
              <p className="text-xs text-gray-500">
                Audit identitas KTP, verifikasi akun, ubah profil, reset password, atau hapus user.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama, email, NIK, HP..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="py-1.5 px-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Semua Peran</option>
                <option value="customer">Customer</option>
                <option value="caregiver">Caregiver / Talent</option>
                <option value="facility">Mitra Fasilitas</option>
                <option value="admin">Admin</option>
              </select>

              <button
                type="button"
                onClick={() => setShowAddUserModal(true)}
                className="px-3 py-1.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah User</span>
              </button>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase font-semibold text-[10px] tracking-wider border-y border-gray-200">
                <tr>
                  <th className="py-3 px-3">Pengguna</th>
                  <th className="py-3 px-3">Peran Akun</th>
                  <th className="py-3 px-3">Kontak & NIK KTP</th>
                  <th className="py-3 px-3">Domisili / Wilayah</th>
                  <th className="py-3 px-3">Saldo Dompet</th>
                  <th className="py-3 px-3">Verifikasi KTP</th>
                  <th className="py-3 px-3 text-right">Aksi Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      Tidak ada pengguna yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                      
                      {/* Name & Avatar */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                            alt={u.full_name}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                          />
                          <div>
                            <span className="font-bold text-gray-900 block">{u.full_name}</span>
                            <span className="text-[10px] text-gray-500">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          u.role === 'customer' ? 'bg-emerald-100 text-emerald-800' :
                          u.role === 'caregiver' ? 'bg-blue-100 text-blue-800' :
                          u.role === 'facility' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      {/* Contact & NIK */}
                      <td className="py-3 px-3">
                        <span className="font-medium text-gray-800 block">{u.phone}</span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          NIK: {u.nik_ktp || 'Belum diisi'}
                        </span>
                      </td>

                      {/* District & City */}
                      <td className="py-3 px-3">
                        <span className="text-gray-700 block">{u.district || '-'}, {u.city || 'Surabaya'}</span>
                      </td>

                      {/* Wallet */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-gray-900">
                          Rp {(u.wallet_balance || 0).toLocaleString('id-ID')}
                        </span>
                      </td>

                      {/* Verified Badge */}
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => {
                            const newStatus = !u.is_verified;
                            updateUser(u.id, { is_verified: newStatus });
                            showAlert(`Status verifikasi ${u.full_name} diubah menjadi: ${newStatus ? 'Terverifikasi' : 'Belum Verifikasi'}`);
                          }}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 cursor-pointer transition-all ${
                            u.is_verified
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {u.is_verified ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          <span>{u.is_verified ? 'Terverifikasi' : 'Pending'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Reset Password */}
                          <button
                            type="button"
                            onClick={() => handleResetPassword(u)}
                            title="Reset Kata Sandi Akun"
                            className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 transition-colors"
                          >
                            <Key className="w-3.5 h-3.5 text-amber-700" />
                          </button>

                          {/* Edit User */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditUser(u)}
                            title="Edit Data Pengguna"
                            className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5 text-blue-600" />
                          </button>

                          {/* Delete User */}
                          {u.id !== currentUser.id && (
                            <button
                              type="button"
                              onClick={() => setDeleteUserConfirm(u)}
                              title="Hapus Pengguna Permanen"
                              className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 3: VERIFIKASI TALENT & SKCK */}
      {activeTab === 'verifications' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-base font-bold text-gray-900">Validasi Kualifikasi & Dokumen Legal Mitra Talent</h2>
            <p className="text-xs text-gray-500">
              Setiap pengasuh anak, lansia, dan pet wajib memiliki SKCK resmi Polda Jatim dan identitas KTP yang telah diaudit oleh tim admin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caregivers.map((cg) => (
              <div key={cg.id} className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-4 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <img
                    src={cg.avatar_url}
                    alt={cg.name}
                    className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900">{cg.name}</span>
                      <span className="text-xs font-bold text-emerald-700">Rp {cg.hourly_rate.toLocaleString('id-ID')}/jam</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5">{cg.education}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Wilayah: {cg.service_areas.join(', ')}</p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Verifikasi E-KTP:</span>
                    <span className={`font-bold ${cg.verified_ktp ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {cg.verified_ktp ? '✓ Lolos Validasi' : 'Pending Audit'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">SKCK Polda Jatim:</span>
                    <span className={`font-bold ${cg.verified_skck ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {cg.verified_skck ? '✓ Lolos Validasi' : 'Pending Audit'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Rating & Jam Terbang:</span>
                    <span className="font-bold text-gray-800">★ {cg.rating} ({cg.total_orders_completed} order)</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1">
                  {cg.badges.map((b, idx) => (
                    <span key={idx} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {b}
                    </span>
                  ))}
                </div>

                {/* Verification Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      verifyCaregiver(cg.id, true, 'SKCK Polda Jatim Valid');
                      showAlert(`Dokumen ${cg.name} disetujui & badge 'SKCK Polda Jatim Valid' diterbitkan.`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                  >
                    Setujui & Terbitkan Badge
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      verifyCaregiver(cg.id, false);
                      showAlert(`Status verifikasi ${cg.name} dicabut.`);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs"
                  >
                    Tolak / Cabut
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4 animate-in fade-in">
          <div>
            <h2 className="text-base font-bold text-gray-900">Catatan Audit & Riwayat Tindakan Administratif</h2>
            <p className="text-xs text-gray-500">
              Semua tindakan kritis admin (penghapusan pesanan, reset kata sandi, modifikasi pengguna, pelepasan dana) tercatat otomatis di log sistem.
            </p>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {auditLogs.length === 0 ? (
              <p className="py-6 text-center text-gray-400">Belum ada catatan log aktivitas.</p>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-900 px-2 py-0.2 rounded bg-amber-100 text-[10px]">
                        {log.action}
                      </span>
                      <span className="font-semibold text-gray-900">{log.target}</span>
                    </div>
                    <p className="text-gray-600 text-[11px]">{log.details}</p>
                  </div>
                  <div className="text-[10px] text-gray-400 text-right shrink-0">
                    <span>{new Date(log.created_at).toLocaleString('id-ID')}</span>
                    <span className="block text-gray-500 font-medium">Oleh: {log.admin_name}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL: VIEW EVIDENCE & GPS AUDIT */}
      {selectedEvidenceOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  Bukti Pengerjaan & Audit GPS #{selectedEvidenceOrder.order_number}
                </h3>
                <p className="text-xs text-gray-500">
                  Customer: {selectedEvidenceOrder.customer_name} • Penerima: {selectedEvidenceOrder.recipient_name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvidenceOrder(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* GPS snapshot */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 space-y-1 text-xs">
              <div className="flex items-center gap-2 text-blue-900 font-bold">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Koordinat GPS Terkunci (Live Snapshot)</span>
              </div>
              <p className="text-blue-800">
                Latitude: <strong className="font-mono">{selectedEvidenceOrder.latitude}</strong>, Longitude: <strong className="font-mono">{selectedEvidenceOrder.longitude}</strong>
              </p>
              <p className="text-[11px] text-blue-700">
                Alamat Layanan: {selectedEvidenceOrder.service_address}, {selectedEvidenceOrder.city || 'Surabaya'}
              </p>
            </div>

            {/* Task list with photos */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider">
                Foto Bukti Pengerjaan per Task:
              </h4>

              {selectedEvidenceOrder.tasks.map((task) => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{task.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      task.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {task.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-[11px]">{task.description}</p>

                  {task.evidence ? (
                    <div className="space-y-2 pt-1 border-t border-gray-200">
                      <img
                        src={task.evidence.photo_url}
                        alt="Bukti Task"
                        className="w-full h-44 object-cover rounded-xl border border-gray-300 shadow-xs"
                      />
                      <div className="text-[10px] text-gray-500 flex items-center justify-between">
                        <span>Catatan: {task.evidence.notes}</span>
                        <span>{new Date(task.evidence.submitted_at).toLocaleTimeString('id-ID')} WIB</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 italic">Belum ada foto yang diunggah untuk tugas ini.</p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEvidenceOrder(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-gray-900 text-white hover:bg-gray-800"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE ORDER CONFIRMATION */}
      {deleteOrderConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-base text-gray-900">
                Konfirmasi Hapus Pesanan #{deleteOrderConfirm.order_number}?
              </h3>
              <p className="text-xs text-gray-500">
                Tindakan ini akan menghapus pesanan atas nama <strong>{deleteOrderConfirm.customer_name}</strong> secara permanen dari database. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-xs text-red-800 space-y-1">
              <div className="flex justify-between">
                <span>Total Biaya:</span>
                <span className="font-bold">Rp {deleteOrderConfirm.total_amount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Status Escrow:</span>
                <span className="font-bold uppercase">{deleteOrderConfirm.escrow_status}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteOrderConfirm(null)}
                className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteDeleteOrder}
                className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 shadow-md transition-colors"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE USER CONFIRMATION */}
      {deleteUserConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <UserX className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-base text-gray-900">
                Hapus Akun Pengguna?
              </h3>
              <p className="text-xs text-gray-500">
                Anda akan menghapus akun <strong>{deleteUserConfirm.full_name}</strong> ({deleteUserConfirm.email}). Seluruh riwayat dan profil terkait akan ikut terhapus.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteUserConfirm(null)}
                className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteDeleteUser}
                className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 shadow-md"
              >
                Ya, Hapus User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RESET PASSWORD NOTICE */}
      {resetPwNotice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Key className="w-6 h-6" />
            </div>

            <h3 className="font-extrabold text-base text-gray-900">
              Kata Sandi Berhasil Direset!
            </h3>
            <p className="text-xs text-gray-500">
              Kata sandi untuk akun <strong>{resetPwNotice.user.full_name}</strong> telah direset ke sandi sementara default berikut:
            </p>

            <div className="p-3 bg-gray-100 rounded-2xl font-mono text-base font-bold text-gray-900 border border-gray-300">
              {resetPwNotice.tempPass}
            </div>

            <p className="text-[11px] text-gray-400">
              Pengguna dapat menggunakan kata sandi ini untuk login dan mengubahnya kembali di menu profil.
            </p>

            <button
              type="button"
              onClick={() => setResetPwNotice(null)}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
            >
              Mengerti & Tutup
            </button>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">Edit Profil Pengguna</h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nama Lengkap:</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Nomor WhatsApp / HP:</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">NIK KTP (16 Digit):</label>
                <input
                  type="text"
                  maxLength={16}
                  value={editNik}
                  onChange={(e) => setEditNik(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Alamat Domisili:</label>
                <textarea
                  rows={2}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Saldo Dompet (Rp):</label>
                <input
                  type="number"
                  value={editWallet}
                  onChange={(e) => setEditWallet(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW USER */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">Tambah Akun Pengguna Baru</h3>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Peran Akun:</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="customer">Customer (Pemesan)</option>
                  <option value="caregiver">Caregiver / Talent</option>
                  <option value="facility">Mitra Fasilitas Daycare/Klinik</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Nama Lengkap (Sesuai KTP):</label>
                <input
                  type="text"
                  placeholder="Contoh: Maya Anggraini"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Alamat Email:</label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">No. WhatsApp:</label>
                  <input
                    type="tel"
                    placeholder="08123456789"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">NIK KTP (16 Digit):</label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="357801..."
                    value={newUserNik}
                    onChange={(e) => setNewUserNik(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Alamat Lengkap Surabaya:</label>
                <textarea
                  rows={2}
                  placeholder="Jl. Raya Wonokromo No. 12 Surabaya"
                  value={newUserAddress}
                  onChange={(e) => setNewUserAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Saldo Awal Dompet (Rp):</label>
                <input
                  type="number"
                  value={newUserWallet}
                  onChange={(e) => setNewUserWallet(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
                >
                  Buat Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
