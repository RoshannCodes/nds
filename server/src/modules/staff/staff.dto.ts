import { z } from 'zod';

/**
 * Create staff DTO
 */
export const createStaffSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    role: z.enum(['ADMIN', 'STAFF']).optional(),
});

export type CreateStaffDto = z.infer<typeof createStaffSchema>;

/**
 * Update staff DTO
 */
export const updateStaffSchema = z.object({
    email: z.email('Invalid email address').optional(),
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    role: z.enum(['ADMIN', 'STAFF']).optional(),
});

export type UpdateStaffDto = z.infer<typeof updateStaffSchema>;

/**
 * Update password DTO
 */
export const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export type UpdatePasswordDto = z.infer<typeof updatePasswordSchema>;
