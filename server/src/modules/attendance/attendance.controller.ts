import { Response, NextFunction } from 'express';
import { sendSuccessResponse } from '../../utils/response';
import { attendanceService } from './attendance.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import {
    CheckInDto,
    CheckOutDto,
    CreateAttendanceDto,
    UpdateAttendanceDto,
    GetAttendanceQueryDto,
} from './attendance.dto';

/**
 * Attendance controller
 * Handles attendance HTTP requests
 */
export class AttendanceController {
    /**
     * Check in
     * POST /api/attendance/check-in
     */
    async checkIn(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new Error('User not authenticated');
            }

            const dto: CheckInDto = {
                staffId: req.user.staffId,
                date: req.body.date,
            };

            const attendance = await attendanceService.checkIn(dto);

            return sendSuccessResponse(res, attendance, 'Checked in successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Check out
     * POST /api/attendance/check-out
     */
    async checkOut(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new Error('User not authenticated');
            }

            const dto: CheckOutDto = {
                staffId: req.user.staffId,
                date: req.body.date,
            };

            const attendance = await attendanceService.checkOut(dto);

            return sendSuccessResponse(res, attendance, 'Checked out successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get today's status
     * GET /api/attendance/today
     */
    async getTodayStatus(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new Error('User not authenticated');
            }

            const status = await attendanceService.getTodayStatus(req.user.staffId);

            return sendSuccessResponse(res, status);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all attendance with filters
     * GET /api/attendance
     */
    async getAll(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new Error('User not authenticated');
            }

            const query: GetAttendanceQueryDto = {
                staffId: req.user.role === 'STAFF' ? req.user.staffId : (req.query.staffId as string),
                startDate: req.query.startDate as string,
                endDate: req.query.endDate as string,
                status: req.query.status as 'PRESENT' | 'LATE' | 'ABSENT',
            };

            const attendance = await attendanceService.getAttendance(query);

            return sendSuccessResponse(res, attendance);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get attendance by ID
     * GET /api/attendance/:id
     */
    async getById(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const attendance = await attendanceService.getAttendanceById(id as string);

            return sendSuccessResponse(res, attendance);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create attendance manually (Admin only)
     * POST /api/attendance
     */
    async create(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const dto: CreateAttendanceDto = req.body;
            const attendance = await attendanceService.createAttendance(dto);

            return sendSuccessResponse(res, attendance, 'Attendance record created successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update attendance (Admin only)
     * PUT /api/attendance/:id
     */
    async update(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const dto: UpdateAttendanceDto = req.body;
            const attendance = await attendanceService.updateAttendance(id as string, dto);

            return sendSuccessResponse(res, attendance, 'Attendance record updated successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete attendance (Admin only)
     * DELETE /api/attendance/:id
     */
    async delete(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await attendanceService.deleteAttendance(id as string);

            return sendSuccessResponse(res, null, result.message);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get attendance statistics
     * GET /api/attendance/statistics
     */
    async getStatistics(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new Error('User not authenticated');
            }

            const filters = {
                staffId: req.user.role === 'STAFF' ? req.user.staffId : (req.query.staffId as string),
                startDate: req.query.startDate as string,
                endDate: req.query.endDate as string,
            };

            const stats = await attendanceService.getStatistics(filters);

            return sendSuccessResponse(res, stats);
        } catch (error) {
            next(error);
        }
    }
}

export const attendanceController = new AttendanceController();
