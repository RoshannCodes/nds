import { Response, NextFunction } from 'express';
import { sendSuccessResponse } from '../../utils/response';
import { authService } from './auth.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { LoginDto } from './auth.dto';

/**
 * Auth controller
 * Handles authentication HTTP requests
 */
export class AuthController {
    /**
     * Login endpoint
     * POST /api/auth/login
     */
    async login(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const dto: LoginDto = req.body;
            const result = await authService.login(dto);

            return sendSuccessResponse(res, result, 'Login successful');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get current user profile
     * GET /api/auth/me
     */
    async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new Error('User not authenticated');
            }

            const profile = await authService.getProfile(req.user.staffId);

            return sendSuccessResponse(res, profile);
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();
