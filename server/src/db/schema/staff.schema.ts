import { pgTable, uuid, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

/**
 * Role enum for staff members
 */
export const roleEnum = pgEnum('role', ['ADMIN', 'STAFF']);

/**
 * Staff table schema
 * Manages staff/user data and authentication
 */
export const staff = pgTable('staff', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    role: roleEnum('role').notNull().default('STAFF'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Zod schemas for validation
export const insertStaffSchema = createInsertSchema(staff, {
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    role: z.enum(['ADMIN', 'STAFF']).optional(),
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export const selectStaffSchema = createSelectSchema(staff);

export const updateStaffSchema = insertStaffSchema.partial();

// TypeScript types
export type Staff = typeof staff.$inferSelect;
export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type UpdateStaff = z.infer<typeof updateStaffSchema>;
