import { Response, NextFunction } from 'express';
import { sendSuccessResponse } from '../../utils/response';
import { staffService } from './staff.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { CreateStaffDto, UpdateStaffDto, UpdatePasswordDto } from './staff.dto';

/**
 * Staff controller
 * Handles staff HTTP requests
 */
export class StaffController {
    /**
     * Create new staff
     * POST /api/staff
     */
    async create(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const dto: CreateStaffDto = req.body;
            const staff = await staffService.createStaff(dto);

            return sendSuccessResponse(res, staff, 'Staff member created successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all staff
     * GET /api/staff
     */
    async getAll(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const staff = await staffService.getAllStaff();

            return sendSuccessResponse(res, staff);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get staff by ID
     * GET /api/staff/:id
     */
    async getById(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const staff = await staffService.getStaffById(id as string);

            return sendSuccessResponse(res, staff);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update staff
     * PUT /api/staff/:id
     */
    async update(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const dto: UpdateStaffDto = req.body;
            const staff = await staffService.updateStaff(id as string, dto);

            return sendSuccessResponse(res, staff, 'Staff member updated successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update password
     * PUT /api/staff/:id/password
     */
    async updatePassword(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const dto: UpdatePasswordDto = req.body;

            if (!req.user) {
                throw new Error('User not authenticated');
            }

            if (req.user.role !== 'ADMIN' && req.user.staffId !== id) {
                throw new Error('You can only update your own password');
            }

            const result = await staffService.updatePassword(id as string, dto);

            return sendSuccessResponse(res, null, result.message);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete staff
     * DELETE /api/staff/:id
     */
    async delete(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await staffService.deleteStaff(id as string);

            return sendSuccessResponse(res, null, result.message);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get staff statistics
     * GET /api/staff/stats
     */
    async getStatistics(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const stats = await staffService.getStatistics();

            return sendSuccessResponse(res, stats);
        } catch (error) {
            next(error);
        }
    }
}

export const staffController = new StaffController();
