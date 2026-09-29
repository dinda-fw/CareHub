// CareNest Indonesia - TypeScript Definitions (PRD v2.0)

export type UserRole = 'customer' | 'caregiver' | 'facility' | 'admin';
export type ServiceCategory = 'child' | 'elderly' | 'pet';
export type FulfillmentType = 'home_visit' | 'partner_facility';
export type PackageType = 'daily' | 'weekly' | 'monthly';
export type EscrowStatus = 'pending' | 'held' | 'released' | 'refunded';
export type OrderStatus = 'draft' | 'awaiting_applicants' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone: string;
  avatar_url: string;
  city: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  wallet_balance: number;
  nik_ktp?: string;
  is_verified?: boolean;
  password?: string;
  created_at?: string;
}

export interface CaregiverProfile {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string;
  bio: string;
  education: string;
  experience_years: number;
  hourly_rate: number;
  rating: number;
  total_reviews: number;
  total_orders_completed: number;
  verified_ktp: boolean;
  verified_skck: boolean;
  badges: string[];
  service_categories: ServiceCategory[];
  service_areas: string[];
  is_available: boolean;
  district: string;
  latitude: number;
  longitude: number;
}

export interface Facility {
  id: string;
  name: string;
  category: 'child_daycare' | 'pet_hotel_care' | 'elderly_daycare' | 'clinic_care';
  category_label: string;
  city: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  daily_rate: number;
  hourly_rate: number;
  capacity: number;
  slots_available: number;
  rating: number;
  review_count: number;
  amenities: string[];
  photos: string[];
  phone: string;
  is_verified: boolean;
  operating_hours: string;
}

export interface CareRecipient {
  id: string;
  customer_id: string;
  name: string;
  type: ServiceCategory;
  age_or_details: string;
  gender_or_breed: string;
  special_needs: string;
  allergies: string;
  emergency_contact: string;
  caregiver_criteria?: string;
}

export interface OrderTask {
  id: string;
  order_id: string;
  title: string;
  description: string;
  scheduled_time: string;
  is_required_photo: boolean;
  is_required_gps: boolean;
  status: TaskStatus;
  completed_at?: string;
  completed_by?: string;
  evidence?: TaskEvidence;
}

export interface TaskEvidence {
  id: string;
  task_id: string;
  order_id: string;
  photo_url: string;
  notes: string;
  latitude: number;
  longitude: number;
  address_snapshot?: string;
  addressSnapshot?: string;
  submitted_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  caregiver_id?: string;
  caregiver_name?: string;
  caregiver_avatar?: string;
  caregiver_phone?: string;
  facility_id?: string;
  facility_name?: string;
  facility_address?: string;
  recipient_id: string;
  recipient_name: string;
  recipient_type: ServiceCategory;
  recipient_details: string;
  caregiver_criteria?: string;
  fulfillment_type: FulfillmentType;
  service_category: ServiceCategory;
  package_type: PackageType;
  duration_hours: number;
  days_count: number;
  scheduled_start: string; // ISO String
  scheduled_end: string;
  service_address: string;
  city?: string;
  district: string;
  latitude: number;
  longitude: number;
  base_price: number;
  discount_amount: number;
  platform_fee: number;
  total_amount: number;
  escrow_status: EscrowStatus;
  order_status: OrderStatus;
  progress_percentage: number;
  notes?: string;
  tasks: OrderTask[];
  created_at: string;
  reviewed?: boolean;
}

export interface JobBid {
  id: string;
  order_id: string;
  caregiver_id: string;
  caregiver_name: string;
  caregiver_rating: number;
  caregiver_avatar: string;
  proposed_rate: number;
  proposal_note: string;
  status: 'submitted' | 'accepted' | 'rejected';
  created_at: string;
  education?: string;
  experience_years?: number;
  verified_skck?: boolean;
  verified_ktp?: boolean;
  badges?: string[];
  bio?: string;
  phone?: string;
}

export interface Review {
  id: string;
  order_id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  target_id: string;
  target_type: 'caregiver' | 'facility';
  rating: number;
  comment: string;
  created_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_name: string;
  action: string;
  target: string;
  details: string;
  created_at: string;
}

