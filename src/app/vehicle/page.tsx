'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import CircularButton from '../../components/ui/CircularButton';
import WarningModal from '../../components/popup/WarningModal';
import FormModal from '../../components/popup/FormModal';
import CommonEntityForm, { ProfileFormData } from '../../components/forms/CommonEntityForm';
import { saveTableRow, clearTableRow, getTableRow } from '../../lib/tableRowStorage';
import { useVehicles } from '../../hooks/vehicle/useVehicles';
import { useVehicleById } from '../../hooks/vehicle/useVehicleById';
import { useCreateVehicle } from '../../hooks/vehicle/useCreateVehicle';
import { useUpdateVehicle } from '../../hooks/vehicle/useUpdateVehicle';
import { useDeleteVehicle } from '../../hooks/vehicle/useDeleteVehicle';
import { formatDateDisplay } from '../../lib/dateUtils';
import { vehicleFields } from './fields';
import { getEnumMetadata } from '../../services/enum.service';
import { getAllExternalUsers } from '../../services/user.service';
import type { ExternalVehicle as BaseExternalVehicle } from '../../services/vehicle.service';
import { Eye } from "lucide-react";

// Extend ExternalVehicle to include externalUserName
interface ExternalVehicle extends BaseExternalVehicle {
  externalUserName?: string;
}
interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string; // ✅ add this
}
interface Vehicle {
  id: string;
  licensePlate: string;
  vehicleETagId: string;
  eTagType: string;
  issueDate: string;
  expiryDate: string;
  tagStatus: number | null;
  ownership: string;
  make: string;
  model: string;
  year: string;
  color: string;
  externalUserName?: string;
  sno?: number;
}

type SelectedVehicleRow = Pick<ExternalVehicle, 'id'>;

const formatLicensePlate = (license?: string | null, licenseNo?: number | null) => {
  const first = (license || '').trim();
  const second = licenseNo === null || licenseNo === undefined ? '' : String(licenseNo);

  if (!first && !second) {
    return '-';
  }

  if (!second) {
    return first || '-';
  }

  if (first.includes('-')) {
    return first;
  }

  return `${first}-${second}`;
};

export default function VehiclePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<SelectedVehicleRow | null>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);
  const [editVehicleId, setEditVehicleId] = useState<string | undefined>();
  const [hasCheckedId, setHasCheckedId] = useState(false);

  const { data, isLoading, isError, error } = useVehicles(currentPage, 10);
  const { data: editVehicleDetails, isLoading: isEditVehicleLoading } = useVehicleById(editVehicleId);
  const { mutateAsync: deleteVehicle, isPending: isDeleting } = useDeleteVehicle();
  const { mutateAsync: createVehicle } = useCreateVehicle();
  const { mutateAsync: updateVehicle } = useUpdateVehicle();

  const [loadingEnums, setLoadingEnums] = useState(true);
  const [enumFields, setEnumFields] = useState(vehicleFields);
  const [formError, setFormError] = useState('');

  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (modalMode === 'edit') {
      if (modalId) {
        setEditVehicleId(modalId);
        setHasCheckedId(true);
      } else {
        const selected = getTableRow<any>('vehicle');
        if (selected?.id) {
          setEditVehicleId(String(selected.id));
          clearTableRow('vehicle');
          setHasCheckedId(true);
        }
      }
    }
  }, [modalMode, modalId]);

  useEffect(() => {
    async function fetchEnumOptions() {
      try {
        const [colorRes, tagStatusRes] = await Promise.all([
          getEnumMetadata({ EnumType: 'VehicleColor' }),
          getEnumMetadata({ EnumType: 'TagStatus' })
        ]);
        const colorEnum = colorRes.data.enums.find((e: any) => e.name === 'VehicleColor');
        const tagStatusEnum = tagStatusRes.data.enums.find((e: any) => e.name === 'TagStatus');
        const colorOptions = colorEnum?.members.map((m: any) => ({ value: m.value.toString(), label: m.name })) || [];
        const tagStatusOptions = tagStatusEnum?.members.map((m: any) => ({ value: m.value.toString(), label: m.name })) || [];
        setEnumFields((prevFields) =>
          prevFields.map((f) => {
            if (f.name === 'color') {
              return { ...f, type: 'select', options: colorOptions };
            }
            if (f.name === 'eTagStatus') {
              return { ...f, type: 'select', options: tagStatusOptions };
            }
            return f;
          })
        );
      } catch {
        // fallback: leave as text if API fails
      } finally {
        setLoadingEnums(false);
      }
    }
    fetchEnumOptions();
  }, []);

  console.log('VehiclePage render with data:', data, 'isLoading:', isLoading, 'isError:', isError, 'error:', error);

  // flatten nested structure: items -> vehicles
const rawVehicles =
  data?.data?.items?.flatMap((group) =>
    (group.vehicles || []).map((v) => ({
      ...v,
      externalUserName: group.userName,
    }))
  ) || [];

const vehicles: Vehicle[] = rawVehicles
  .filter((item) => item && !localRemovedIds.includes(item.id))
  .map((item, idx) => ({
    sno: idx + 1,
    id: item.id,
    licensePlate: formatLicensePlate(item.license, item.licenseNo),
    vehicleETagId: item.eTagId || '-',
    eTagType: item.eTagId || '-',
    issueDate: formatDateDisplay(item.validFrom),
    expiryDate: formatDateDisplay(item.validTo),
    ownership: item.externalUserId || '-',
    externalUserName: item.externalUserName || '-',
    make: item.make || '-',
    model: item.model || '-',
    year: item.year || '-',
    color: item.color || '-',
    tagStatus: item.tagStatus ?? null,
  }));
  const handleView = (vehicle: Vehicle) => {
  setSelectedRow(vehicle);
  setViewModalOpen(true);
  };

  const handleAddNew = () => {
    router.push('/vehicle?modal=add');
  };

  const handleEdit = (vehicle: Vehicle) => {
    saveTableRow('vehicle', { id: vehicle.id });
    router.push(`/vehicle?modal=edit&id=${encodeURIComponent(vehicle.id)}`);
  };

  const handleCloseModal = () => {
    setEditVehicleId(undefined);
    setHasCheckedId(false);
    setFormError('');
    router.push('/vehicle');
  };

  const toDateInputValue = (value?: string | null) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  const toIsoDate = (value?: string) => {
    if (!value) return new Date().toISOString();
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  };

  const splitLicense = (license?: string | null) => {
    const normalized = (license || '').trim();
    if (!normalized) return { vehicleNo: '', vehicleNo2: '' };
    const [firstPart, secondPart = ''] = normalized.split('-');
    return { vehicleNo: firstPart || '', vehicleNo2: secondPart || '' };
  };

  const handleAddVehicle = async (data: ProfileFormData) => {
    setFormError('');
    try {
      const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      let createdBy = 'system';
      if (userRaw) {
        try {
          const user = JSON.parse(userRaw);
          createdBy = user?.fullName || user?.name || user?.email || 'system';
        } catch {
          createdBy = 'system';
        }
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

      await createVehicle({
        license: data.vehicleNo || '',
        licenseNo: Number(data.vehicleNo2),
        make: data.make || '',
        model: data.model || '',
        color: data.color || '',
        year: data.year || '',
        eTagId: data.eTagId || '',
        validFrom: toIsoDate(data.issueDate),
        validTo: toIsoDate(data.expiryDate),
        tagStatus: data.eTagStatus === 'active' ? 1 : 0,
        isActive: true,
        externalUserId,
        createdBy,
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to create vehicle';
      setFormError(message);
    }
  };

  const initialVehicleValues = useMemo<ProfileFormData | null>(() => {
    if (!editVehicleDetails || !editVehicleDetails.data) return null;
    const data = editVehicleDetails.data;
    return {
      vehicleNo: splitLicense(data.license).vehicleNo,
      vehicleNo2: String(data.licenseNo ?? ''),
      licensePlate: data.licenseNo ? `${data.license || ''}-${data.licenseNo}` : data.license || '',
      make: data.make || '',
      model: data.model || '',
      color: data.color || '',
      year: data.year || '',
      eTagId: data.eTagId || '',
      issueDate: toDateInputValue(data.validFrom),
      expiryDate: toDateInputValue(data.validTo),
      eTagStatus: data.tagStatus === 1 ? 'active' : 'inactive',
      isActive: data.isActive,
    };
  }, [editVehicleDetails]);

  const handleUpdateVehicle = async (data: ProfileFormData) => {
    if (!editVehicleId || !editVehicleDetails?.data) return;
    setFormError('');
    try {
      const vehicleData = editVehicleDetails.data;
      await updateVehicle({
        id: editVehicleId,
        license: data.vehicleNo || vehicleData.license || '',
        licenseNo: data.vehicleNo2 ? Number(data.vehicleNo2) : vehicleData.licenseNo,
        make: data.make || vehicleData.make || '',
        model: data.model || vehicleData.model || '',
        color: data.color || vehicleData.color || '',
        year: data.year || vehicleData.year || '',
        eTagId: data.eTagId || vehicleData.eTagId || '',
        validFrom: toIsoDate(data.issueDate),
        validTo: toIsoDate(data.expiryDate),
        tagStatus: data.eTagStatus === 'active' ? 1 : 0,
        isActive: data.isActive ?? vehicleData.isActive,
        externalUserId: vehicleData.externalUserId,
      });
      handleCloseModal();
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to update vehicle';
      setFormError(message);
    }
  };

  const handleDelete = (vehicle: SelectedVehicleRow) => {
    setSelectedVehicle(vehicle);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVehicle) {
      return;
    }

    try {
      const response = await deleteVehicle({ id: selectedVehicle.id });
      const isSuccess = response?.statusCode === 0 || response?.statusCode === 200 || response?.statusCode === 204;
      if (isSuccess) {
        setLocalRemovedIds((prev) => [...prev, selectedVehicle.id]);
      }
    } catch {
      // Keep modal flow stable even when API fails.
    }

    setDeleteModalOpen(false);
    setSelectedVehicle(null);
  };

  const columns: Column<Vehicle>[] = [
    { key: 'sno', header: 'S.No' },
    {
      key: 'externalUserName',
      header: 'Ownership',
      render: (value) => value || '-',
    },
    { key: 'licensePlate', header: 'License Plate' },
    { key: 'vehicleETagId', header: 'Vehicle E-Tag ID' },
    { key: 'eTagType', header: 'E-Tag Type' },
    { key: 'issueDate', header: 'Issue Date' },
    { key: 'expiryDate', header: 'Expiry Date' },
    // Removed Ownership ID column as requested
    { key: 'make', header: 'Make' },
    { key: 'model', header: 'Model' },
    { key: 'year', header: 'Year' },
    {
      key: 'color',
      header: 'Color',
      render: (value: string) => (
        value && value !== '-' ? value : '-'
      ),
    },
    {
      key: 'tagStatus',
      header: 'Tag Status',
      render: (value: number | null) => <StatusBadge type="tagStatus" value={value} />,
    },
    {
  key: 'action',
  header: 'Action',
  render: (_, row) => (
    <div style={{ display: 'flex', gap: '6px' }}>
      <button
        onClick={() => handleView(row)}
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          border: "1px solid #ddd",
          background: "white",
          cursor: "pointer"
        }}
      >
        <Eye size={18} />
      </button>
    </div>
  )
}
  ];

  return (
    <DashboardLayout pageTitle="Vehicle">
      <DataTable<Vehicle>
        columns={columns}
        data={vehicles}
        loading={isLoading}
        onAddClick={handleAddNew}
        addButtonLabel="Add New"
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        error={isError ? `Failed to load vehicles: ${error instanceof Error ? error.message : 'Unknown error'}` : undefined}
      />

      <FormModal
        isOpen={modalMode === 'add'}
        onClose={handleCloseModal}
        title="Add New Vehicle"
      >
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleAddVehicle}
          onCancel={handleCloseModal}
          fields={enumFields}
          saveButtonText="Create"
          loading={loadingEnums}
          showStatusToggle={false}
        />
      </FormModal>

      <FormModal
        isOpen={modalMode === 'edit' && hasCheckedId}
        onClose={handleCloseModal}
        title="Edit Vehicle"
      >
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        {isEditVehicleLoading || loadingEnums ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : initialVehicleValues ? (
          <CommonEntityForm
            key={editVehicleId}
            title="Please update details below!"
            onSave={handleUpdateVehicle}
            onCancel={handleCloseModal}
            fields={enumFields}
            initialValues={initialVehicleValues}
            saveButtonText="Update"
            showStatusToggle={false}
          />
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>Error loading vehicle details</div>
        )}
      </FormModal>
      <FormModal
  isOpen={viewModalOpen}
  onClose={() => {
    setViewModalOpen(false);
    setSelectedRow(null);
  }}
  title="Vehicle Details"
>
  {selectedRow ? (
    <div
      style={{
        maxWidth: "340px",
        margin: "0 auto",
        display: "grid",
        gap: "10px",
        padding: "10px 0",
      }}
    >
      {[
        { label: "License Plate", value: selectedRow.licensePlate },
        { label: "Vehicle E-Tag ID", value: selectedRow.vehicleETagId },
        { label: "E-Tag Type", value: selectedRow.eTagType },
        { label: "Issue Date", value: selectedRow.issueDate },
        { label: "Expiry Date", value: selectedRow.expiryDate },
        { label: "Ownership", value: selectedRow.externalUserName },
        { label: "Make", value: selectedRow.make },
        { label: "Model", value: selectedRow.model },
        { label: "Year", value: selectedRow.year },
        { label: "Color", value: selectedRow.color },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "9px 12px",
            borderRadius: "10px",
            background: "#f9fafb",
            border: "1px solid #eef2f7",
          }}
        >
          {/* LABEL */}
          <span
            style={{
              color: "#16a34a",
              fontWeight: 600,
              fontSize: "13px",
              minWidth: "130px",
            }}
          >
            {item.label}
          </span>

          {/* VALUE */}
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
        title="Delete Vehicle"
        message={isDeleting ? 'Deleting...' : 'Are you sure you want to delete this vehicle? This action cannot be undone.'}
      />
    </DashboardLayout>
  );
}
