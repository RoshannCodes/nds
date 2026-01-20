import { Router } from 'express';
import { staffController } from './staff.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import {
    createStaffSchema,
    updateStaffSchema,
    updatePasswordSchema,
} from './staff.dto';

const router = Router();

/**
 * All staff routes require authentication
 */
router.use(authenticate);

/**
 * GET /api/staff/statistics
 * Get staff statistics (Admin only)
 */
router.get(
    '/statistics',
    authorize('ADMIN'),
    staffController.getStatistics.bind(staffController)
);

/**
 * POST /api/staff
 * Create new staff member (Admin only)
 */
router.post(
    '/',
    authorize('ADMIN'),
    validateRequest(createStaffSchema),
    staffController.create.bind(staffController)
);

/**
 * GET /api/staff
 * Get all staff members (Admin only)
 */
router.get(
    '/',
    authorize('ADMIN'),
    staffController.getAll.bind(staffController)
);

/**
 * GET /api/staff/:id
 * Get staff by ID (Admin only)
 */
router.get(
    '/:id',
    authorize('ADMIN'),
    staffController.getById.bind(staffController)
);

/**
 * PUT /api/staff/:id
 * Update staff information (Admin only)
 */
router.put(
    '/:id',
    authorize('ADMIN'),
    validateRequest(updateStaffSchema),
    staffController.update.bind(staffController)
);

/**
 * PUT /api/staff/:id/password
 * Update staff password (Admin or self)
 */
router.put(
    '/:id/password',
    validateRequest(updatePasswordSchema),
    staffController.updatePassword.bind(staffController)
);

/**
 * DELETE /api/staff/:id
 * Delete staff member (Admin only)
 */
router.delete(
    '/:id',
    authorize('ADMIN'),
    staffController.delete.bind(staffController)
);

export default router;
