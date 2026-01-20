import { z } from 'zod';

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Create Staff Schema
export const createStaffSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  role: z.enum(['ADMIN', 'STAFF']).default('STAFF'),
});

// Update Staff Schema
export const updateStaffSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  role: z.enum(['ADMIN', 'STAFF']).optional(),
});

// Update Password Schema
export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Create Attendance Schema
export const createAttendanceSchema = z.object({
  staffId: z.string().uuid('Invalid staff ID'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  checkInTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format')
    .optional()
    .or(z.literal('')),
  checkOutTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format')
    .optional()
    .or(z.literal('')),
  status: z.enum(['PRESENT', 'LATE', 'ABSENT']),
});

// Update Attendance Schema
export const updateAttendanceSchema = z.object({
  checkInTime: z
    .string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, 'Time must be in HH:MM:SS format')
    .optional()
    .or(z.literal('')),
  checkOutTime: z
    .string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, 'Time must be in HH:MM:SS format')
    .optional()
    .or(z.literal('')),
  status: z.enum(['PRESENT', 'LATE', 'ABSENT']).optional(),
});
