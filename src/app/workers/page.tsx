'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { StatusBadge, Column } from '../../components/tables/DataTable';
import WarningModal from '../../components/popup/WarningModal';
import FormModal from '../../components/popup/FormModal';

import { useSearch } from '@/context/searchContext';
import { useWorkers } from '../../hooks/workers/useWorkers';
import { useDeleteWorker } from '../../hooks/workers/useDeleteWorker';
import { saveTableRow } from '../../lib/tableRowStorage';

interface Worker {
  id: string;
  workerName: string;
  jobType: string;
  phone: string;
  dob: string;
  cnicNicopNo: string;
  policeVerification: 'Yes' | 'No';
  workerCardDelivery: string;
  workerStatus: boolean;
  workerCard: string;
  issuedDate?: string;
  expiryDate?: string;
  sno?: number;
}

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
  const { searchValue } = useSearch();

  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<{ id: string } | null>(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Worker | null>(null);

  const { data, isLoading } = useWorkers();
  const { mutateAsync: deleteWorker } = useDeleteWorker();

  // =========================
  // FLATTEN API DATA (FIX CORE ISSUE)
  // =========================
  const allWorkers: Worker[] = useMemo(() => {
    const users = data ?? [];

    return users.flatMap((user: any, userIdx: number) =>
      (user.workers ?? []).map((w: any, idx: number) => ({
        sno: userIdx * 100 + idx + 1,
        id: w.workerId,
        workerName: w.name || '-',
        jobType: toJobTypeLabel(w.jobType),
        phone: w.phoneNo || '-',
        dob: w.dob || '-',
        cnicNicopNo: w.cnic || '-',
        policeVerification: w.policeVerification ? 'Yes' : 'No',
        workerCardDelivery: String(w.workerCardDeliveryType ?? '-'),
        workerStatus: w.isActive ?? false,
        workerCard: w.workerCardNumber || '-',
        issuedDate: w.validFrom || '-',
        expiryDate: w.validTo || '-',
      }))
    );
  }, [data]);

  // =========================
  // SEARCH
  // =========================
  const filteredWorkers = useMemo(() => {
    return allWorkers.filter((item) =>
      Object.values(item).join(' ').toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [allWorkers, searchValue]);

  // reset page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.max(1, Math.ceil(filteredWorkers.length / pageSize));

  const paginatedWorkers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredWorkers.slice(start, start + pageSize);
  }, [filteredWorkers, currentPage]);

  // =========================
  // ACTIONS
  // =========================
  const handleAddNew = () => router.push('/workers?modal=add');

  const handleEdit = (worker: Worker) => {
    saveTableRow('workers', { id: worker.id });
    router.push(`/workers?modal=edit&id=${worker.id}`);
  };

  const handleView = (worker: Worker) => {
    setSelectedRow(worker);
    setViewModalOpen(true);
  };

  const handleDelete = (worker: { id: string }) => {
    setSelectedWorker(worker);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedWorker) return;

    await deleteWorker({ id: selectedWorker.id });

    setDeleteModalOpen(false);
    setSelectedWorker(null);
  };

  // =========================
  // TABLE COLUMNS
  // =========================
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
      render: (value: boolean) => (
        <StatusBadge type="activeInactive" value={value} />
      ),
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
        loading={isLoading}
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