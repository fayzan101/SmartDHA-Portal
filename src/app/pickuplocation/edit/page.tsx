'use client';

import { useEffect, useState } from 'react';

import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import DashboardLayout from 'components/layout/DashboardLayout';

import CommonEntityForm, {
  ProfileField,
} from 'components/forms/CommonEntityForm';

import SuccessModal from 'components/popup/SuccessModal';

import WarningModal from 'components/popup/WarningModal';

// ==============================
// COMPONENT
// ==============================
export default function EditPickupLocationPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const locationId =
    searchParams.get('id');

  const [loading, setLoading] =
    useState(false);

  const [initialValues, setInitialValues] =
    useState<Record<string, any>>({});

  const [successModalOpen, setSuccessModalOpen] =
    useState(false);

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

  const [deleteSuccessOpen, setDeleteSuccessOpen] =
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
  // FETCH LOCATION
  // ==============================
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);

        const token = getAuthToken();

        const res = await fetch(
          'https://dfpwebp.dhakarachi.org/api/smartdha/location/get-all-location',
          {
            method: 'POST',

            headers: {
              accept: '*/*',
              'Content-Type':
                'application/json',
              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
              pageNumber: 0,
              pageSize: 0,
            }),
          }
        );

        const json = await res.json();

        const items =
          json?.data?.items || [];

        const selectedLocation =
          items.find(
            (item: any) =>
              item.id === locationId
          );

        if (selectedLocation) {
          setInitialValues({
            address:
              selectedLocation.address ||
              '',
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (locationId) {
      fetchLocation();
    }
  }, [locationId]);

  // ==============================
  // UPDATE LOCATION
  // ==============================
  const handleSubmit = async (
    formData: Record<string, any>
  ) => {
    try {
      setLoading(true);

      const token = getAuthToken();

      const payload = {
        id: locationId,
        address: formData.address,
      };

      const res = await fetch(
        'https://dfpwebp.dhakarachi.org/api/smartdha/location/update-location',
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
            'Failed to update pickup location'
        );
      }

      setSuccessModalOpen(true);
    } catch (error: any) {
      console.error(error);

      alert(
        error.message ||
          'Failed to update pickup location'
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // DELETE LOCATION
  // ==============================
  const handleDelete = async () => {
    try {
      setLoading(true);

      const token = getAuthToken();

      const res = await fetch(
        `https://dfpwebp.dhakarachi.org/api/smartdha/location/delete-location?id=${locationId}`,
        {
          method: 'DELETE',

          headers: {
            accept: '*/*',

            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(
          'Failed to delete pickup location'
        );
      }

      setDeleteModalOpen(false);

      setDeleteSuccessOpen(true);
    } catch (error: any) {
      console.error(error);

      alert(
        error.message ||
          'Failed to delete pickup location'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      pageTitle="Edit Pickup Location"
      showBackButton={true}
    >
      <CommonEntityForm
        fields={locationFields}
        initialValues={initialValues}
        onSave={handleSubmit}
        loading={loading}
        saveButtonText="Update Location"
        successTitle="Location Updated"
        successMessage="Pickup location updated successfully."
      />
      {/* UPDATE SUCCESS */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);

          router.push('/pickuplocation');
        }}
        title="Success"
        message="Pickup location updated successfully."
      />

      {/* DELETE WARNING */}
      <WarningModal
        isOpen={deleteModalOpen}
        onClose={() =>
          setDeleteModalOpen(false)
        }
        onConfirm={handleDelete}
        title="Delete Pickup Location"
        message="Are you sure you want to delete this pickup location?"
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* DELETE SUCCESS */}
      <SuccessModal
        isOpen={deleteSuccessOpen}
        onClose={() => {
          setDeleteSuccessOpen(false);

          router.push('/pickuplocation');
        }}
        title="Deleted"
        message="Pickup location deleted successfully."
      />
    </DashboardLayout>
  );
}