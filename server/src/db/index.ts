import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

/**
 * PostgreSQL connection client
 */
const client = postgres(process.env.DATABASE_URL, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
});

/**
 * Drizzle database instance
 * Configured with all schemas
 */
export const db = drizzle(client, { schema });

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
    try {
        await client`SELECT 1`;
        console.log('Database connection successful');
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}

export default db;
