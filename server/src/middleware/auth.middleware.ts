import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt.util';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

/**
 * Extend Express Request to include authenticated user
 */
export interface AuthRequest extends Request {
    user?: JwtPayload;
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export function authenticate(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('No token provided');
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);

        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Authorization middleware
 * Checks if user has required role
 */
export function authorize(...roles: Array<'ADMIN' | 'STAFF'>) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new UnauthorizedError('Authentication required');
            }

            if (!roles.includes(req.user.role)) {
                throw new ForbiddenError('Insufficient permissions');
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}
