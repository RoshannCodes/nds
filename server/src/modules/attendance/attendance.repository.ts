import { eq, and, gte, lte, desc } from 'drizzle-orm';
import { db } from '../../db';
import { attendance, Attendance, InsertAttendance } from '../../db/schema';

/**
 * Attendance repository
 * Handles database operations for attendance
 */
export class AttendanceRepository {
    /**
     * Create attendance record
     */
    async create(data: InsertAttendance): Promise<Attendance> {
        const [newAttendance] = await db.insert(attendance).values(data).returning();
        return newAttendance;
    }

    /**
     * Find attendance by ID
     */
    async findById(id: string): Promise<Attendance | undefined> {
        return await db.query.attendance.findFirst({
            where: eq(attendance.id, id),
        });
    }

    /**
     * Find attendance by staff ID and date
     */
    async findByStaffAndDate(
        staffId: string,
        date: string
    ): Promise<Attendance | undefined> {
        return await db.query.attendance.findFirst({
            where: and(
                eq(attendance.staffId, staffId),
                eq(attendance.date, date)
            ),
        });
    }

    /**
     * Get all attendance records with optional filters
     */
    async findAll(filters?: {
        staffId?: string;
        startDate?: string;
        endDate?: string;
        status?: 'PRESENT' | 'LATE' | 'ABSENT';
    }): Promise<Attendance[]> {
        const conditions = [];

        if (filters?.staffId) {
            conditions.push(eq(attendance.staffId, filters.staffId));
        }

        if (filters?.startDate) {
            conditions.push(gte(attendance.date, filters.startDate));
        }

        if (filters?.endDate) {
            conditions.push(lte(attendance.date, filters.endDate));
        }

        if (filters?.status) {
            conditions.push(eq(attendance.status, filters.status));
        }

        return await db.query.attendance.findMany({
            where: conditions.length > 0 ? and(...conditions) : undefined,
            orderBy: [desc(attendance.date), desc(attendance.createdAt)],
        });
    }

    /**
     * Get attendance for a specific staff member
     */
    async findByStaffId(staffId: string): Promise<Attendance[]> {
        return await db.query.attendance.findMany({
            where: eq(attendance.staffId, staffId),
            orderBy: [desc(attendance.date)],
        });
    }

    /**
     * Update attendance record
     */
    async update(
        id: string,
        data: Partial<InsertAttendance>
    ): Promise<Attendance | undefined> {
        const [updated] = await db
            .update(attendance)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(attendance.id, id))
            .returning();
        return updated;
    }

    /**
     * Delete attendance record
     */
    async delete(id: string): Promise<boolean> {
        const result = await db.delete(attendance).where(eq(attendance.id, id)).returning();
        return result.length > 0;
    }

    /**
     * Get attendance statistics
     */
    async getStatistics(filters?: {
        staffId?: string;
        startDate?: string;
        endDate?: string;
    }) {
        const records = await this.findAll(filters);

        const total = records.length;
        const present = records.filter((r) => r.status === 'PRESENT').length;
        const late = records.filter((r) => r.status === 'LATE').length;
        const absent = records.filter((r) => r.status === 'ABSENT').length;

        return { total, present, late, absent };
    }
}

export const attendanceRepository = new AttendanceRepository();
