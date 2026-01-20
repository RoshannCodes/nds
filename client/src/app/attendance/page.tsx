'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardBody } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { api } from '@/lib/api';
import { Attendance, AttendanceWithStaff, AttendanceFilters, Staff } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate, getStatusBadgeColor } from '@/lib/utils';
import { Filter } from 'lucide-react';

export default function AttendancePage() {
  const { isAdmin } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceWithStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AttendanceFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const params: Record<string, string> = {};
      
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.status) params.status = filters.status;
      if (filters.staffId) params.staffId = filters.staffId;

      const attendanceData = await api.getAttendanceList(params);
      
      // If admin, fetch staff data and join with attendance
      if (isAdmin) {
        const staffData = await api.getStaffList();
        const staffMap = new Map(staffData.map(s => [s.id, s]));
        
        const attendanceWithStaff: AttendanceWithStaff[] = attendanceData.map(record => {
          const staff = staffMap.get(record.staffId);
          return {
            ...record,
            staff: staff || {
              id: record.staffId,
              firstName: 'Unknown',
              lastName: 'Staff',
              email: 'N/A',
              role: 'STAFF' as const,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          };
        });
        
        setAttendance(attendanceWithStaff);
      } else {
        // For staff users, create dummy staff info (won't be displayed anyway)
        setAttendance(attendanceData.map(record => ({
          ...record,
          staff: {
            id: record.staffId,
            firstName: '',
            lastName: '',
            email: '',
            role: 'STAFF' as const,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })));
      }
    } catch (error) {
      console.error('Failed to load attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    loadAttendance();
  };

  const handleClearFilters = () => {
    setFilters({});
    setTimeout(loadAttendance, 0);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'success';
      case 'LATE':
        return 'warning';
      case 'ABSENT':
        return 'danger';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance Records</h1>
            <p className="text-gray-600 mt-1">
              {isAdmin ? 'View and manage all attendance records' : 'View your attendance history'}
            </p>
          </div>
          <Button variant="secondary" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-5 w-5" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>

        {showFilters && (
          <Card>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />

                <Input
                  label="End Date"
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={filters.status || ''}
                    onChange={(e) => {
                      const value = e.target.value as '' | 'PRESENT' | 'LATE' | 'ABSENT';
                      setFilters({ ...filters, status: value || undefined });
                    }}
                  >
                    <option value="">All</option>
                    <option value="PRESENT">Present</option>
                    <option value="LATE">Late</option>
                    <option value="ABSENT">Absent</option>
                  </select>
                </div>

                <div className="flex items-end gap-2">
                  <Button onClick={handleApplyFilters} className="flex-1">
                    Apply
                  </Button>
                  <Button variant="secondary" onClick={handleClearFilters}>
                    Clear
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    {isAdmin && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Staff
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check Out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendance.length === 0 ? (
                    <tr>
                      <td
                        colSpan={isAdmin ? 5 : 4}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No attendance records found
                      </td>
                    </tr>
                  ) : (
                    attendance.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatDate(record.date)}
                          </div>
                        </td>
                        {isAdmin && record.staff && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {record.staff.firstName} {record.staff.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{record.staff.email}</div>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {record.checkInTime || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {record.checkOutTime || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={getStatusVariant(record.status)}
                            className={getStatusBadgeColor(record.status)}
                          >
                            {record.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
