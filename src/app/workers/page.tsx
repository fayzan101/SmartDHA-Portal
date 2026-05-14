'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import WarningModal from '../../components/popup/WarningModal';
import FormModal from '../../components/popup/FormModal';
import CommonEntityForm, { ProfileFormData } from '../../components/forms/CommonEntityForm';
import { saveTableRow, clearTableRow, getTableRow } from '../../lib/tableRowStorage';
import { useWorkerById } from '../../hooks/workers/useWorkerById';
import { useCreateWorker } from '../../hooks/workers/useCreateWorker';
import { useUpdateWorker } from '../../hooks/workers/useUpdateWorker';
import { useDeleteWorker } from '../../hooks/workers/useDeleteWorker';
import { workerFields } from './fields';
import { getAllExternalWorkers } from '../../services/worker.service';
import { useSearch } from '@/context/searchContext';

interface Worker {
  id: string;
  workerName: string;
  jobType: string;
  phone: string;
  dob: string;
  cnicNicopNo: string;
  policeVerification: 'Yes' | 'No';
  workerCardDelivery: string;
  fatherOrHusbandName?: string;
  workerStatus: boolean;
  workerCard: string;
  issuedDate?: string;
  expiryDate?: string;
  cardStatus?: number;
  sno?: number;
}

type SelectedWorkerRow = { id: string };

const pageSize = 10;

const toJobTypeLabel = (jobType?: number) => {
  switch (jobType) {
    case 0: return 'Driver';
    case 1: return 'Cook';
    case 2: return 'Guard';
    case 3: return 'Peon';
    case 4: return 'Gardener';
    default: return 'Unknown';
  }
};

export default function WorkersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { searchValue } = useSearch();

  const [allWorkers, setAllWorkers] = useState<Worker[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<SelectedWorkerRow | null>(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Worker | null>(null);

  const [formError, setFormError] = useState('');

  const modalMode = searchParams?.get('modal');
  const modalId = searchParams?.get('id');

  const { data: editWorkerDetails, isLoading: isEditWorkerLoading } = useWorkerById(modalId || undefined);
  const { mutateAsync: createWorker } = useCreateWorker();
  const { mutateAsync: updateWorker } = useUpdateWorker();
  const { mutateAsync: deleteWorker } = useDeleteWorker();

  // ==============================
  // FETCH ALL WORKERS (NO PARAMS)
  // ==============================
  const fetchWorkers = async () => {
    try {
      const res = await getAllExternalWorkers(); // NO pagination params

      const mapped: Worker[] =
        (res?.data?.items ?? []).flatMap((user: any, userIdx: number) =>
          (user.workers ?? []).map((w: any, idx: number) => ({
            sno: userIdx * 100 + idx + 1,
            id: w.workerId,
            workerName: w.name || '-',
            jobType: toJobTypeLabel(w.jobType),
            phone: w.phoneNo || '-',
            dob: w.dob || '-',
            cnicNicopNo: w.cnic || '-',
            policeVerification: w.policeVerification ? 'Yes' : 'No',
            workerCardDelivery: w.workerCardDeliveryType || '-',
            workerStatus: w.isActive ?? false,
            workerCard: w.workerCardNo || '-',
            issuedDate: w.validFrom || '-',
            expiryDate: w.validTo || '-',
            cardStatus: w.cardStatus ?? 0,
          }))
        );

      setAllWorkers(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  // ==============================
  // SEARCH
  // ==============================
  const filteredWorkers = useMemo(() => {
    return allWorkers.filter((item) =>
      item.workerName.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.jobType.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.dob.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.cnicNicopNo.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [allWorkers, searchValue]);

  // ==============================
  // PAGINATION (CLIENT SIDE)
  // ==============================
  const totalPages = Math.ceil(filteredWorkers.length / pageSize);

  const paginatedWorkers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredWorkers.slice(start, start + pageSize);
  }, [filteredWorkers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  // ==============================
  // ACTIONS
  // ==============================
  const handleAddNew = () => router.push('/workers?modal=add');

  const handleEdit = (worker: Worker) => {
    saveTableRow('workers', { id: worker.id });
    router.push(`/workers?modal=edit&id=${worker.id}`);
  };

  const handleView = (worker: Worker) => {
    setSelectedRow(worker);
    setViewModalOpen(true);
  };

  const handleDelete = (worker: SelectedWorkerRow) => {
    setSelectedWorker(worker);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedWorker) return;

    try {
      await deleteWorker({ id: selectedWorker.id });
      fetchWorkers(); // refresh
    } catch (err) {
      console.error(err);
    }

    setDeleteModalOpen(false);
    setSelectedWorker(null);
  };

  // ==============================
  // COLUMNS
  // ==============================
  const columns: Column<Worker>[] = [
    { key: 'sno', header: 'S.No' },
    { key: 'workerName', header: 'Worker Name' },
    { key: 'jobType', header: 'Job Type' },
    { key: 'phone', header: 'Phone' },
    { key: 'dob', header: 'DOB' },
    { key: 'cnicNicopNo', header: 'CNIC' },
    { key: 'policeVerification', header: 'Police Verification' },
    {
      key: 'workerStatus',
      header: 'Status',
      render: (value: boolean) => <StatusBadge type="activeInactive" value={value} />
    },
    { key: 'workerCard', header: 'Card No' },
    { key: 'issuedDate', header: 'Issued' },
    { key: 'expiryDate', header: 'Expiry' },
  ];

  return (
    <DashboardLayout pageTitle="Workers">
      <DataTable<Worker>
        columns={columns}
        data={paginatedWorkers}
        loading={false}
        onAddClick={handleAddNew}
        addButtonLabel="Add New"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* VIEW MODAL */}
      <FormModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Worker Details"
      >
        {selectedRow ? (
          <div style={{ display: 'grid', gap: 10 }}>
            <div>Name: {selectedRow.workerName}</div>
            <div>Job: {selectedRow.jobType}</div>
            <div>Phone: {selectedRow.phone}</div>
            <div>CNIC: {selectedRow.cnicNicopNo}</div>
          </div>
        ) : (
          <div>No data selected</div>
        )}
      </FormModal>

      {/* DELETE MODAL */}
      <WarningModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Worker"
        message="Are you sure you want to delete this worker?"
      />
    </DashboardLayout>
  );
}