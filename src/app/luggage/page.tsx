'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { Column } from '../../components/tables/DataTable';
import WarningModal from '../../components/popup/WarningModal';
import FormModal from '../../components/popup/FormModal';
import CommonEntityForm, { ProfileFormData } from '../../components/forms/CommonEntityForm';
import { useLuggage } from '../../hooks/luggage/useLuggage';
import { useLuggageById } from '../../hooks/luggage/useLuggageById';
import { useCreateLuggage } from '../../hooks/luggage/useCreateLuggage';
import { useUpdateLuggage } from '../../hooks/luggage/useUpdateLuggage';
import { useDeleteLuggage } from '../../hooks/luggage/useDeleteLuggage';
import { saveTableRow, clearTableRow, getTableRow } from '../../lib/tableRowStorage';
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

type TabType = 'upcoming' | 'previous';

export default function LuggagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { searchValue } = useSearch();

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLuggage, setSelectedLuggage] = useState<any>(null);
  const [localRemovedIds, setLocalRemovedIds] = useState<string[]>([]);
  const [formError, setFormError] = useState('');

  const { data, isLoading, isError, error } = useLuggage(1, 10);
  const { mutateAsync: deleteLuggage, isPending: isDeleting } = useDeleteLuggage();

  // ================= RAW DATA SPLIT =================
  const upcomingRaw = data?.data?.upcomingLuggage || [];
  const previousRaw = data?.data?.previousLuggage || [];

  // ================= MAP FUNCTION =================
  const mapLuggage = (item: any, idx: number): LuggagePass => ({
    sno: idx + 1,
    id: item.id,
    name: item.name,
    userName: item.externalUserName || '-',
    vehicleInfo: item.vehicleInfo || '-',
    visitDetail:
      item.luggagePassType === 1 ? 'Day Pass' :
      item.luggagePassType === 2 ? 'Long Stay' : '-',
    validity: `${item.fromDate?.split('T')[0] || '-'} - ${item.toDate?.split('T')[0] || '-'}`,
    cnicNicopNo: item.cnic,
    status: item.isActive && !item.isDeleted,
  });

  const upcoming = upcomingRaw.map(mapLuggage);
  const previous = previousRaw.map(mapLuggage);

  // ================= ACTIVE DATA =================
  const activeData =
    activeTab === 'upcoming' ? upcoming : previous;

  const filteredLuggagePasses = activeData
    .filter((item) => !localRemovedIds.includes(item.id))
    .filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchValue.toLowerCase())
      )
    );

  // ================= TABLE =================
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

      {/* ================= TABS (FULL WIDTH + CENTERED TEXT) ================= */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        {[
          { key: 'upcoming', label: 'Upcoming Luggage' },
          { key: 'previous', label: 'Previous Luggage' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TabType)}
            style={{
              flex: 1, // 👈 equal width
              padding: '14px 0',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'center', // 👈 center text
              fontWeight: activeTab === tab.key ? 600 : 500,
              color: activeTab === tab.key ? '#22c55e' : '#6b7280',
              borderBottom:
                activeTab === tab.key
                  ? '2px solid #22c55e'
                  : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= TABLE ================= */}
      <DataTable<LuggagePass>
        columns={columns}
        data={filteredLuggagePasses}
        loading={isLoading}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        error={
          isError
            ? `Failed to load luggage: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`
            : undefined
        }
      />

      {/* (modals unchanged — keep your existing code) */}
    </DashboardLayout>
  );
}