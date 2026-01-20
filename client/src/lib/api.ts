import {
  AuthResponse,
  User,
  Staff,
  StaffStatistics,
  Attendance,
  TodayAttendanceStatus,
  AttendanceStatistics,
  CreateStaffFormData,
  UpdateStaffFormData,
  UpdatePasswordFormData,
  CreateAttendanceFormData,
  UpdateAttendanceFormData,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Get token from localStorage
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

/**
 * Save token to localStorage
 */
export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
};

/**
 * Remove token from localStorage
 */
export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
};

/**
 * Get authorization headers
 */
const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * API client with automatic error handling
 */
async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }

    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
}

/**
 * API methods
 */
export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getProfile: () => apiClient<User>('/auth/me'),

  // Staff
  getStaffList: () => apiClient<Staff[]>('/staff'),
  
  getStaffById: (id: string) => apiClient<Staff>(`/staff/${id}`),
  
  getStaffStatistics: () => apiClient<StaffStatistics>('/staff/statistics'),
  
  createStaff: (data: CreateStaffFormData) =>
    apiClient<Staff>('/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateStaff: (id: string, data: UpdateStaffFormData) =>
    apiClient<Staff>(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  updatePassword: (id: string, data: UpdatePasswordFormData) =>
    apiClient<{ message: string }>(`/staff/${id}/password`, {
      method: 'PUT',
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    }),
  
  deleteStaff: (id: string) =>
    apiClient<void>(`/staff/${id}`, {
      method: 'DELETE',
    }),

  // Attendance
  checkIn: () =>
    apiClient<Attendance>('/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify({}),
    }),
  
  checkOut: () =>
    apiClient<Attendance>('/attendance/check-out', {
      method: 'POST',
      body: JSON.stringify({}),
    }),
  
  getTodayStatus: () => apiClient<TodayAttendanceStatus>('/attendance/today'),
  
  getAttendanceStatistics: () => apiClient<AttendanceStatistics>('/attendance/statistics'),
  
  getAttendanceList: (params?: Record<string, string>) => {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString();
    return apiClient<Attendance[]>(`/attendance${query ? `?${query}` : ''}`);
  },
  
  getAttendanceById: (id: string) => apiClient<Attendance>(`/attendance/${id}`),
  
  createAttendance: (data: CreateAttendanceFormData) =>
    apiClient<Attendance>('/attendance', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateAttendance: (id: string, data: UpdateAttendanceFormData) =>
    apiClient<Attendance>(`/attendance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  deleteAttendance: (id: string) =>
    apiClient<void>(`/attendance/${id}`, {
      method: 'DELETE',
    }),
};
