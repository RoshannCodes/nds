import { pgTable, uuid, date, time, timestamp, pgEnum, unique } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { staff } from './staff.schema';

/**
 * Attendance status enum
 */
export const attendanceStatusEnum = pgEnum('attendance_status', [
    'PRESENT',
    'LATE',
    'ABSENT',
]);

/**
 * Attendance table schema
 * Manages daily attendance records for staff
 * One record per staff per day
 */
export const attendance = pgTable('attendance', {
    id: uuid('id').primaryKey().defaultRandom(),
    staffId: uuid('staff_id')
        .notNull()
        .references(() => staff.id, { onDelete: 'cascade' }),
    date: date('date').notNull(),
    checkInTime: time('check_in_time'),
    checkOutTime: time('check_out_time'),
    status: attendanceStatusEnum('status').notNull().default('ABSENT'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
        unique("unique_staff_date").on(
            table.staffId,
            table.date,
        ),
    ]
)

// Zod schemas for validation
export const insertAttendanceSchema = createInsertSchema(attendance, {
    staffId: z.uuid('Invalid staff ID'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    checkInTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Time must be in HH:MM:SS format').optional(),
    checkOutTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Time must be in HH:MM:SS format').optional(),
    status: z.enum(['PRESENT', 'LATE', 'ABSENT']).optional(),
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export const selectAttendanceSchema = createSelectSchema(attendance);

export const updateAttendanceSchema = insertAttendanceSchema.partial().omit({
    staffId: true,
    date: true,
});

// TypeScript types
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type UpdateAttendance = z.infer<typeof updateAttendanceSchema>;
