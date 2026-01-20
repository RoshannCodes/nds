import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { staff, InsertStaff, UpdateStaff, Staff } from '../../db/schema';

/**
 * Staff repository
 * Handles database operations for staff
 */
export class StaffRepository {
    /**
     * Create a new staff member
     */
    async create(data: InsertStaff): Promise<Staff> {
        const [newStaff] = await db.insert(staff).values(data).returning();
        return newStaff;
    }

    /**
     * Find staff by ID
     */
    async findById(id: string): Promise<Staff | undefined> {
        return await db.query.staff.findFirst({
            where: eq(staff.id, id),
        });
    }

    /**
     * Find staff by email
     */
    async findByEmail(email: string): Promise<Staff | undefined> {
        return await db.query.staff.findFirst({
            where: eq(staff.email, email),
        });
    }

    /**
     * Get all staff members
     */
    async findAll(): Promise<Staff[]> {
        return await db.query.staff.findMany({
            orderBy: (staff, { desc }) => [desc(staff.createdAt)],
        });
    }

    /**
     * Update staff by ID
     */
    async update(id: string, data: UpdateStaff): Promise<Staff | undefined> {
        const [updated] = await db
            .update(staff)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(staff.id, id))
            .returning();
        return updated;
    }

    /**
     * Delete staff by ID
     */
    async delete(id: string): Promise<boolean> {
        const result = await db.delete(staff).where(eq(staff.id, id)).returning();
        return result.length > 0;
    }

    /**
     * Count total staff
     */
    async count(): Promise<number> {
        const result = await db.select().from(staff);
        return result.length;
    }
}

export const staffRepository = new StaffRepository();
