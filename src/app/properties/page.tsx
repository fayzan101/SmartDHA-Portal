'use client';

import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { Column, StatusBadge } from '../../components/tables/DataTable';
import FormModal from '../../components/popup/FormModal';
import { Eye } from 'lucide-react';
import { useProperties } from '../../hooks/properties/useProperties';

// ==============================
// TYPES
// ==============================
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

// ==============================
// COMPONENT
// ==============================
export default function PropertiesPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PropertyRow | null>(null);

  // ✅ USE HOOK (NO FETCH)
  const { data, isLoading, isError, error } = useProperties(currentPage -1 , 10);

  // ==============================
  // DATA MAPPING (IMPORTANT)
  // ==============================
  
const flatProperties =
  (data?.data?.items ?? []).flatMap((user: any) =>
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

const properties: PropertyRow[] = flatProperties.map((item: any, idx: number) => ({
  ...item,
  sno: idx + 1,
}));
  // ==============================
  // VIEW HANDLER
  // ==============================
  const handleView = (row: PropertyRow) => {
    setSelectedRow(row);
    setViewModalOpen(true);
  };

  // ==============================
  // TABLE COLUMNS
  // ==============================
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
    {
      key: 'status',
      header: 'Status',
      render: (value: boolean) => (
        <StatusBadge type="activeInactive" value={value} />
      ),
    },
  ];

  // ==============================
  // RENDER
  // ==============================
  return (
    <DashboardLayout pageTitle="Properties">
      <DataTable<PropertyRow>
        columns={columns}
        data={properties}
        loading={isLoading}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        addButtonLabel={undefined}
        error={
          isError
            ? `Failed to load properties: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`
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