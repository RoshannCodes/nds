import { db } from '../db';
import { staff } from '../db/schema';
import { hashPassword } from '../utils/password.util';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Seed database with initial data
 */
async function seed() {
    try {
        console.log('Starting database seed...');

        // Create admin user
        const adminPassword = await hashPassword('admin123');

        await db.insert(staff).values({
            email: 'admin@example.com',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
        });

        console.log('Admin user created:');
        console.log('  Email: admin@example.com');
        console.log('  Password: admin123');

        // Create test staff user
        const staffPassword = await hashPassword('staff123');

        await db.insert(staff).values({
            email: 'staff@example.com',
            password: staffPassword,
            firstName: 'Test',
            lastName: 'Staff',
            role: 'STAFF',
        });

        console.log('Staff user created:');
        console.log('  Email: staff@example.com');
        console.log('  Password: staff123');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
}

seed();
