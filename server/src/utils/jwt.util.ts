import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors';

export interface JwtPayload {
    staffId: string;
    email: string;
    role: 'ADMIN' | 'STAFF';
}

/**
 * Generate JWT access token
 */
export function generateToken(payload: JwtPayload): string {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }

    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): JwtPayload {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }

    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;
        return decoded;
    } catch (error) {
        throw new UnauthorizedError('Invalid or expired token');
    }
}
