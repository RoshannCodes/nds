import { Router } from 'express';
import { attendanceController } from './attendance.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import {
    createAttendanceSchema,
    updateAttendanceSchema,
} from './attendance.dto';

const router = Router();

/**
 * All attendance routes require authentication
 */
router.use(authenticate);

/**
 * POST /api/attendance/check-in
 * Check in for today
 */
router.post(
    '/check-in',
    attendanceController.checkIn.bind(attendanceController)
);

/**
 * POST /api/attendance/check-out
 * Check out for today
 */
router.post(
    '/check-out',
    attendanceController.checkOut.bind(attendanceController)
);

/**
 * GET /api/attendance/today
 * Get today's attendance status
 */
router.get(
    '/today',
    attendanceController.getTodayStatus.bind(attendanceController)
);

/**
 * GET /api/attendance/statistics
 * Get attendance statistics
 */
router.get(
    '/statistics',
    attendanceController.getStatistics.bind(attendanceController)
);

/**
 * POST /api/attendance
 * Create attendance manually (Admin only)
 */
router.post(
    '/',
    authorize('ADMIN'),
    validateRequest(createAttendanceSchema),
    attendanceController.create.bind(attendanceController)
);

/**
 * GET /api/attendance
 * Get all attendance records
 * Admin sees all, staff sees only their own
 */
router.get(
    '/',
    attendanceController.getAll.bind(attendanceController)
);

/**
 * GET /api/attendance/:id
 * Get attendance by ID
 */
router.get(
    '/:id',
    attendanceController.getById.bind(attendanceController)
);

/**
 * PUT /api/attendance/:id
 * Update attendance (Admin only)
 */
router.put(
    '/:id',
    authorize('ADMIN'),
    validateRequest(updateAttendanceSchema),
    attendanceController.update.bind(attendanceController)
);

/**
 * DELETE /api/attendance/:id
 * Delete attendance (Admin only)
 */
router.delete(
    '/:id',
    authorize('ADMIN'),
    attendanceController.delete.bind(attendanceController)
);

export default router;
