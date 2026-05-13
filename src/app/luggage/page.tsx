'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { Column, StatusBadge } from '../../components/tables/DataTable';
import WarningModal from '../../components/popup/WarningModal';
import FormModal from '../../components/popup/FormModal';
import CommonEntityForm, { ProfileFormData } from '../../components/forms/CommonEntityForm';
import { useLuggage } from '../../hooks/luggage/useLuggage';
import { useLuggageById } from '../../hooks/luggage/useLuggageById';
import { useCreateLuggage } from '../../hooks/luggage/useCreateLuggage';
import { useUpdateLuggage } from '../../hooks/luggage/useUpdateLuggage';
import { useDeleteLuggage } from '../../hooks/luggage/useDeleteLuggage';
import { saveTableRow, clearTableRow, getTableRow } from '../../lib/tableRowStorage';
import { formatDateDisplay } from '../../lib/dateUtils';
import { luggageFields } from './fields';
import { getAllExternalUsers } from '../../services/user.service';
import type { Luggage } from '../../services/luggage.service';
import { useSearch } from "@/context/searchContext";

interface LuggagePass {
  id: string;
  name: string;
  userName?: string;
  vehicleInfo: string;
  visitDetail: string;
  validity: string;
  cnicNicopNo: string;
  status: boolean;
  sno?: number;
}

type SelectedLuggageRow = Pick<Luggage, 'id'>;

const toLuggagePassTypeLabel = (passType?: string | number): string => {
  if (passType === 'DayPass' || passType === 1) return 'Day Pass';
  if (passType === 'LongDay' || passType === 2) return 'Long Stay';
  return '-';
};

export default function LuggagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { searchValue } = useSearch();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLuggage, setSelectedLuggage] = useState<SelectedLuggageRow | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);
  const [formError, setFormError] = useState('');
  const { data, isLoading, isError, error } = useLuggage(1, 10);
  const { mutateAsync: deleteLuggage, isPending: isDeleting } = useDeleteLuggage();
  const { mutateAsync: createLuggage } = useCreateLuggage();
  const { mutateAsync: updateLuggage } = useUpdateLuggage();
  const [editLuggageId, setEditLuggageId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const { data: editLuggageDetails, isLoading: isEditLuggageLoading } = useLuggageById(editLuggageId);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<LuggagePass | null>(null);
  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');

  useEffect(() => {
    if (modalMode === 'edit') {
      if (modalId) {
        setEditLuggageId(modalId);
        setHasCheckedId(true);
      } else {
        const selected = getTableRow<any>('luggage');
        if (selected?.id) {
          setEditLuggageId(String(selected.id));
          clearTableRow('luggage');
          setHasCheckedId(true);
        }
      }
    }
  }, [modalMode, modalId]);
const getValidDate = (val: any) => {
  if (!val) return null;
  
  // If it's already a string in YYYY-MM-DD format
  if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}/)) {
    return val.split('T')[0].split(' ')[0];
  }
  
  // Try to create a date object
  try {
    const date = new Date(val);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch (e) {
    console.error('Date parsing error:', e);
  }
  
  // If all else fails, return the raw value to see what it is
  return String(val);
};
  const toDateInputValue = (value?: string) => {
    if (!value) return '';
    const dateMatch = String(value).match(/^\d{4}-\d{2}-\d{2}/);
    return dateMatch ? dateMatch[0] : '';
  };

  const toIsoDate = (value?: string) => {
    if (!value) return '';
    const dateMatch = String(value).match(/^\d{4}-\d{2}-\d{2}/);
    return dateMatch ? dateMatch[0] : '';
  };
  const formatSafeDate = (value?: string | null) => {
  if (!value) return '-';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '-';
  return date.toISOString().split('T')[0];
};
  const toVehicleLicensePlate = (vehicleNo?: string, vehicleNo2?: string) => {
    const firstPart = (vehicleNo ?? '').trim();
    const secondPart = (vehicleNo2 ?? '').trim();
    if (!firstPart && !secondPart) return '';
    return `${firstPart}-${secondPart}`;
  };

  const toLuggagePassType = (quickPick?: string): number | null => {
    if (quickPick === 'LongStay') return 2;
    if (quickPick === 'DayPass') return 1;
    return null;
  };

  const toQuickPick = (passType?: string | number): string => {
    if (passType === 2) return 'LongStay';
    if (passType === 1) return 'DayPass';
    return 'DayPass';
  };

  const handleCloseModal = () => {
    setEditLuggageId(undefined);
    setHasCheckedId(false);
    setFormError('');
    router.push('/luggage');
  };
  const handleView = (luggage: LuggagePass) => {
  setSelectedRow(luggage);
  setViewModalOpen(true);
  };

  const handleAddLuggage = async (data: ProfileFormData) => {
    setFormError('');
    try {
      const luggagePassType = toLuggagePassType(data.quickPick);
      if (luggagePassType === null) {
        throw new Error('Please select a Quick Pick option.');
      }

      let externalUserId = 'system';
      try {
        const users = await getAllExternalUsers();
        const firstValid = users.find((u: any) => u.id);
        if (firstValid && firstValid.id) {
          externalUserId = firstValid.id;
        }
      } catch {
        externalUserId = 'system';
      }

      await createLuggage({
        name: data.fullName || '',
        cnic: data.cnic || '',
        vehicleLicensePlate: toVehicleLicensePlate(data.vehicleNo, data.vehicleNo2),
        vehicleLicenseNo: Number(data.vehicleNo2 || 0),
        luggagePassType: luggagePassType || 1,
        validFrom: toIsoDate(data.fromDate),
        validTo: toIsoDate(data.toDate),
        description: data.description || '',
        externalUserId,
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to create luggage';
      setFormError(message);
    }
  };

  const initialLuggageValues = useMemo<ProfileFormData | null>(() => {
    if (!editLuggageDetails?.data) return null;
    const data = editLuggageDetails.data;
    return {
      fullName: data.name || '',
      cnic: data.cnic || '',
      vehicleNo: data.vehicleInfo,
      qrReference: data.qrCode || '',
      status: data.isActive ? 'active' : 'inactive',
      quickPick: toQuickPick(data.luggagePassType),
      fromDate: toDateInputValue(data.fromDate),
      toDate: toDateInputValue(data.toDate),
      description: data.description || '',
      isActive: data.isActive,
    };
  }, [editLuggageDetails]);

  const handleUpdateLuggage = async (formData: ProfileFormData) => {
    if (!editLuggageId || !editLuggageDetails?.data) return;
    setFormError('');
    try {
      const luggageData = editLuggageDetails.data;
      const luggagePassType = toLuggagePassType(formData.quickPick);

      await updateLuggage({
        id: editLuggageId,
        name: formData.fullName || luggageData.name || '',
        cnic: formData.cnic || luggageData.cnic || '',
        vehicleLicensePlate: toVehicleLicensePlate(formData.vehicleNo, formData.vehicleNo2),
        vehicleLicenseNo: Number(formData.vehicleNo2 || 0),
        luggagePassType: luggagePassType || luggageData.luggagePassType || 1,
        validFrom: toIsoDate(formData.fromDate),
        validTo: toIsoDate(formData.toDate),
        description: formData.description || luggageData.description || '',
        externalUserId: luggageData.externalUserId,
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to update luggage';
      setFormError(message);
    }
  };

const rawList = [
  ...(data?.data?.upcomingLuggage || []),
  ...(data?.data?.previousLuggage || [])
];

const luggagePasses: LuggagePass[] = rawList
  .filter((item) => item && !localRemovedIds.includes(item.id))
  .map((item, idx) => ({
    sno: idx + 1,
    id: item.id,
    name: item.name,
    userName: item.externalUserName || '-',
    vehicleInfo: item.vehicleInfo || '-',
    visitDetail: toLuggagePassTypeLabel(item.luggagePassType),
    validity:`${getValidDate(item.fromDate) ?? '-'} - ${getValidDate(item.toDate) ?? '-'}`,
    cnicNicopNo: item.cnic,
    status: item.isActive && !item.isDeleted,
  }));
  const filteredLuggagePasses = luggagePasses.filter((item) =>
  item.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
  item.userName?.toLowerCase().includes(searchValue.toLowerCase()) ||
  item.vehicleInfo?.toLowerCase().includes(searchValue.toLowerCase()) ||
  item.visitDetail?.toLowerCase().includes(searchValue.toLowerCase()) ||
  item.cnicNicopNo?.toLowerCase().includes(searchValue.toLowerCase()) ||
  item.validity?.toLowerCase().includes(searchValue.toLowerCase())
);

  const handleAddNew = () => {
    router.push('/luggage?modal=add');
  };

  const handleEdit = (luggage: LuggagePass) => {
    saveTableRow('luggage', luggage);
    router.push(`/luggage?modal=edit&id=${encodeURIComponent(luggage.id)}`);
  };

  const handleDelete = (luggage: SelectedLuggageRow) => {
    setSelectedLuggage(luggage);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLuggage) {
      return;
    }

    try {
      const response = await deleteLuggage({ id: selectedLuggage.id });
      const isSuccess = response?.statusCode === 0 || response?.statusCode === 200;
      if (isSuccess) {
        setLocalRemovedIds((prev) => [...prev, selectedLuggage.id]);
      }
    } catch {
      
    }

    setDeleteModalOpen(false);
    setSelectedLuggage(null);
  };

  const columns: Column<LuggagePass>[] = [
    { key: 'sno', header: 'S.No' },
    { key: 'name', header: 'Name' },
    { key: 'vehicleInfo', header: 'Vehicle Info' },
    { key: 'visitDetail', header: 'Visit Detail' },
    { key: 'validity', header: 'Validity' },
    { key: 'cnicNicopNo', header: 'CNIC/NICOP No.' },
  ];

  return (
    <DashboardLayout pageTitle="Luggage">
      <DataTable<LuggagePass>
        columns={columns}
        data={filteredLuggagePasses}
        loading={isLoading}
        onAddClick={handleAddNew}
        addButtonLabel="Add New"
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        getRowStatus={(row) => (row.status ? 'Active' : 'Inactive')}
        error={
          isError
            ? `Failed to load luggage: ${error instanceof Error ? error.message : 'Unknown error'}`
            : undefined
        }
      />

      <FormModal
        isOpen={modalMode === 'add'}
        onClose={handleCloseModal}
        title="Add New Luggage"
      >
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleAddLuggage}
          onCancel={handleCloseModal}
          fields={luggageFields.filter((f) => f.name !== 'description')}
          saveButtonText="Create"
          showStatusToggle={false}
        />
      </FormModal>

      <FormModal
        isOpen={modalMode === 'edit' && hasCheckedId}
        onClose={handleCloseModal}
        title="Edit Luggage"
      >
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        {isEditLuggageLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : initialLuggageValues ? (
          <CommonEntityForm
            key={editLuggageId}
            title="Please update details below!"
            onSave={handleUpdateLuggage}
            onCancel={handleCloseModal}
            fields={luggageFields.filter((f) => f.name !== 'description')}
            initialValues={initialLuggageValues}
            saveButtonText="Update"
            showStatusToggle={false}
          />
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>Error loading luggage details</div>
        )}
      </FormModal>
      <FormModal
  isOpen={viewModalOpen}
  onClose={() => {
    setViewModalOpen(false);
    setSelectedRow(null);
  }}
  title="Luggage Details"
>
  {selectedRow ? (
    <div
      style={{
        width: "380px",
        maxWidth: "90vw",
        margin: "0 auto",
        display: "grid",
        gap: "10px",
        padding: "10px 0",
      }}
    >
      {[
        { label: "Name", value: selectedRow.name },
        { label: "User Name", value: selectedRow.userName },
        { label: "Vehicle Info", value: selectedRow.vehicleInfo },
        { label: "Pass Type", value: selectedRow.visitDetail },
        { label: "Validity", value: selectedRow.validity },
        { label: "CNIC", value: selectedRow.cnicNicopNo },
        {
          label: "Status",
          value: selectedRow.status ? "Active" : "Inactive",
        },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 12px",
            borderRadius: "10px",
            background: "#f9fafb",
            border: "1px solid #eef2f7",
          }}
        >
          <span
            style={{
              color: "#16a34a",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            {item.label}
          </span>

          <span
            style={{
              color: "#111827",
              fontWeight: 500,
              fontSize: "13px",
              textAlign: "right",
              flex: 1,
              wordBreak: "break-word",
            }}
          >
            {item.value || "-"}
          </span>
        </div>
      ))}
    </div>
  ) : (
    <div style={{ textAlign: "center", padding: "20px" }}>
      No data selected
    </div>
  )}
</FormModal>
      <WarningModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Luggage Record"
        message={
          isDeleting
            ? 'Deleting...'
            : 'Are you sure you want to delete this luggage record? This action cannot be undone.'
        }
      />
    </DashboardLayout>
  );
}