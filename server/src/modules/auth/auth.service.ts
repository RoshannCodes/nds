import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { staff } from '../../db/schema';
import { comparePassword } from '../../utils/password.util';
import { generateToken } from '../../utils/jwt.util';
import { UnauthorizedError } from '../../utils/errors';
import { LoginDto } from './auth.dto';

/**
 * Auth service
 * Handles authentication business logic
 */
export class AuthService {
    /**
     * Login user and generate JWT token
     */
    async login(dto: LoginDto) {
        const user = await db.query.staff.findFirst({
            where: eq(staff.email, dto.email),
        });

        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const isPasswordValid = await comparePassword(dto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const token = generateToken({
            staffId: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }

    /**
     * Get current user profile
     */
    async getProfile(staffId: string) {
        const user = await db.query.staff.findFirst({
            where: eq(staff.id, staffId),
        });

        if (!user) {
            throw new UnauthorizedError('User not found');
        }

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            createdAt: user.createdAt,
        };
    }
}

export const authService = new AuthService();
