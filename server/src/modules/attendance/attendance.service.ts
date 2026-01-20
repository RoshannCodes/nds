import { attendanceRepository } from './attendance.repository';
import { staffRepository } from '../staff/staff.repository';
import {
    CheckInDto,
    CheckOutDto,
    CreateAttendanceDto,
    UpdateAttendanceDto,
    GetAttendanceQueryDto,
} from './attendance.dto';
import {
    ConflictError,
    NotFoundError,
    BadRequestError,
} from '../../utils/errors';

/**
 * Attendance service
 * Handles attendance business logic
 */
export class AttendanceService {
    /**
     * Standard work start time (9:00 AM)
     * Arrivals after this are considered LATE
     */
    private readonly WORK_START_TIME = '09:00:00';

    /**
     * Check in staff
     */
    async checkIn(dto: CheckInDto) {
        const staff = await staffRepository.findById(dto.staffId);
        if (!staff) {
            throw new NotFoundError('Staff member not found');
        }

        const today = dto.date || new Date().toISOString().split('T')[0];
        const now = new Date();
        const currentTime = now.toTimeString().split(' ')[0];

        const existingAttendance = await attendanceRepository.findByStaffAndDate(
            dto.staffId,
            today
        );

        if (existingAttendance) {
            throw new ConflictError('Attendance already recorded for today');
        }

        const status = currentTime <= this.WORK_START_TIME ? 'PRESENT' : 'LATE';

        const attendance = await attendanceRepository.create({
            staffId: dto.staffId,
            date: today,
            checkInTime: currentTime,
            status,
        });

        return attendance;
    }

    /**
     * Check out staff
     */
    async checkOut(dto: CheckOutDto) {
        const staff = await staffRepository.findById(dto.staffId);
        if (!staff) {
            throw new NotFoundError('Staff member not found');
        }

        const today = dto.date || new Date().toISOString().split('T')[0];
        const currentTime = new Date().toTimeString().split(' ')[0];

        const existingAttendance = await attendanceRepository.findByStaffAndDate(
            dto.staffId,
            today
        );

        if (!existingAttendance) {
            throw new NotFoundError('No check-in record found for today');
        }

        if (existingAttendance.checkOutTime) {
            throw new ConflictError('Already checked out for today');
        }

        const updated = await attendanceRepository.update(existingAttendance.id, {
            checkOutTime: currentTime,
        });

        return updated;
    }

    /**
     * Get attendance records with filters
     */
    async getAttendance(query: GetAttendanceQueryDto) {
        const records = await attendanceRepository.findAll({
            staffId: query.staffId,
            startDate: query.startDate,
            endDate: query.endDate,
            status: query.status,
        });

        return records;
    }

    /**
     * Get attendance by ID
     */
    async getAttendanceById(id: string) {
        const attendance = await attendanceRepository.findById(id);

        if (!attendance) {
            throw new NotFoundError('Attendance record not found');
        }

        return attendance;
    }

    /**
     * Get attendance for specific staff member
     */
    async getStaffAttendance(staffId: string) {
        const staff = await staffRepository.findById(staffId);
        if (!staff) {
            throw new NotFoundError('Staff member not found');
        }

        const records = await attendanceRepository.findByStaffId(staffId);
        return records;
    }

    /**
     * Create attendance manually (Admin only)
     */
    async createAttendance(dto: CreateAttendanceDto) {
        const staff = await staffRepository.findById(dto.staffId);
        if (!staff) {
            throw new NotFoundError('Staff member not found');
        }

        const existingAttendance = await attendanceRepository.findByStaffAndDate(
            dto.staffId,
            dto.date
        );

        if (existingAttendance) {
            throw new ConflictError('Attendance already exists for this date');
        }

        const attendance = await attendanceRepository.create({
            staffId: dto.staffId,
            date: dto.date,
            checkInTime: dto.checkInTime,
            checkOutTime: dto.checkOutTime,
            status: dto.status,
        });

        return attendance;
    }

    /**
     * Update attendance (Admin only)
     */
    async updateAttendance(id: string, dto: UpdateAttendanceDto) {
        const existingAttendance = await attendanceRepository.findById(id);

        if (!existingAttendance) {
            throw new NotFoundError('Attendance record not found');
        }

        const updated = await attendanceRepository.update(id, dto);

        if (!updated) {
            throw new NotFoundError('Attendance record not found');
        }

        return updated;
    }

    /**
     * Delete attendance (Admin only)
     */
    async deleteAttendance(id: string) {
        const attendance = await attendanceRepository.findById(id);

        if (!attendance) {
            throw new NotFoundError('Attendance record not found');
        }

        const deleted = await attendanceRepository.delete(id);

        if (!deleted) {
            throw new NotFoundError('Attendance record not found');
        }

        return { message: 'Attendance record deleted successfully' };
    }

    /**
     * Get attendance statistics
     */
    async getStatistics(filters?: {
        staffId?: string;
        startDate?: string;
        endDate?: string;
    }) {
        const stats = await attendanceRepository.getStatistics(filters);
        return stats;
    }

    /**
     * Get today's attendance status for a staff member
     */
    async getTodayStatus(staffId: string) {
        const staff = await staffRepository.findById(staffId);
        if (!staff) {
            throw new NotFoundError('Staff member not found');
        }

        const today = new Date().toISOString().split('T')[0];
        const attendance = await attendanceRepository.findByStaffAndDate(
            staffId,
            today
        );

        return {
            hasCheckedIn: !!attendance,
            hasCheckedOut: !!attendance?.checkOutTime,
            attendance: attendance || null,
        };
    }
}

export const attendanceService = new AttendanceService();
