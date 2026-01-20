'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { Users, Calendar, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { AttendanceStatistics, StaffStatistics, TodayAttendanceStatus } from '@/types';

interface DashboardStats {
  staff?: StaffStatistics;
  attendance?: AttendanceStatistics;
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todayStatus, setTodayStatus] = useState<TodayAttendanceStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (isAdmin) {
        const [staffStats, attendanceStats] = await Promise.all([
          api.getStaffStatistics(),
          api.getAttendanceStatistics(),
        ]);
        setStats({ staff: staffStats, attendance: attendanceStats });
      } else {
        const [today, attendanceStats] = await Promise.all([
          api.getTodayStatus(),
          api.getAttendanceStatistics(),
        ]);
        setTodayStatus(today);
        setStats({ attendance: attendanceStats });
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      await api.checkIn();
      loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to check in';
      alert(message);
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.checkOut();
      loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to check out';
      alert(message);
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.firstName}!
          </p>
        </div>

        {!isAdmin && todayStatus && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Today's Attendance
              </h2>
            </CardHeader>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  {todayStatus.hasCheckedIn ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Checked In: <span className="font-semibold">{todayStatus.attendance?.checkInTime || 'N/A'}</span>
                      </p>
                      {todayStatus.hasCheckedOut && (
                        <p className="text-sm text-gray-600">
                          Checked Out: <span className="font-semibold">{todayStatus.attendance?.checkOutTime || 'N/A'}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600">You haven't checked in today</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {!todayStatus.hasCheckedIn && (
                    <Button onClick={handleCheckIn}>Check In</Button>
                  )}
                  {todayStatus.hasCheckedIn && !todayStatus.hasCheckedOut && (
                    <Button onClick={handleCheckOut} variant="secondary">
                      Check Out
                    </Button>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isAdmin && stats?.staff && (
            <>
              <Card>
                <CardBody className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Staff</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.staff.total}</p>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Admins</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.staff.admins}</p>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Staff Members</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.staff.staff}</p>
                  </div>
                </CardBody>
              </Card>
            </>
          )}

          {stats?.attendance && (
            <>
              <Card>
                <CardBody className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Records</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.attendance.total}</p>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Present</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.attendance.present}</p>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <AlertCircle className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Late</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.attendance.late}</p>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Absent</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.attendance.absent}</p>
                  </div>
                </CardBody>
              </Card>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
