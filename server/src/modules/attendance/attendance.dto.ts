import { z } from 'zod';

/**
 * Check-in DTO
 */
export const checkInSchema = z.object({
    staffId: z.uuid('Invalid staff ID'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
});

export type CheckInDto = z.infer<typeof checkInSchema>;

/**
 * Check-out DTO
 */
export const checkOutSchema = z.object({
    staffId: z.uuid('Invalid staff ID'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
});

export type CheckOutDto = z.infer<typeof checkOutSchema>;

/**
 * Get attendance query DTO
 */
export const getAttendanceQuerySchema = z.object({
    staffId: z.uuid('Invalid staff ID').optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    status: z.enum(['PRESENT', 'LATE', 'ABSENT']).optional(),
});

export type GetAttendanceQueryDto = z.infer<typeof getAttendanceQuerySchema>;

/**
 * Manual attendance creation DTO (Admin only)
 */
export const createAttendanceSchema = z.object({
    staffId: z.uuid('Invalid staff ID'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    checkInTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format').optional(),
    checkOutTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format').optional(),
    status: z.enum(['PRESENT', 'LATE', 'ABSENT']),
});

export type CreateAttendanceDto = z.infer<typeof createAttendanceSchema>;

/**
 * Update attendance DTO (Admin only)
 */
export const updateAttendanceSchema = z.object({
    checkInTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Time must be in HH:MM:SS format').optional(),
    checkOutTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Time must be in HH:MM:SS format').optional(),
    status: z.enum(['PRESENT', 'LATE', 'ABSENT']).optional(),
});

export type UpdateAttendanceDto = z.infer<typeof updateAttendanceSchema>;
