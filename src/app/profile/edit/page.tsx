'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from 'components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField } from 'components/forms/CommonEntityForm';
import apiClient from '@/lib/apiClient';

export default function EditPage() {
  const pageTitle = 'Edit Profile';
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  // =========================
  // FETCH PROFILE (same API as view page)
  // =========================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetching(true);

        const response = await apiClient.get(
          '/api/smartdha/user/getprofiledetail'
        );

        setProfile(response.data);
      } catch (error) {
        console.error('Profile Fetch Error:', error);
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, []);

  // =========================
  // FIELD CONFIG (dynamic placeholders)
  // =========================
  const profileFields: ProfileField[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      placeholder: profile?.name || 'Enter Name',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: profile?.email || 'Enter Email',
    },
    {
      name: 'mobileNo',
      label: 'Mobile Number',
      type: 'text',
      required: true,
      placeholder:
        profile?.mobileNumber ||
        profile?.registteredMobileNumber ||
        '0301-2345678',
    },
    {
      name: 'cnic',
      label: 'CNIC',
      type: 'text',
      required: true,
      placeholder: profile?.cnic || '12345-1234567-1',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: false,
      placeholder: 'Enter Password',
    },
    {
      name: 'profilePicture',
      label: 'Profile Picture',
      type: 'file',
      required: false,
    },
  ];

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (formData: Record<string, any>) => {
    try {
      setLoading(true);

      const payload = new FormData();

      const userId = localStorage.getItem('userId') || '';

      payload.append('Id', userId);
      payload.append('Name', formData.name || '');
      payload.append('Email', formData.email || '');
      payload.append('MobileNo', formData.mobileNo || '');
      payload.append('CNIC', formData.cnic || '');

      if (formData.password) {
        payload.append('Password', formData.password);
      }

      if (formData.profilePicture) {
        payload.append('ProfilePicture', formData.profilePicture);
      }

      await apiClient.post(
        'api/smartdha/user/update-user',
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    } catch (error) {
      console.error('Update Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout pageTitle={pageTitle} showBackButton={true}>
      {fetching ? (
        <div className="p-6 text-gray-500">Loading profile...</div>
      ) : (
        <CommonEntityForm
          fields={profileFields}
          onSave={handleSubmit}
          loading={loading}
          saveButtonText="Update"
          successTitle="User Updated"
          successMessage="User updated successfully."
        />
      )}
    </DashboardLayout>
  );
}