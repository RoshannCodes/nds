'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminRoute from '@/components/AdminRoute';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { createStaffSchema, updateStaffSchema } from '@/lib/schemas';
import { Staff, CreateStaffFormData, UpdateStaffFormData } from '@/types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { formatDate, getRoleBadgeColor } from '@/lib/utils';

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: createErrors, isSubmitting: isCreating },
    reset: resetCreate,
  } = useForm<CreateStaffFormData>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      role: 'STAFF',
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: editErrors, isSubmitting: isEditing },
    reset: resetEdit,
  } = useForm<UpdateStaffFormData>({
    resolver: zodResolver(updateStaffSchema),
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const data = await api.getStaffList();
      setStaff(data);
    } catch (error) {
      console.error('Failed to load staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const onCreateSubmit = async (data: CreateStaffFormData) => {
    try {
      await api.createStaff(data);
      setIsCreateModalOpen(false);
      resetCreate();
      loadStaff();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create staff';
      alert(message);
    }
  };

  const onEditSubmit = async (data: UpdateStaffFormData) => {
    if (!selectedStaff) return;

    try {
      await api.updateStaff(selectedStaff.id, data);
      setIsEditModalOpen(false);
      setSelectedStaff(null);
      resetEdit();
      loadStaff();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update staff';
      alert(message);
    }
  };

  const handleEdit = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    resetEdit({
      email: staffMember.email,
      firstName: staffMember.firstName,
      lastName: staffMember.lastName,
      role: staffMember.role,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;

    try {
      await api.deleteStaff(id);
      loadStaff();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete staff';
      alert(message);
    }
  };

  if (loading) {
    return (
      <AdminRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </DashboardLayout>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
              <p className="text-gray-600 mt-1">Manage staff members and their roles</p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-5 w-5" />
              Add Staff
            </Button>
          </div>

          <Card>
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {staff.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{member.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getRoleBadgeColor(member.role)}>
                            {member.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {member.createdAt ? formatDate(member.createdAt) : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(member)}
                            className="text-orange-600 hover:text-orange-900 mr-4"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            resetCreate();
          }}
          title="Add New Staff"
        >
          <form onSubmit={handleSubmitCreate(onCreateSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="staff@example.com"
              error={createErrors.email?.message}
              {...registerCreate('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              error={createErrors.password?.message}
              {...registerCreate('password')}
            />

            <Input
              label="First Name"
              placeholder="John"
              error={createErrors.firstName?.message}
              {...registerCreate('firstName')}
            />

            <Input
              label="Last Name"
              placeholder="Doe"
              error={createErrors.lastName?.message}
              {...registerCreate('lastName')}
            />

            <Select
              label="Role"
              error={createErrors.role?.message}
              options={[
                { value: 'STAFF', label: 'Staff' },
                { value: 'ADMIN', label: 'Admin' },
              ]}
              {...registerCreate('role')}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetCreate();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isCreating}>
                Create Staff
              </Button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedStaff(null);
            resetEdit();
          }}
          title="Edit Staff"
        >
          <form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              error={editErrors.email?.message}
              {...registerEdit('email')}
            />

            <Input
              label="First Name"
              error={editErrors.firstName?.message}
              {...registerEdit('firstName')}
            />

            <Input
              label="Last Name"
              error={editErrors.lastName?.message}
              {...registerEdit('lastName')}
            />

            <Select
              label="Role"
              error={editErrors.role?.message}
              options={[
                { value: 'STAFF', label: 'Staff' },
                { value: 'ADMIN', label: 'Admin' },
              ]}
              {...registerEdit('role')}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedStaff(null);
                  resetEdit();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isEditing}>
                Update Staff
              </Button>
            </div>
          </form>
        </Modal>
      </DashboardLayout>
    </AdminRoute>
  );
}
