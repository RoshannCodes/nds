import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Run database migrations
 */
async function runMigrations() {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is not set');
    }

    const connection = postgres(process.env.DATABASE_URL, { max: 1 });
    const db = drizzle(connection);

    console.log('Running migrations...');

    try {
        await migrate(db, { migrationsFolder: './src/db/migrations' });
        console.log('Migrations completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }

    await connection.end();
    process.exit(0);
}

runMigrations();
