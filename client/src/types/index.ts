// User and Authentication Types
export type UserRole = 'ADMIN' | 'STAFF';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Staff Types - matches server response (password excluded)
export interface Staff {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface StaffStatistics {
  total: number;
  admins: number;
  staff: number;
}

// Attendance Types - matches server schema exactly
export type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT';

export interface Attendance {
  id: string;
  staffId: string;
  date: string; // YYYY-MM-DD format
  checkInTime: string | null; // HH:MM:SS format or null
  checkOutTime: string | null; // HH:MM:SS format or null
  status: AttendanceStatus;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// Attendance with staff info (for admin views)
export interface AttendanceWithStaff extends Attendance {
  staff: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface TodayAttendanceStatus {
  hasCheckedIn: boolean;
  hasCheckedOut: boolean;
  attendance: Attendance | null;
}

export interface AttendanceStatistics {
  total: number;
  present: number;
  late: number;
  absent: number;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface CreateStaffFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface UpdateStaffFormData {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

export interface UpdatePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CreateAttendanceFormData {
  staffId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: AttendanceStatus;
}

export interface UpdateAttendanceFormData {
  checkInTime?: string;
  checkOutTime?: string;
  status?: AttendanceStatus;
}

// Filter Types
export interface AttendanceFilters {
  staffId?: string;
  startDate?: string;
  endDate?: string;
  status?: AttendanceStatus;
}
