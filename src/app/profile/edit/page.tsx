'use client';

import { useState } from 'react';
import DashboardLayout from 'components/layout/DashboardLayout';
import CommonEntityForm, {
  ProfileField,
} from 'components/forms/CommonEntityForm';
import apiClient from '@/lib/apiClient';

export default function EditPage() {
  const pageTitle = 'Edit Profile';
  const [loading, setLoading] = useState(false);

  const profileFields: ProfileField[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      placeholder: 'Enter Name',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'Enter Email',
    },
    {
      name: 'userName',
      label: 'User Name',
      type: 'text',
      required: true,
      placeholder: 'Enter User Name',
    },
    {
      name: 'mobileNo',
      label: 'Mobile Number',
      type: 'text',
      required: true,
      placeholder: '0301-2345678',
    },
    {
      name: 'cnic',
      label: 'CNIC',
      type: 'text',
      required: true,
      placeholder: '12345-1234567-1',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      placeholder: 'Enter Password',
    },
    {
      name: 'profilePicture',
      label: 'Profile Picture',
      type: 'file',
      required: false,
    },
  ];

  const handleSubmit = async (
    formData: Record<string, any>
  ) => {
    try {
      setLoading(true);

      const payload = new FormData();

      // Get logged in user id
      const userId =
        localStorage.getItem('userId') || '';

      payload.append('Id', userId);

      payload.append(
        'Name',
        formData.name || ''
      );

      payload.append(
        'Email',
        formData.email || ''
      );

      payload.append(
        'UserName',
        formData.userName || ''
      );

      payload.append(
        'MobileNo',
        formData.mobileNo || ''
      );

      payload.append(
        'CNIC',
        formData.cnic || ''
      );

      payload.append(
        'Password',
        formData.password || ''
      );

      if (formData.profilePicture) {
        payload.append(
          'ProfilePicture',
          formData.profilePicture
        );
      }

      console.log(
        'Update User Payload:',
        [...payload.entries()]
      );

      const response = await apiClient.post(
        'api/smartdha/user/update-user',
        payload,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      );

    } catch (error: any) {
      console.error(
        'Update User Error:',
        error
      );

      console.error(
        'Backend Response:',
        error?.response?.data
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      pageTitle={pageTitle}
      showBackButton={true}
    >
      <CommonEntityForm
        fields={profileFields}
        onSave={handleSubmit}
        loading={loading}
        saveButtonText="Update"
        successTitle="User Updated"
        successMessage="User updated successfully."
      />
    </DashboardLayout>
  );
}