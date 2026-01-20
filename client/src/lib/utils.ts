import { User, UserRole } from '@/types';

export const getFullName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`;
};

export const getRoleBadgeColor = (role: UserRole): string => {
  return role === 'ADMIN' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800';
};

export const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case 'PRESENT':
      return 'bg-green-100 text-green-800';
    case 'LATE':
      return 'bg-yellow-100 text-yellow-800';
    case 'ABSENT':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (time: string | null): string => {
  if (!time) return 'N/A';
  return time;
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};
