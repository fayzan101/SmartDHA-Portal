'use client';

import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { Column, StatusBadge } from '../../components/tables/DataTable';
import FormModal from '../../components/popup/FormModal';
import { useProperties } from '../../hooks/properties/useProperties';
import { useSearch } from "@/context/searchContext";
import { useRouter } from 'next/navigation';

interface PropertyRow {
  sno: number;
  id: string;
  userName: string;
  category: string;
  subCategory: string;
  phase: string;
  zone: string;
  street: string;
  plot: string;
  propertyTag: string;
  possessionType: string;
  status: boolean;
}

type TabType = 'active' | 'inactive';

export default function PropertiesPage() {
  const router = useRouter();
  const { searchValue } = useSearch();

  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PropertyRow | null>(null);

  // ✅ Tabs
  const [tab, setTab] = useState<TabType>('active');

  // ✅ API CALLS
  const activeQuery = useProperties(currentPage - 1, 10, true);
  const inactiveQuery = useProperties(currentPage - 1, 10, false);

  // ----------------------------
  // ACTIVE DATA
  // ----------------------------
  const activeProperties =
    (activeQuery.data?.data?.items ?? []).flatMap((user: any) =>
      (user.activeProperties ?? []).map((prop: any) => ({
        id: prop.id,
        userName: user.userName || '-',
        category: prop.categoryName || '-',
        subCategory: prop.subCategoryName || '-',
        phase: prop.phaseName || '-',
        zone: prop.zoneName || '-',
        street: prop.streetNo || '-',
        plot: prop.plot || '-',
        propertyTag: prop.propertyTag || '-',
        possessionType: prop.possessionType || '-',
        status: prop.isActive ?? false,
      }))
    );

  // ----------------------------
  // INACTIVE DATA
  // ----------------------------
  const inactiveProperties =
    (inactiveQuery.data?.data?.items ?? []).flatMap((user: any) =>
      (user.previousProperties ?? []).map((prop: any) => ({
        id: prop.id,
        userName: user.userName || '-',
        category: user.categoryName || '-',
        subCategory: user.subCategoryName || '-',
        phase: user.phaseName || '-',
        zone: user.zoneName || '-',
        street: prop.streetNo || '-',
        plot: prop.plot || '-',
        propertyTag: prop.propertyTag || '-',
        possessionType: prop.possessionType || '-',
        status: prop.isActive ?? false,
      }))
    );

  // ----------------------------
  // SELECT TAB DATA
  // ----------------------------
  const properties: PropertyRow[] =
    (tab === 'active' ? activeProperties : inactiveProperties).map(
      (item: any, idx: number) => ({
        ...item,
        sno: idx + 1,
      })
    );

  // ----------------------------
  // SEARCH FILTER
  // ----------------------------
  const filteredProperties = properties.filter((item) =>
    item.userName?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.subCategory?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.phase?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.zone?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.street?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.plot?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.propertyTag?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.possessionType?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const columns: Column<PropertyRow>[] = [
    { key: 'sno', header: 'S.No' },
    { key: 'userName', header: 'User Name' },
    { key: 'category', header: 'Category' },
    { key: 'subCategory', header: 'Sub Category' },
    { key: 'phase', header: 'Phase' },
    { key: 'zone', header: 'Zone' },
    { key: 'street', header: 'Street' },
    { key: 'plot', header: 'Plot' },
    { key: 'propertyTag', header: 'Property Tag' },
    { key: 'possessionType', header: 'Possession Type' },
  ];

  return (
    <DashboardLayout pageTitle="Properties">

      {/* ✅ NEW TAB STYLE */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: 12,
        }}
      >
        {[
          { key: 'active', label: 'Active' },
          { key: 'inactive', label: 'Inactive' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as TabType)}
            style={{
              flex: 1,
              padding: '14px 0',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'center',
              fontWeight: tab === t.key ? 600 : 500,
              color: tab === t.key ? '#22c55e' : '#6b7280',
              borderBottom:
                tab === t.key
                  ? '2px solid #22c55e'
                  : '2px solid transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <DataTable<PropertyRow>
        columns={columns}
        data={filteredProperties}
        loading={activeQuery.isLoading || inactiveQuery.isLoading}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        addButtonLabel={undefined}
        error={
          activeQuery.isError || inactiveQuery.isError
            ? 'Failed to load properties'
            : undefined
        }
      />

      {/* VIEW MODAL */}
      <FormModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedRow(null);
        }}
        title="Property Details"
      >
        {selectedRow ? (
          <div
            style={{
              width: "400px",
              maxWidth: "90vw",
              margin: "0 auto",
              display: "grid",
              gap: "10px",
              padding: "10px 0",
            }}
          >
            {[
              { label: "User Name", value: selectedRow.userName },
              { label: "Category", value: selectedRow.category },
              { label: "Sub Category", value: selectedRow.subCategory },
              { label: "Phase", value: selectedRow.phase },
              { label: "Zone", value: selectedRow.zone },
              { label: "Street", value: selectedRow.street },
              { label: "Plot", value: selectedRow.plot },
              { label: "Property Tag", value: selectedRow.propertyTag },
              { label: "Possession Type", value: selectedRow.possessionType },
              { label: "Status", value: selectedRow.status ? "Active" : "Inactive" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: "#f9fafb",
                  border: "1px solid #eef2f7",
                }}
              >
                <span style={{ color: "#16a34a", fontWeight: 600 }}>
                  {item.label}
                </span>
                <span style={{ textAlign: "right" }}>
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

    </DashboardLayout>
  );
}