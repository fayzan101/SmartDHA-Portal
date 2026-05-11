'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import DashboardLayout from '../../components/layout/DashboardLayout';

import DataTable, {
  Column,
  StatusBadge,
} from '../../components/tables/DataTable';

import SuccessModal from '../../components/popup/SuccessModal';
import WarningModal from '../../components/popup/WarningModal';

import { AddNewButton } from '@/components/ui/ActionButton';

// ==============================
// TYPES
// ==============================
interface LocationRow {
  sno: number;
  id: string;
  address: string;
  status: boolean;
}

// ==============================
// COMPONENT
// ==============================
export default function LocationPage() {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [locationsRaw, setLocationsRaw] =
    useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ==============================
  // MODALS
  // ==============================
  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

  const [successModalOpen, setSuccessModalOpen] =
    useState(false);

  const [selectedLocationId, setSelectedLocationId] =
    useState('');

  const [successMessage, setSuccessMessage] =
    useState('');

  // ==============================
  // GET TOKEN
  // ==============================
  const getAuthToken = () => {
    const token = localStorage.getItem('authToken');

    if (token) return token;

    const sessionToken =
      sessionStorage.getItem('authToken');

    if (sessionToken) return sessionToken;

    return '';
  };

  // ==============================
  // FETCH LOCATIONS
  // ==============================
  const fetchLocations = async () => {
    const token = getAuthToken();

    if (!token) {
      setError(
        'Authentication required. Please login again.'
      );

      return;
    }

    setLoading(true);
    setError('');

    try {
      const requestBody = {
        pageNumber: currentPage,
        pageSize: pageSize,
      };

      const res = await fetch(
        'https://dfpwebp.dhakarachi.org/api/smartdha/location/get-all-location',
        {
          method: 'POST',
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const text = await res.text();

      if (!text || text.trim() === '') {
        setError('Empty response from API');
        return;
      }

      const json = JSON.parse(text);

      if (res.ok && json.success) {
        const items = json?.data?.items || [];

        setLocationsRaw(items);
      } else {
        throw new Error(
          json.message ||
            'Failed to fetch locations'
        );
      }
    } catch (err: any) {
      console.error(err);

      setError(
        err.message || 'Failed to load locations'
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // INITIAL LOAD
  // ==============================
  useEffect(() => {
    fetchLocations();
  }, [currentPage]);

  // ==============================
  // OPEN DELETE MODAL
  // ==============================
  const openDeleteModal = (id: string) => {
    setSelectedLocationId(id);
    setDeleteModalOpen(true);
  };

  // ==============================
  // DELETE LOCATION
  // ==============================
  const handleDelete = async () => {
  try {
    const token = getAuthToken();

    const res = await fetch(
      'https://dfpwebp.dhakarachi.org/api/smartdha/location/delete-location',
      {
        method: 'POST', // ✅ IMPORTANT (not DELETE)
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: selectedLocationId, // ✅ API expects body
        }),
      }
    );

    const json = await res.json();

    if (!res.ok || !json?.data?.success) {
      throw new Error(
        json?.data?.message ||
          'Failed to delete location'
      );
    }

    setDeleteModalOpen(false);

    setSuccessMessage(
      json?.data?.message ||
        'Pickup location deleted successfully'
    );

    setSuccessModalOpen(true);

    fetchLocations();
  } catch (err: any) {
    console.error(err);

    setDeleteModalOpen(false);

    setError(err.message || 'Delete failed');
  }
};

  // ==============================
  // EDIT LOCATION
  // ==============================
  const handleEdit = (row: LocationRow) => {
    router.push(
      `/pickuplocation/edit?id=${row.id}`
    );
  };

  // ==============================
  // ADD LOCATION
  // ==============================
  const handleAddLocation = () => {
    router.push('/pickuplocation/add');
  };

  // ==============================
  // PREPARE TABLE DATA
  // ==============================
  const locations: LocationRow[] = useMemo(() => {
    return locationsRaw.map(
      (item: any, idx: number) => ({
        sno:
          (currentPage - 1) * pageSize +
          idx +
          1,

        id: item.id,

        address: item.address || '-',

        status: item.status ?? false,
      })
    );
  }, [locationsRaw, currentPage, pageSize]);

  // ==============================
  // PAGE CHANGE
  // ==============================
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // ==============================
  // TABLE COLUMNS
  // ==============================
  const columns: Column<LocationRow>[] = [
    {
      key: 'sno',
      header: 'S.No',
    },

    {
      key: 'address',
      header: 'Address',
    },

    {
      key: 'status',
      header: 'Status',
      render: (value: boolean) => (
        <StatusBadge
          type="activeInactive"
          value={value}
        />
      ),
    },

    {
      key: 'id',
      header: 'Actions',

      render: (_: any, row: LocationRow) => (
        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          {/* EDIT BUTTON */}
          <button
            onClick={() => handleEdit(row)}
            style={{
              width: '35px',
              height: '35px',
              borderRadius: '8px',
              border: 'none',
              background: '#30B33D',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow:
                '4px 4px 12px 0px #BBC3CE9, -4px -4px 12px 0px #FDFFFFCC',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </button>

          {/* DELETE BUTTON */}
          <button
            onClick={() =>
              openDeleteModal(row.id)
            }
            style={{
              width: '35px',
              height: '35px',
              borderRadius: '8px',
              border: 'none',
              background: '#30B33D',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            🗑
          </button>
        </div>
      ),
    },
  ];

  // ==============================
  // RENDER
  // ==============================
  return (
    <DashboardLayout pageTitle="Pickup Locations">
      {/* ERROR */}
      {error && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px',
            borderRadius: '8px',
            background: '#fee2e2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
          }}
        >
          {error}
        </div>
      )}

      {/* ADD BUTTON */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '16px',
        }}
      >
        <AddNewButton
          onClick={handleAddLocation}
          label="+ Add Pickup Location"
        />
      </div>

      {/* TABLE */}
      <DataTable<LocationRow>
        columns={columns}
        data={locations}
        loading={loading}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        error={error || undefined}
      />

      {/* DELETE MODAL */}
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

      {/* SUCCESS MODAL */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() =>
          setSuccessModalOpen(false)
        }
        title="Success"
        message={successMessage}
      />
    </DashboardLayout>
  );
}