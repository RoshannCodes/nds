import { staffRepository } from './staff.repository';
import { hashPassword, comparePassword } from '../../utils/password.util';
import { CreateStaffDto, UpdateStaffDto, UpdatePasswordDto } from './staff.dto';
import { ConflictError, NotFoundError, BadRequestError } from '../../utils/errors';

/**
 * Staff service
 * Handles staff business logic
 */
export class StaffService {
    /**
     * Create a new staff member
     */
    async createStaff(dto: CreateStaffDto) {
        const existingStaff = await staffRepository.findByEmail(dto.email);

        if (existingStaff) {
            throw new ConflictError('Email already exists');
        }

        const hashedPassword = await hashPassword(dto.password);

        const newStaff = await staffRepository.create({
            email: dto.email,
            password: hashedPassword,
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: dto.role || 'STAFF',
        });

        const { password, ...staffWithoutPassword } = newStaff;
        return staffWithoutPassword;
    }

    /**
     * Get all staff members
     */
    async getAllStaff() {
        const allStaff = await staffRepository.findAll();

        return allStaff.map(({ password, ...staff }) => staff);
    }

    /**
     * Get staff by ID
     */
    async getStaffById(id: string) {
        const staff = await staffRepository.findById(id);

        if (!staff) {
            throw new NotFoundError('Staff member not found');
        }

        const { password, ...staffWithoutPassword } = staff;
        return staffWithoutPassword;
    }

    /**
     * Update staff information
     */
    async updateStaff(id: string, dto: UpdateStaffDto) {
        const existingStaff = await staffRepository.findById(id);

        if (!existingStaff) {
            throw new NotFoundError('Staff member not found');
        }

        if (dto.email && dto.email !== existingStaff.email) {
            const emailExists = await staffRepository.findByEmail(dto.email);
            if (emailExists) {
                throw new ConflictError('Email already exists');
            }
        }

        const updated = await staffRepository.update(id, dto);

        if (!updated) {
            throw new NotFoundError('Staff member not found');
        }

        const { password, ...staffWithoutPassword } = updated;
        return staffWithoutPassword;
    }

    /**
     * Update staff password
     */
    async updatePassword(id: string, dto: UpdatePasswordDto) {
        const staff = await staffRepository.findById(id);

        if (!staff) {
            throw new NotFoundError('Staff member not found');
        }

        const isPasswordValid = await comparePassword(dto.currentPassword, staff.password);

        if (!isPasswordValid) {
            throw new BadRequestError('Current password is incorrect');
        }

        const hashedPassword = await hashPassword(dto.newPassword);
        await staffRepository.update(id, { password: hashedPassword });

        return { message: 'Password updated successfully' };
    }

    /**
     * Delete staff member
     */
    async deleteStaff(id: string) {
        const staff = await staffRepository.findById(id);

        if (!staff) {
            throw new NotFoundError('Staff member not found');
        }

        const deleted = await staffRepository.delete(id);

        if (!deleted) {
            throw new NotFoundError('Staff member not found');
        }

        return { message: 'Staff member deleted successfully' };
    }

    /**
     * Get staff statistics
     */
    async getStatistics() {
        const allStaff = await staffRepository.findAll();

        const total = allStaff.length;
        const admins = allStaff.filter(s => s.role === 'ADMIN').length;
        const staff = allStaff.filter(s => s.role === 'STAFF').length;

        return {
            total,
            admins,
            staff,
        };
    }
}

export const staffService = new StaffService();
