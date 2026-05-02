'use client';

import { useState, useMemo } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { Column } from '../../components/tables/DataTable';
import { useMemberTypesRequests } from '../../hooks/membertypes/useMemberTypes';
import { Eye } from 'lucide-react';
import FormModal from '../../components/popup/FormModal';

export default function NonMemberPage() {
  const { data = [], isLoading } = useMemberTypesRequests();

  // ==============================
  // TAB STATE
  // ==============================
  const [mainTab, setMainTab] = useState('residentialCommercial');
  const [subTab, setSubTab] = useState('residential');

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  // ==============================
  // CATEGORY SPLIT
  // ==============================
  const categorizedData = useMemo(() => {
    const categories = {
      residential: [] as any[],
      commercial: [] as any[],
      educationalVisitor: [] as any[],
      commercialEmployee: [] as any[],
      houseHelp: [] as any[],
      visitor: [] as any[],
      other: [] as any[],
    };

    data.forEach((item: any) => {
      const cat = item.categoryName?.toLowerCase();

      if (cat === 'residential') categories.residential.push(item);
      else if (cat === 'commercial') categories.commercial.push(item);
      else if (cat === 'educational visitor') categories.educationalVisitor.push(item);
      else if (cat === 'commercial employee') categories.commercialEmployee.push(item);
      else if (cat === 'house help worker') categories.houseHelp.push(item);
      else if (cat === 'visitor') categories.visitor.push(item);
      else categories.other.push(item);
    });

    return categories;
  }, [data]);

  // ==============================
  // FILTER DATA
  // ==============================
  const currentData = useMemo(() => {
    if (mainTab === 'residentialCommercial') {
      return subTab === 'residential'
        ? categorizedData.residential
        : categorizedData.commercial;
    }

    if (mainTab === 'educationalVisitor') return categorizedData.educationalVisitor;
    if (mainTab === 'commercialEmployee') return categorizedData.commercialEmployee;
    if (mainTab === 'houseHelp') return categorizedData.houseHelp;
    if (mainTab === 'visitor') return categorizedData.visitor;

    return categorizedData.other;
  }, [mainTab, subTab, categorizedData]);

  // ==============================
  // TABLE DATA
  // ==============================
  const tableData = useMemo(() => {
    return currentData.map((item: any, idx: number) => ({
      sno: idx + 1,
      id: item.id,

      name: item.name || '-',
      cnic: item.cnic || '-',
      phone: item.phoneNumber || '-',

      category: item.categoryName || '-',
      subCategory: item.subCategoryName || '-',

      vehicle: item.vehicleNumber || '-',
      purpose: item.purposeVisit || '-',

      phase: item.phaseName || '-',
      zone: item.zoneName || '-',
      khayaban: item.khayaban || '-',
      lane: item.laneNo || '-',
      plot: item.plotNo || '-',
      floors: item.floors || '-',

      raw: item,
    }));
  }, [currentData]);

  const handleView = (row: any) => {
    setSelectedRow(row);
    setViewModalOpen(true);
  };

  // ==============================
  // TABLE COLUMNS
  // ==============================
  const columns: Column<any>[] = [
    { key: 'sno', header: 'S.No' },
    { key: 'name', header: 'Name' },
    { key: 'cnic', header: 'CNIC' },
    { key: 'phone', header: 'Phone' },

    { key: 'phase', header: 'Phase' },
    { key: 'zone', header: 'Zone' },
    { key: 'khayaban', header: 'Khayaban' },
    { key: 'lane', header: 'Lane' },
    { key: 'plot', header: 'Plot' },
    { key: 'floors', header: 'Floor' },

    {
      key: 'action',
      header: 'Action',
      render: (_, row) => (
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
      ),
    },
  ];

  return (
    <DashboardLayout pageTitle="Non Member Requests">

      {/* ==============================
          MAIN TABS (NO UNDERLINE)
      ============================== */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e5e7eb',
      }}>
        {[
          { key: 'residentialCommercial', label: 'Residential / Commercial' },
          { key: 'educationalVisitor', label: 'Educational Visitor' },
          { key: 'commercialEmployee', label: 'Commercial Employee' },
          { key: 'houseHelp', label: 'House-Help Worker' },
          { key: 'visitor', label: 'Visitor' },
          { key: 'other', label: 'Other' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setMainTab(tab.key)}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'transparent',
              color: mainTab === tab.key ? '#22c55e' : '#6b7280',
              cursor: 'pointer',
              fontWeight: mainTab === tab.key ? 600 : 500,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==============================
          SUB TABS (FULL WIDTH 50-50)
      ============================== */}
      {mainTab === 'residentialCommercial' && (
        <div style={{
          display: 'flex',
          width: '100%',
          borderBottom: '1px solid #e5e7eb',
        }}>
          {[
            { key: 'residential', label: 'Residential' },
            { key: 'commercial', label: 'Commercial' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSubTab(tab.key)}
              style={{
                flex: 1, // ✅ equal width
                padding: '12px 0',
                border: 'none',
                background: 'transparent',
                color: subTab === tab.key ? '#22c55e' : '#9ca3af',
                cursor: 'pointer',
                fontWeight: subTab === tab.key ? 600 : 500,
                textAlign: 'center',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ==============================
          TABLE
      ============================== */}
      <div style={{ marginTop: 16 }}>
        <DataTable
          columns={columns}
          data={tableData}
          loading={isLoading}
          emptyMessage={isLoading ? 'Loading...' : 'No data found'}
        />
      </div>

      {/* ==============================
          VIEW MODAL
      ============================== */}
      <FormModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedRow(null);
        }}
        title="Request Details"
      >
        {selectedRow ? (
          <div style={{ display: "grid", gap: "10px" }}>
            {[
              { label: "Name", value: selectedRow.name },
              { label: "CNIC", value: selectedRow.cnic },
              { label: "Phone", value: selectedRow.phone },
              { label: "Phase", value: selectedRow.phase },
              { label: "Zone", value: selectedRow.zone },
              { label: "Khayaban", value: selectedRow.khayaban },
              { label: "Lane", value: selectedRow.lane },
              { label: "Plot", value: selectedRow.plot },
              { label: "Floor", value: selectedRow.floors },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                background: "#f9fafb",
                borderRadius: 8
              }}>
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <div>No data</div>
        )}
      </FormModal>

    </DashboardLayout>
  );
}