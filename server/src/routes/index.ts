import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import staffRoutes from '../modules/staff/staff.routes';
import attendanceRoutes from '../modules/attendance/attendance.routes';

const router = Router();

/**
 * Mount all module routes
 */
router.use('/auth', authRoutes);
router.use('/staff', staffRoutes);
router.use('/attendance', attendanceRoutes);

export default router;
