'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import DashboardLayout from 'components/layout/DashboardLayout';

import CommonEntityForm, {
  ProfileField,
} from 'components/forms/CommonEntityForm';

import SuccessModal from 'components/popup/SuccessModal';

// ==============================
// COMPONENT
// ==============================
export default function AddPickupLocationPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [successModalOpen, setSuccessModalOpen] =
    useState(false);

  // ==============================
  // GET TOKEN
  // ==============================
  const getAuthToken = () => {
    const token =
      localStorage.getItem('authToken');

    if (token) return token;

    const sessionToken =
      sessionStorage.getItem('authToken');

    if (sessionToken) return sessionToken;

    return '';
  };

  // ==============================
  // FORM FIELDS
  // ==============================
  const locationFields: ProfileField[] = [
    {
      name: 'address',
      label: 'Pickup Address',
      type: 'text',
      required: true,
      placeholder:
        'Enter Pickup Address',
    },
  ];

  // ==============================
  // CREATE LOCATION
  // ==============================
  const handleSubmit = async (
    formData: Record<string, any>
  ) => {
    try {
      setLoading(true);

      const token = getAuthToken();

      const payload = {
        address: formData.address,
      };

      const res = await fetch(
        'https://dfpwebp.dhakarachi.org/api/smartdha/location/create-location',
        {
          method: 'POST',

          headers: {
            accept: '*/*',
            'Content-Type':
              'application/json',

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();

      if (
        !res.ok ||
        !json?.succeeded
      ) {
        throw new Error(
          json?.errors?.[0] ||
            'Failed to create pickup location'
        );
      }

      setSuccessModalOpen(true);
    } catch (error: any) {
      console.error(error);

      alert(
        error.message ||
          'Failed to create pickup location'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      pageTitle="Add Pickup Location"
      showBackButton={true}
    >
      <CommonEntityForm
        fields={locationFields}
        initialValues={{
          address: '',
        }}
        onSave={handleSubmit}
        loading={loading}
        saveButtonText="Create Location"
        successTitle="Location Created"
        successMessage="Pickup location created successfully."
      />

      {/* SUCCESS MODAL */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);

          router.push('/pickuplocation');
        }}
        title="Success"
        message="Pickup location created successfully."
      />
    </DashboardLayout>
  );
}