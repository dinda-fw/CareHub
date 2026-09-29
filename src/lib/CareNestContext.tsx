'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Profile, CaregiverProfile, Facility, CareRecipient, Order, OrderTask, TaskEvidence, 
  JobBid, UserRole, PackageType, FulfillmentType, ServiceCategory, OrderStatus, EscrowStatus, AdminAuditLog 
} from './types';
import { loadAppState, saveAppState, calculateDistanceKm } from './mockData';

interface CareNestContextType {
  currentUser: Profile | null;
  isLoggedIn: boolean;
  allProfiles: Profile[];
  caregivers: CaregiverProfile[];
  facilities: Facility[];
  recipients: CareRecipient[];
  orders: Order[];
  bids: JobBid[];
  auditLogs: AdminAuditLog[];
  gpsActive: boolean;
  currentGpsCoords: { lat: number; lng: number; address: string };
  setGpsActive: (active: boolean) => void;
  loginAs: (roleOrId: UserRole | string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  createBooking: (data: {
    recipientId?: string;
    customRecipient?: {
      name: string;
      age_or_details: string;
      gender_or_breed?: string;
      special_needs?: string;
      caregiver_criteria?: string;
    };
    fulfillmentType: FulfillmentType;
    serviceCategory: ServiceCategory;
    packageType: PackageType;
    durationHours: number;
    daysCount: number;
    scheduledStart: string;
    scheduledEnd: string;
    serviceAddress: string;
    city?: string;
    district: string;
    latitude?: number;
    longitude?: number;
    caregiverCriteria?: string;
    notes?: string;
    tasks: { title: string; description: string; scheduled_time: string; is_required_photo: boolean }[];
    facilityId?: string;
    selectedCaregiverId?: string;
  }) => { success: boolean; orderId?: string; error?: string };
  updateTaskStatus: (params: {
    orderId: string;
    taskId: string;
    status: 'pending' | 'in_progress' | 'completed';
    photoUrl?: string;
    notes?: string;
    latitude?: number;
    longitude?: number;
    addressSnapshot?: string;
  }) => { success: boolean; error?: string };
  releaseEscrow: (orderId: string) => { success: boolean; error?: string };
  addReview: (orderId: string, rating: number, comment: string) => void;
  applyToJob: (orderId: string, proposedRate: number, proposalNote: string) => { success: boolean; error?: string };
  acceptJobBid: (orderId: string, bidId: string) => { success: boolean; order?: Order; error?: string };
  cancelCaregiverSelection: (orderId: string) => { success: boolean; error?: string };
  simulateApplicant: (orderId: string) => { success: boolean; bid?: JobBid; error?: string };
  registerTalent: (formData: {
    name: string;
    email: string;
    phone: string;
    education: string;
    bio: string;
    hourlyRate: number;
    experienceYears: number;
    categories: ServiceCategory[];
    areas: string[];
    ktpNumber: string;
    skckNumber: string;
    bankAccount: string;
    badges?: string[];
  }) => { success: boolean; profileId?: string; error?: string };
  registerCustomer: (data: {
    fullName: string;
    email: string;
    phone: string;
    nikKtp?: string;
    city?: string;
    district?: string;
    address: string;
    password?: string;
  }) => { success: boolean; profileId?: string; error?: string };
  loginCustomerDirect: (emailOrPhone: string) => { success: boolean; error?: string };
  updateCaregiverProfile: (updates: Partial<CaregiverProfile>) => void;
  refreshState: () => void;

  // Admin Management Functions
  deleteOrder: (orderId: string) => { success: boolean; message?: string };
  updateOrder: (orderId: string, updates: Partial<Order>) => { success: boolean; message?: string };
  updateOrderStatus: (orderId: string, status: OrderStatus) => { success: boolean };
  updateEscrowStatus: (orderId: string, status: EscrowStatus) => { success: boolean };
  deleteUser: (userId: string) => { success: boolean; message?: string };
  updateUser: (userId: string, updates: Partial<Profile>) => { success: boolean; message?: string };
  resetUserPassword: (userId: string) => { success: boolean; temporaryPassword?: string; message?: string };
  createUser: (userData: Partial<Profile>) => { success: boolean; user?: Profile; error?: string };
  verifyCaregiver: (caregiverId: string, status: boolean, badgeToAdd?: string) => { success: boolean };
  loginAdminDirect: (usernameOrEmail: string, password?: string) => { success: boolean; error?: string };
  addAuditLog: (action: string, target: string, details: string) => void;
}

const CareNestContext = createContext<CareNestContextType | undefined>(undefined);

export const CareNestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appState, setAppState] = useState(loadAppState());
  const [gpsActive, setGpsActiveState] = useState<boolean>(true);
  const [currentGpsCoords, setCurrentGpsCoords] = useState<{ lat: number; lng: number; address: string }>({
    lat: -7.2692,
    lng: 112.7531,
    address: 'Jl. Raya Gubeng No. 45, Surabaya (Terdeteksi GPS Aktif)',
  });

  const refreshState = () => {
    setAppState(loadAppState());
  };

  useEffect(() => {
    const handleStateChange = () => {
      setAppState(loadAppState());
    };
    window.addEventListener('carenest_state_change', handleStateChange);
    return () => window.removeEventListener('carenest_state_change', handleStateChange);
  }, []);

  // Real or simulated browser geolocation listener
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator && gpsActive) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const isNearSurabaya = Math.abs(lat - (-7.25)) < 1.0 && Math.abs(lng - 112.75) < 1.0;
          if (isNearSurabaya) {
            setCurrentGpsCoords({
              lat: Number(lat.toFixed(5)),
              lng: Number(lng.toFixed(5)),
              address: `Surabaya (${lat.toFixed(4)}, ${lng.toFixed(4)} - Akurasi ${Math.round(pos.coords.accuracy)}m)`,
            });
          }
        },
        () => {},
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [gpsActive]);

  // Current logged in user (null if guest)
  const currentUser = appState.currentUserId 
    ? (appState.profiles.find(p => p.id === appState.currentUserId) || null)
    : null;

  const isLoggedIn = !!currentUser;

  const loginAs = (roleOrId: UserRole | string) => {
    const targetUser = appState.profiles.find(p => p.role === roleOrId || p.id === roleOrId);
    if (targetUser) {
      const newState = { ...appState, currentUserId: targetUser.id };
      saveAppState(newState);
      setAppState(newState);
    }
  };

  const logout = () => {
    const newState = { ...appState, currentUserId: null };
    saveAppState(newState);
    setAppState(newState);
  };

  const switchRole = (role: UserRole) => {
    loginAs(role);
  };

  const switchUser = (userId: string) => {
    const targetUser = appState.profiles.find(p => p.id === userId);
    if (targetUser) {
      const newState = { ...appState, currentUserId: targetUser.id };
      saveAppState(newState);
      setAppState(newState);
    }
  };

  const setGpsActive = (active: boolean) => {
    setGpsActiveState(active);
  };

  const createBooking: CareNestContextType['createBooking'] = (data) => {
    // STRICT SECURITY: ANTI-ORDERAN FIKTIF
    if (!currentUser || currentUser.role !== 'customer') {
      return { 
        success: false, 
        error: 'KEAMANAN KETAT (Anti-Orderan Fiktif): Pemesanan wajib dilakukan oleh Customer terdaftar & terverifikasi. Silakan Masuk (Login) atau Daftar sebagai Customer terlebih dahulu!' 
      };
    }

    const startTime = new Date(data.scheduledStart).getTime();
    const now = Date.now();
    const diffHours = (startTime - now) / (1000 * 3600);

    if (diffHours < 23.5) {
      return { 
        success: false, 
        error: 'Sesuai aturan CareHub (BR-01), pemesanan wajib dilakukan minimal H-1 (24 jam sebelum jadwal mulai) demi keamanan, verifikasi & persiapan care plan.' 
      };
    }

    if (data.durationHours < 5) {
      return {
        success: false,
        error: 'Sesuai ketentuan CareHub, minimal durasi pemesanan layanan adalah 5 jam.',
      };
    }

    let recipient = data.recipientId ? appState.recipients.find(r => r.id === data.recipientId) : undefined;
    let updatedRecipients = [...appState.recipients];

    if (data.customRecipient && data.customRecipient.name.trim()) {
      const newRecId = `rc-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      const newRec: CareRecipient = {
        id: newRecId,
        customer_id: currentUser.id,
        name: data.customRecipient.name.trim(),
        type: data.serviceCategory,
        age_or_details: data.customRecipient.age_or_details || 'Sesuai instruksi',
        gender_or_breed: data.customRecipient.gender_or_breed || 'Laki-laki / Betina',
        special_needs: data.customRecipient.special_needs || 'Pendampingan sesuai care plan keluarga',
        allergies: 'Tidak ada alergi berat dilaporkan',
        emergency_contact: currentUser.phone || '0812-3456-7890',
        caregiver_criteria: data.caregiverCriteria || data.customRecipient.caregiver_criteria || '',
      };
      recipient = newRec;
      updatedRecipients = [newRec, ...updatedRecipients];
    } else if (!recipient) {
      recipient = appState.recipients[0];
    }

    let baseRatePerHour = 45000;
    let facility: Facility | undefined;
    let caregiver: CaregiverProfile | undefined;

    if (data.fulfillmentType === 'partner_facility' && data.facilityId) {
      facility = appState.facilities.find(f => f.id === data.facilityId);
      if (facility) {
        baseRatePerHour = facility.hourly_rate;
      }
    } else if (data.selectedCaregiverId) {
      caregiver = appState.caregivers.find(c => c.user_id === data.selectedCaregiverId || c.id === data.selectedCaregiverId);
      if (caregiver) {
        baseRatePerHour = caregiver.hourly_rate;
      }
    }

    const totalServiceBase = baseRatePerHour * data.durationHours * data.daysCount;
    
    let discountRate = 0;
    if (data.packageType === 'weekly') discountRate = 0.05;
    if (data.packageType === 'monthly') discountRate = 0.15;
    const discountAmount = Math.round(totalServiceBase * discountRate);

    const priceAfterDiscount = totalServiceBase - discountAmount;
    const platformFee = Math.round(priceAfterDiscount * 0.10);
    const totalAmount = priceAfterDiscount + platformFee;

    const newOrderId = `ord-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const orderNumber = `CN-SBY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTasks: OrderTask[] = data.tasks.map((t, idx) => ({
      id: `tsk-${newOrderId}-${idx + 1}`,
      order_id: newOrderId,
      title: t.title,
      description: t.description,
      scheduled_time: t.scheduled_time,
      is_required_photo: t.is_required_photo,
      is_required_gps: true,
      status: 'pending',
    }));

    const orderLat = data.latitude !== undefined ? data.latitude : currentUser.latitude;
    const orderLng = data.longitude !== undefined ? data.longitude : currentUser.longitude;

    const newOrder: Order = {
      id: newOrderId,
      order_number: orderNumber,
      customer_id: currentUser.id,
      customer_name: currentUser.full_name,
      customer_phone: currentUser.phone,
      caregiver_id: caregiver ? caregiver.user_id : undefined,
      caregiver_name: caregiver ? caregiver.name : undefined,
      caregiver_avatar: caregiver ? caregiver.avatar_url : undefined,
      facility_id: facility ? facility.id : undefined,
      facility_name: facility ? facility.name : undefined,
      facility_address: facility ? facility.address : undefined,
      recipient_id: recipient.id,
      recipient_name: `${recipient.name} (${recipient.age_or_details})`,
      recipient_type: recipient.type,
      recipient_details: recipient.special_needs || 'Pendampingan sesuai care plan',
      caregiver_criteria: data.caregiverCriteria || data.customRecipient?.caregiver_criteria || undefined,
      fulfillment_type: data.fulfillmentType,
      service_category: data.serviceCategory,
      package_type: data.packageType,
      duration_hours: data.durationHours,
      days_count: data.daysCount,
      scheduled_start: data.scheduledStart,
      scheduled_end: data.scheduledEnd,
      service_address: data.serviceAddress,
      city: data.city || 'Kota Surabaya',
      district: data.district,
      latitude: orderLat,
      longitude: orderLng,
      base_price: totalServiceBase,
      discount_amount: discountAmount,
      platform_fee: platformFee,
      total_amount: totalAmount,
      escrow_status: caregiver || facility ? 'held' : 'pending',
      order_status: caregiver || facility ? 'confirmed' : 'awaiting_applicants',
      progress_percentage: 0,
      notes: data.notes,
      tasks: newTasks,
      created_at: new Date().toISOString(),
    };

    let updatedBids = [...appState.bids];
    if (!caregiver && !facility) {
      // Auto-seed realistic applicant bids for HR-style caregiver selection
      const isPet = data.serviceCategory === 'pet';
      const isChild = data.serviceCategory === 'child';

      const seededBids: JobBid[] = [
        {
          id: `bid-${newOrderId}-1`,
          order_id: newOrderId,
          caregiver_id: 'c2000000-0000-0000-0000-000000000001',
          caregiver_name: 'Dinda Ayu, S.Kep',
          caregiver_rating: 4.95,
          caregiver_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
          proposed_rate: 50000,
          proposal_note: isPet 
            ? `Halo Bapak/Ibu ${currentUser.full_name}, saya pecinta hewan terlatih. Siap mendampingi dan merawat anabul kesayangan dengan kasih sayang, pemberian pakan tepat waktu, dan kebersihan terjaga.`
            : isChild
            ? `Halo Bapak/Ibu ${currentUser.full_name}, saya perawat Ners UNAIR dengan sertifikat Pediatric First Aid. Siap mendampingi ${recipient.name} bermain edukatif, menjaga nutrisi, dan tidur siang teratur.`
            : `Halo Bapak/Ibu ${currentUser.full_name}, saya perawat Ners lulusan UNAIR. Siap mendampingi ${recipient.name} dengan protokol keperawatan lengkap: cek tensi berkala, kontrol obat rutin, dan pendampingan fisik telaten.`,
          status: 'submitted',
          created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
          education: 'S1 Ners Keperawatan Univ. Airlangga',
          experience_years: 3,
          verified_skck: true,
          verified_ktp: true,
          badges: ['STR Perawat Aktif', 'SKCK Polda Jatim', 'First Aid Certified', 'Bebas Rokok'],
          bio: 'Lulusan Ners Keperawatan UNAIR Surabaya. Berpengalaman 3 tahun mendampingi lansia geriatri pasca stroke, kontrol jadwal obat rutin, cek tensi & gula darah, serta pendampingan anak.',
          phone: '0821-5566-7788',
        },
        {
          id: `bid-${newOrderId}-2`,
          order_id: newOrderId,
          caregiver_id: 'c2000000-0000-0000-0000-000000000002',
          caregiver_name: 'Sari Wahyuni, S.Pd',
          caregiver_rating: 4.88,
          caregiver_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
          proposed_rate: 45000,
          proposal_note: isChild
            ? `Halo! Saya mantan pendidik PAUD & Playgroup Surabaya 5 tahun. Sangat antusias mendampingi ${recipient.name} belajar kreatif, mewarnai, bermain puzzle, dan menjaga jadwal makan siang.`
            : `Halo! Saya pendamping keluarga berpengalaman di Surabaya. Sangat sabar, telaten, dan siap menciptakan lingkungan yang aman, bersih, dan nyaman untuk ${recipient.name}.`,
          status: 'submitted',
          created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          education: 'S1 PG-PAUD Univ. Negeri Surabaya',
          experience_years: 5,
          verified_skck: true,
          verified_ktp: true,
          badges: ['Pendidik PAUD', 'Child Care Spesialis', 'Stimulasi Sensorik', 'SKCK Polda Jatim'],
          bio: 'Eks Pendidik PAUD & Playgroup Surabaya selama 5 tahun. Spesialis mendampingi balita (1-5 tahun), stimulasi sensori motorik, potty training, dan jadwal nutrisi teratur.',
          phone: '0813-9876-5432',
        },
        {
          id: `bid-${newOrderId}-3`,
          order_id: newOrderId,
          caregiver_id: isPet ? 'c2000000-0000-0000-0000-000000000003' : 'c2000000-0000-0000-0000-000000000004',
          caregiver_name: isPet ? 'Fajar Pratama, S.KH' : 'Rian Hidayat, A.Md.Fis',
          caregiver_rating: isPet ? 5.0 : 4.92,
          caregiver_avatar: isPet 
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' 
            : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
          proposed_rate: isPet ? 40000 : 55000,
          proposal_note: isPet
            ? `Halo! Saya alumni Kedokteran Hewan FKH UNAIR. Terbiasa merawat anabul, dog walking rutin, pemberian vitamin/obat resep dokter hewan, dan pembersihan bulu secara higienis.`
            : `Selamat siang, saya fisioterapis berlisensi STR Kemenkes. Siap membantu mobilitas fisik, peregangan otot, dan pencegahan risiko jatuh lansia dengan teknik pendampingan medis yang aman.`,
          status: 'submitted',
          created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          education: isPet ? 'S1 Kedokteran Hewan UNAIR' : 'D3 Fisioterapi Poltekkes Kemenkes Surabaya',
          experience_years: isPet ? 2 : 4,
          verified_skck: true,
          verified_ktp: true,
          badges: isPet 
            ? ['Medis Hewan UNAIR', 'Pet Handling', 'First Aid Hewan', 'SKCK Polda Jatim']
            : ['Fisioterapis STR', 'Elderly Mobility', 'Rehabilitasi Medik', 'SKCK Polda Jatim'],
          bio: isPet 
            ? 'Alumni Kedokteran Hewan (FKH UNAIR). Terbiasa merawat anjing ras besar/kecil, kucing persia/domestik, pemberian obat, dan grooming dasar.'
            : 'Fisioterapis berlisensi STR. Khusus pendampingan mobilisasi fisik lansia, latihan jalan santai pasca stroke, dan latihan keseimbangan.',
          phone: isPet ? '0812-8899-7711' : '0857-1122-3344',
        }
      ];

      updatedBids = [...seededBids, ...updatedBids];
    }

    const updatedOrders = [newOrder, ...appState.orders];
    const newState = { ...appState, orders: updatedOrders, recipients: updatedRecipients, bids: updatedBids };
    saveAppState(newState);
    setAppState(newState);

    return { success: true, orderId: newOrderId };
  };

  const updateTaskStatus: CareNestContextType['updateTaskStatus'] = (params) => {
    if (params.status === 'completed' && !gpsActive) {
      return {
        success: false,
        error: 'Peringatan Keamanan: GPS harus tetap aktif untuk verifikasi pengerjaan task di lokasi Surabaya. Nyalakan GPS terlebih dahulu!',
      };
    }

    const orderIndex = appState.orders.findIndex(o => o.id === params.orderId);
    if (orderIndex === -1) return { success: false, error: 'Order tidak ditemukan' };

    const order = { ...appState.orders[orderIndex] };
    const taskIndex = order.tasks.findIndex(t => t.id === params.taskId);
    if (taskIndex === -1) return { success: false, error: 'Tugas tidak ditemukan' };

    const task = { ...order.tasks[taskIndex] };
    task.status = params.status;

    if (params.status === 'completed') {
      task.completed_at = new Date().toISOString();
      task.completed_by = currentUser?.id || 'caregiver-01';

      if (params.photoUrl) {
        task.evidence = {
          id: `evd-${Date.now()}`,
          task_id: task.id,
          order_id: order.id,
          photo_url: params.photoUrl,
          notes: params.notes || 'Tugas telah selesai dikerjakan sesuai SOP',
          latitude: params.latitude || currentGpsCoords.lat,
          longitude: params.longitude || currentGpsCoords.lng,
          addressSnapshot: params.addressSnapshot || currentGpsCoords.address,
          submitted_at: new Date().toISOString(),
        };
      }
    }

    order.tasks[taskIndex] = task;

    const completedCount = order.tasks.filter(t => t.status === 'completed').length;
    const totalCount = order.tasks.length;
    order.progress_percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    if (order.progress_percentage > 0 && order.order_status === 'confirmed') {
      order.order_status = 'in_progress';
    }

    const updatedOrders = [...appState.orders];
    updatedOrders[orderIndex] = order;

    const newState = { ...appState, orders: updatedOrders };
    saveAppState(newState);
    setAppState(newState);

    return { success: true };
  };

  const releaseEscrow = (orderId: string) => {
    const orderIndex = appState.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return { success: false, error: 'Order tidak ditemukan' };

    const order = { ...appState.orders[orderIndex] };
    order.escrow_status = 'released';
    order.order_status = 'completed';
    order.progress_percentage = 100;

    const updatedProfiles = appState.profiles.map(p => {
      if (order.caregiver_id && p.id === order.caregiver_id) {
        const netPayout = order.base_price - order.discount_amount;
        return { ...p, wallet_balance: p.wallet_balance + netPayout };
      }
      return p;
    });

    const updatedOrders = [...appState.orders];
    updatedOrders[orderIndex] = order;

    const newState = { ...appState, orders: updatedOrders, profiles: updatedProfiles };
    saveAppState(newState);
    setAppState(newState);

    return { success: true };
  };

  const addReview = (orderId: string, rating: number, comment: string) => {
    const orderIndex = appState.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;

    const order = { ...appState.orders[orderIndex], reviewed: true };
    const updatedOrders = [...appState.orders];
    updatedOrders[orderIndex] = order;

    const newState = { ...appState, orders: updatedOrders };
    saveAppState(newState);
    setAppState(newState);
  };

  const applyToJob = (orderId: string, proposedRate: number, proposalNote: string) => {
    const order = appState.orders.find(o => o.id === orderId);
    if (!order) return { success: false, error: 'Order tidak ditemukan' };

    const activeCaregiver = currentUser?.role === 'caregiver' ? currentUser : appState.profiles[1];

    const newBid: JobBid = {
      id: `bid-${Date.now()}`,
      order_id: orderId,
      caregiver_id: activeCaregiver.id,
      caregiver_name: activeCaregiver.full_name,
      caregiver_rating: 4.95,
      caregiver_avatar: activeCaregiver.avatar_url,
      proposed_rate: proposedRate,
      proposal_note: proposalNote,
      status: 'submitted',
      created_at: new Date().toISOString(),
    };

    const updatedBids = [newBid, ...appState.bids];
    const newState = { ...appState, bids: updatedBids };
    saveAppState(newState);
    setAppState(newState);

    return { success: true };
  };

  const acceptJobBid = (orderId: string, bidId: string) => {
    const orderIndex = appState.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return { success: false, error: 'Order tidak ditemukan' };

    const bid = appState.bids.find(b => b.id === bidId);
    if (!bid) return { success: false, error: 'Lamaran tidak ditemukan' };

    const order = { ...appState.orders[orderIndex] };
    order.caregiver_id = bid.caregiver_id;
    order.caregiver_name = bid.caregiver_name;
    order.caregiver_avatar = bid.caregiver_avatar;
    order.caregiver_phone = bid.phone || '0821-5566-7788';

    // Recalculate cost based on chosen caregiver's agreed proposed rate
    if (bid.proposed_rate > 0) {
      const baseSubtotal = bid.proposed_rate * order.duration_hours * order.days_count;
      let discountRate = 0;
      if (order.package_type === 'weekly') discountRate = 0.05;
      if (order.package_type === 'monthly') discountRate = 0.15;
      const discountAmount = Math.round(baseSubtotal * discountRate);
      const priceAfterDiscount = baseSubtotal - discountAmount;
      const platformFee = Math.round(priceAfterDiscount * 0.10);
      const totalAmount = priceAfterDiscount + platformFee;

      order.base_price = baseSubtotal;
      order.discount_amount = discountAmount;
      order.platform_fee = platformFee;
      order.total_amount = totalAmount;
    }

    const updatedBids = appState.bids.map(b => {
      if (b.order_id === orderId) {
        return { ...b, status: b.id === bidId ? ('accepted' as const) : ('rejected' as const) };
      }
      return b;
    });

    const updatedOrders = [...appState.orders];
    updatedOrders[orderIndex] = order;

    const newState = { ...appState, orders: updatedOrders, bids: updatedBids };
    saveAppState(newState);
    setAppState(newState);

    return { success: true, order };
  };

  const cancelCaregiverSelection = (orderId: string) => {
    const orderIndex = appState.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return { success: false, error: 'Order tidak ditemukan' };

    const order = { ...appState.orders[orderIndex] };
    order.caregiver_id = undefined;
    order.caregiver_name = undefined;
    order.caregiver_avatar = undefined;
    order.caregiver_phone = undefined;
    order.order_status = 'awaiting_applicants';

    const updatedBids = appState.bids.map(b => {
      if (b.order_id === orderId) {
        return { ...b, status: 'submitted' as const };
      }
      return b;
    });

    const updatedOrders = [...appState.orders];
    updatedOrders[orderIndex] = order;

    const newState = { ...appState, orders: updatedOrders, bids: updatedBids };
    saveAppState(newState);
    setAppState(newState);

    return { success: true };
  };

  const simulateApplicant = (orderId: string) => {
    const order = appState.orders.find(o => o.id === orderId);
    if (!order) return { success: false, error: 'Order tidak ditemukan' };

    const pool = appState.caregivers;
    const randomCaregiver = pool[Math.floor(Math.random() * pool.length)] || pool[0];
    const newBid: JobBid = {
      id: `bid-${orderId}-${Date.now().toString(36)}`,
      order_id: orderId,
      caregiver_id: randomCaregiver.user_id,
      caregiver_name: randomCaregiver.name,
      caregiver_rating: randomCaregiver.rating,
      caregiver_avatar: randomCaregiver.avatar_url,
      proposed_rate: randomCaregiver.hourly_rate,
      proposal_note: `Halo! Saya ${randomCaregiver.name}. Saya berminat mengambil tugas asuhan ini untuk wilayah Surabaya. Saya telah membaca care plan yang diminta dan siap bertugas profesional sesuai standar CareHub.`,
      status: 'submitted',
      created_at: new Date().toISOString(),
      education: randomCaregiver.education,
      experience_years: randomCaregiver.experience_years,
      verified_skck: randomCaregiver.verified_skck,
      verified_ktp: randomCaregiver.verified_ktp,
      badges: randomCaregiver.badges,
      bio: randomCaregiver.bio,
    };

    const updatedBids = [newBid, ...appState.bids];
    const newState = { ...appState, bids: updatedBids };
    saveAppState(newState);
    setAppState(newState);

    return { success: true, bid: newBid };
  };

  const registerTalent = (formData: {
    name: string;
    email: string;
    phone: string;
    education: string;
    bio: string;
    hourlyRate: number;
    experienceYears: number;
    categories: ServiceCategory[];
    areas: string[];
    ktpNumber: string;
    skckNumber: string;
    bankAccount: string;
    badges?: string[];
  }) => {
    const newUserId = `cg-user-${Date.now()}`;
    const newProfileId = `cg-prof-${Date.now()}`;

    const newProfile: Profile = {
      id: newUserId,
      email: formData.email,
      full_name: formData.name,
      role: 'caregiver',
      phone: formData.phone,
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
      city: 'Surabaya',
      district: formData.areas[0] || 'Sukolilo',
      address: `Jl. ${formData.areas[0] || 'Gebang'} Surabaya`,
      latitude: -7.2891,
      longitude: 112.7932,
      wallet_balance: 0,
      created_at: new Date().toISOString(),
    };

    const newCaregiver: CaregiverProfile = {
      id: newProfileId,
      user_id: newUserId,
      name: formData.name,
      avatar_url: newProfile.avatar_url,
      bio: formData.bio,
      education: formData.education,
      experience_years: formData.experienceYears,
      hourly_rate: formData.hourlyRate,
      rating: 5.0,
      total_reviews: 0,
      total_orders_completed: 0,
      verified_ktp: true,
      verified_skck: true,
      badges: formData.badges || ['Pendaftar Baru Terverifikasi', 'SKCK Polda Jatim', 'Surabaya Talent'],
      service_categories: formData.categories,
      service_areas: formData.areas,
      is_available: true,
      district: newProfile.district,
      latitude: newProfile.latitude,
      longitude: newProfile.longitude,
    };

    const updatedProfiles = [...appState.profiles, newProfile];
    const updatedCaregivers = [newCaregiver, ...appState.caregivers];

    const newState = {
      ...appState,
      currentUserId: newUserId,
      profiles: updatedProfiles,
      caregivers: updatedCaregivers,
    };

    saveAppState(newState);
    setAppState(newState);

    return { success: true, profileId: newUserId };
  };

  const registerCustomer = (data: {
    fullName: string;
    email: string;
    phone: string;
    nikKtp?: string;
    city?: string;
    district?: string;
    address: string;
    password?: string;
  }) => {
    if (!data.fullName.trim() || !data.phone.trim() || !data.email.trim()) {
      return { success: false, error: 'Nama lengkap, nomor HP WhatsApp, dan email wajib diisi!' };
    }

    const newUserId = `usr-cust-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newProfile: Profile = {
      id: newUserId,
      email: data.email.trim().toLowerCase(),
      full_name: data.fullName.trim(),
      role: 'customer',
      phone: data.phone.trim(),
      avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
      city: data.city || 'Kota Surabaya',
      district: data.district || 'Gubeng',
      address: data.address.trim(),
      latitude: -7.2575,
      longitude: 112.7521,
      wallet_balance: 2500000,
      nik_ktp: data.nikKtp?.trim() || undefined,
      is_verified: true,
      created_at: new Date().toISOString(),
    };

    const updatedProfiles = [...appState.profiles, newProfile];
    const newState = {
      ...appState,
      currentUserId: newUserId,
      profiles: updatedProfiles,
    };

    saveAppState(newState);
    setAppState(newState);

    return { success: true, profileId: newUserId };
  };

  const loginCustomerDirect = (emailOrPhone: string) => {
    const clean = emailOrPhone.trim().toLowerCase();
    const found = appState.profiles.find(
      p => p.role === 'customer' && (
        p.email.toLowerCase() === clean || 
        p.phone.replace(/[^0-9]/g, '') === clean.replace(/[^0-9]/g, '')
      )
    );

    if (found) {
      const newState = { ...appState, currentUserId: found.id };
      saveAppState(newState);
      setAppState(newState);
      return { success: true };
    } else {
      const defaultCust = appState.profiles.find(p => p.role === 'customer');
      if (defaultCust) {
        const newState = { ...appState, currentUserId: defaultCust.id };
        saveAppState(newState);
        setAppState(newState);
        return { success: true };
      }
      return { success: false, error: 'Akun customer tidak ditemukan. Silakan daftar akun baru.' };
    }
  };

  const updateCaregiverProfile = (updates: Partial<CaregiverProfile>) => {
    if (!currentUser || currentUser.role !== 'caregiver') return;

    const cgIndex = appState.caregivers.findIndex(c => c.user_id === currentUser.id);
    if (cgIndex === -1) return;

    const updatedCaregiver = { ...appState.caregivers[cgIndex], ...updates };
    const updatedCaregivers = [...appState.caregivers];
    updatedCaregivers[cgIndex] = updatedCaregiver;

    const profileIndex = appState.profiles.findIndex(p => p.id === currentUser.id);
    let updatedProfiles = [...appState.profiles];
    if (profileIndex !== -1 && updates.name) {
      updatedProfiles[profileIndex] = { ...updatedProfiles[profileIndex], full_name: updates.name };
    }

    const newState = { ...appState, caregivers: updatedCaregivers, profiles: updatedProfiles };
    saveAppState(newState);
    setAppState(newState);
  };

  const addAuditLog = (action: string, target: string, details: string) => {
    const newLog: AdminAuditLog = {
      id: `log-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      admin_name: currentUser?.full_name || 'Admin Trust & Safety',
      action,
      target,
      details,
      created_at: new Date().toISOString(),
    };
    const currentLogs = appState.auditLogs || [];
    const newState = { ...appState, auditLogs: [newLog, ...currentLogs] };
    saveAppState(newState);
    setAppState(newState);
  };

  const deleteOrder = (orderId: string) => {
    const targetOrder = appState.orders.find(o => o.id === orderId);
    if (!targetOrder) return { success: false, message: 'Pesanan tidak ditemukan' };

    const updatedOrders = appState.orders.filter(o => o.id !== orderId);
    const newLog: AdminAuditLog = {
      id: `log-${Date.now().toString(36)}`,
      admin_name: currentUser?.full_name || 'Admin Platform',
      action: 'HAPUS_PESANAN',
      target: `Order #${targetOrder.order_number}`,
      details: `Pesanan #${targetOrder.order_number} (${targetOrder.recipient_name} - ${targetOrder.service_category}) dihapus permanen oleh admin.`,
      created_at: new Date().toISOString(),
    };
    const currentLogs = appState.auditLogs || [];
    const newState = { ...appState, orders: updatedOrders, auditLogs: [newLog, ...currentLogs] };
    saveAppState(newState);
    setAppState(newState);
    return { success: true, message: `Pesanan #${targetOrder.order_number} berhasil dihapus.` };
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    const idx = appState.orders.findIndex(o => o.id === orderId);
    if (idx === -1) return { success: false, message: 'Pesanan tidak ditemukan' };
    const updated = { ...appState.orders[idx], ...updates };
    const updatedOrders = [...appState.orders];
    updatedOrders[idx] = updated;

    const newLog: AdminAuditLog = {
      id: `log-${Date.now().toString(36)}`,
      admin_name: currentUser?.full_name || 'Admin Platform',
      action: 'UPDATE_PESANAN',
      target: `Order #${updated.order_number}`,
      details: `Admin memperbarui status: ${Object.keys(updates).join(', ')}`,
      created_at: new Date().toISOString(),
    };
    const currentLogs = appState.auditLogs || [];
    const newState = { ...appState, orders: updatedOrders, auditLogs: [newLog, ...currentLogs] };
    saveAppState(newState);
    setAppState(newState);
    return { success: true, message: 'Pesanan berhasil diperbarui.' };
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    return updateOrder(orderId, { order_status: status });
  };

  const updateEscrowStatus = (orderId: string, status: EscrowStatus) => {
    const updateData: Partial<Order> = { escrow_status: status };
    if (status === 'held') {
      const ord = appState.orders.find(o => o.id === orderId);
      if (ord && (ord.order_status === 'awaiting_applicants' || ord.order_status === 'draft')) {
        updateData.order_status = 'confirmed';
      }
    }
    const res = updateOrder(orderId, updateData);
    if (status === 'refunded') {
      const ord = appState.orders.find(o => o.id === orderId);
      if (ord) {
        // Refund back to customer's wallet
        const custIdx = appState.profiles.findIndex(p => p.id === ord.customer_id);
        if (custIdx !== -1) {
          const updatedCust = { ...appState.profiles[custIdx] };
          updatedCust.wallet_balance = (updatedCust.wallet_balance || 0) + ord.total_amount;
          const updatedProfiles = [...appState.profiles];
          updatedProfiles[custIdx] = updatedCust;
          const newState = { ...appState, profiles: updatedProfiles };
          saveAppState(newState);
          setAppState(newState);
        }
      }
    }
    return res;
  };

  const deleteUser = (userId: string) => {
    const targetUser = appState.profiles.find(p => p.id === userId);
    if (!targetUser) return { success: false, message: 'Pengguna tidak ditemukan' };

    const updatedProfiles = appState.profiles.filter(p => p.id !== userId);
    const updatedCaregivers = appState.caregivers.filter(c => c.user_id !== userId);

    const newLog: AdminAuditLog = {
      id: `log-${Date.now().toString(36)}`,
      admin_name: currentUser?.full_name || 'Admin Platform',
      action: 'HAPUS_PENGGUNA',
      target: `${targetUser.full_name} (${targetUser.role})`,
      details: `Akun email ${targetUser.email} dan seluruh data terkait dihapus permanen oleh admin.`,
      created_at: new Date().toISOString(),
    };
    const currentLogs = appState.auditLogs || [];
    const newState = {
      ...appState,
      profiles: updatedProfiles,
      caregivers: updatedCaregivers,
      auditLogs: [newLog, ...currentLogs],
      currentUserId: appState.currentUserId === userId ? null : appState.currentUserId,
    };
    saveAppState(newState);
    setAppState(newState);
    return { success: true, message: `Pengguna ${targetUser.full_name} berhasil dihapus.` };
  };

  const updateUser = (userId: string, updates: Partial<Profile>) => {
    const idx = appState.profiles.findIndex(p => p.id === userId);
    if (idx === -1) return { success: false, message: 'Pengguna tidak ditemukan' };
    const updated = { ...appState.profiles[idx], ...updates };
    const updatedProfiles = [...appState.profiles];
    updatedProfiles[idx] = updated;

    const newLog: AdminAuditLog = {
      id: `log-${Date.now().toString(36)}`,
      admin_name: currentUser?.full_name || 'Admin Platform',
      action: 'UPDATE_PENGGUNA',
      target: `${updated.full_name} (${updated.role})`,
      details: `Admin memperbarui data: ${Object.keys(updates).join(', ')}`,
      created_at: new Date().toISOString(),
    };
    const currentLogs = appState.auditLogs || [];
    const newState = { ...appState, profiles: updatedProfiles, auditLogs: [newLog, ...currentLogs] };
    saveAppState(newState);
    setAppState(newState);
    return { success: true, message: 'Pengguna berhasil diperbarui.' };
  };

  const resetUserPassword = (userId: string) => {
    const targetUser = appState.profiles.find(p => p.id === userId);
    if (!targetUser) return { success: false, message: 'Pengguna tidak ditemukan' };

    const tempPassword = 'carenest2026';
    const res = updateUser(userId, { password: tempPassword });
    if (!res.success) return res;

    const newLog: AdminAuditLog = {
      id: `log-${Date.now().toString(36)}`,
      admin_name: currentUser?.full_name || 'Admin Platform',
      action: 'RESET_PASSWORD',
      target: `${targetUser.full_name} (${targetUser.email})`,
      details: `Kata sandi direset oleh admin ke password sementara default: ${tempPassword}`,
      created_at: new Date().toISOString(),
    };
    const currentLogs = appState.auditLogs || [];
    const newState = { ...appState, auditLogs: [newLog, ...currentLogs] };
    saveAppState(newState);
    setAppState(newState);

    return { 
      success: true, 
      temporaryPassword: tempPassword,
      message: `Kata sandi ${targetUser.full_name} berhasil direset ke: ${tempPassword}` 
    };
  };

  const createUser = (data: Partial<Profile>) => {
    if (!data.full_name || !data.email) {
      return { success: false, error: 'Nama lengkap dan email wajib diisi!' };
    }
    const newId = `usr-${Date.now().toString(36)}`;
    const newProfile: Profile = {
      id: newId,
      email: data.email.toLowerCase().trim(),
      full_name: data.full_name.trim(),
      role: data.role || 'customer',
      phone: data.phone || '0812-0000-0000',
      avatar_url: data.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      city: data.city || 'Kota Surabaya',
      district: data.district || 'Gubeng',
      address: data.address || 'Surabaya',
      latitude: -7.2575,
      longitude: 112.7521,
      wallet_balance: data.wallet_balance || 0,
      nik_ktp: data.nik_ktp,
      is_verified: data.is_verified ?? true,
      password: data.password || 'carenest2026',
      created_at: new Date().toISOString(),
    };
    const updatedProfiles = [...appState.profiles, newProfile];
    const newLog: AdminAuditLog = {
      id: `log-${Date.now().toString(36)}`,
      admin_name: currentUser?.full_name || 'Admin Platform',
      action: 'TAMBAH_PENGGUNA',
      target: `${newProfile.full_name} (${newProfile.role})`,
      details: `Admin menambahkan akun baru email: ${newProfile.email}`,
      created_at: new Date().toISOString(),
    };
    const currentLogs = appState.auditLogs || [];
    const newState = { ...appState, profiles: updatedProfiles, auditLogs: [newLog, ...currentLogs] };
    saveAppState(newState);
    setAppState(newState);
    return { success: true, user: newProfile };
  };

  const verifyCaregiver = (caregiverId: string, status: boolean, badgeToAdd?: string) => {
    const cgIndex = appState.caregivers.findIndex(c => c.id === caregiverId || c.user_id === caregiverId);
    if (cgIndex === -1) return { success: false };

    const cg = { ...appState.caregivers[cgIndex] };
    cg.verified_ktp = status;
    cg.verified_skck = status;
    if (badgeToAdd && !cg.badges.includes(badgeToAdd)) {
      cg.badges = [...cg.badges, badgeToAdd];
    }
    const updatedCaregivers = [...appState.caregivers];
    updatedCaregivers[cgIndex] = cg;

    const pIndex = appState.profiles.findIndex(p => p.id === cg.user_id);
    let updatedProfiles = [...appState.profiles];
    if (pIndex !== -1) {
      updatedProfiles[pIndex] = { ...updatedProfiles[pIndex], is_verified: status };
    }

    const newLog: AdminAuditLog = {
      id: `log-${Date.now().toString(36)}`,
      admin_name: currentUser?.full_name || 'Admin Platform',
      action: status ? 'VERIFIKASI_TALENT_DISETUJUI' : 'VERIFIKASI_TALENT_DITOLAK',
      target: `${cg.name} (Caregiver)`,
      details: status 
        ? `KTP & SKCK Polda Jatim divalidasi. Lencana diterbitkan: ${badgeToAdd || 'Lulus Verifikasi'}`
        : 'Status verifikasi dicabut/ditolak oleh admin.',
      created_at: new Date().toISOString(),
    };
    const currentLogs = appState.auditLogs || [];
    const newState = {
      ...appState,
      caregivers: updatedCaregivers,
      profiles: updatedProfiles,
      auditLogs: [newLog, ...currentLogs]
    };
    saveAppState(newState);
    setAppState(newState);
    return { success: true };
  };

  const loginAdminDirect = (usernameOrEmail: string, password?: string) => {
    const clean = usernameOrEmail.toLowerCase().trim();
    if (clean === 'admin' || clean === 'admin@carenest.id' || clean.includes('admin')) {
      let adminProfile = appState.profiles.find(p => p.role === 'admin');
      if (!adminProfile) {
        adminProfile = {
          id: 'c4000000-0000-0000-0000-000000000001',
          email: 'admin@carenest.id',
          full_name: 'Admin Trust & Safety Surabaya',
          role: 'admin',
          phone: '0811-9999-000',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          city: 'Surabaya',
          district: 'Gubeng',
          address: 'CareNest Operations Hub Surabaya, Jl. Sumatra No. 10',
          latitude: -7.2711,
          longitude: 112.7495,
          wallet_balance: 0,
          nik_ktp: '3578010101900001',
          is_verified: true,
          password: 'admin123',
        };
        const updatedProfiles = [...appState.profiles, adminProfile];
        const newState = { ...appState, profiles: updatedProfiles, currentUserId: adminProfile.id };
        saveAppState(newState);
        setAppState(newState);
      } else {
        const newState = { ...appState, currentUserId: adminProfile.id };
        saveAppState(newState);
        setAppState(newState);
      }
      return { success: true };
    }
    return { success: false, error: 'Username admin tidak valid.' };
  };

  return (
    <CareNestContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        allProfiles: appState.profiles,
        caregivers: appState.caregivers,
        facilities: appState.facilities,
        recipients: appState.recipients,
        orders: appState.orders,
        bids: appState.bids,
        auditLogs: appState.auditLogs || [],
        gpsActive,
        currentGpsCoords,
        setGpsActive,
        loginAs,
        logout,
        switchRole,
        switchUser,
        createBooking,
        updateTaskStatus,
        releaseEscrow,
        addReview,
        applyToJob,
        acceptJobBid,
        cancelCaregiverSelection,
        simulateApplicant,
        registerTalent,
        registerCustomer,
        loginCustomerDirect,
        updateCaregiverProfile,
        refreshState,
        deleteOrder,
        updateOrder,
        updateOrderStatus,
        updateEscrowStatus,
        deleteUser,
        updateUser,
        resetUserPassword,
        createUser,
        verifyCaregiver,
        loginAdminDirect,
        addAuditLog,
      }}
    >
      {children}
    </CareNestContext.Provider>
  );
};

export const useCareNest = () => {
  const context = useContext(CareNestContext);
  if (!context) {
    throw new Error('useCareNest must be used within a CareNestProvider');
  }
  return context;
};
