import { Router } from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { loginSchema } from './auth.dto';

const router = Router();

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post(
    '/login',
    validateRequest(loginSchema),
    authController.login.bind(authController)
);

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get(
    '/me',
    authenticate,
    authController.getProfile.bind(authController)
);

export default router;
