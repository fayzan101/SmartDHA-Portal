'use client';

import { useState, useMemo } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { Column } from '../../components/tables/DataTable';
import { useMemberTypesRequests } from '../../hooks/membertypes/useMemberTypes';
import { Eye } from 'lucide-react';
import FormModal from '../../components/popup/FormModal';
import CommonEntityForm from '../../components/forms/CommonEntityForm';
import { nonMemberFields } from './nonmemberfield';
import { useRouter } from 'next/navigation';

export default function NonMemberPage() {
  const { data = [], isLoading } = useMemberTypesRequests();

  const [mainTab, setMainTab] = useState('residentialCommercial');
  const [subTab, setSubTab] = useState('residential');

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const router = useRouter();
  const [addModalOpen, setAddModalOpen] = useState(false);

  // ================= STYLE =================
  const btnStyle = {
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "white",
    cursor: "pointer"
  };

  // ================= DATA MAP =================
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

      // FIXED MATCH
      else if (cat === 'education visitor' || cat === 'educational visitor')
        categories.educationalVisitor.push(item);

      else if (cat === 'commercial employee')
        categories.commercialEmployee.push(item);

      else if (cat === 'house help worker')
        categories.houseHelp.push(item);

      else if (cat === 'visitor')
        categories.visitor.push(item);

      else categories.other.push(item);
    });

    return categories;
  }, [data]);

  // ================= FILTER =================
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

  // ================= TABLE DATA =================
  const tableData = useMemo(() => {
    return currentData.map((item: any, idx: number) => ({
      sno: idx + 1,
      id: item.id,
      userId: item.userId,
      name: item.name || '-',
      email: item.email || '-',
      phone: item.phoneNumber || '-',

      cnic: item.cnic || '-',

      subCategory: item.subCategoryName || '-',

      institute: item.instituteName || '-',
      employerRegNo: item.employeeRegistrationNumber || '-',

      destination: item.destination || '-',
      purpose: item.purposeVisit || '-',
      vehicle: item.vehicleNumber || '-',

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

  // ================= DYNAMIC COLUMNS =================
  const columns: Column<any>[] = useMemo(() => {

    // EDUCATIONAL VISITOR
    if (mainTab === 'educationalVisitor') {
      return [
        { key: 'sno', header: 'S.No' },
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'phone', header: 'Phone' },
        { key: 'subCategory', header: 'Sub Category' },
        { key: 'institute', header: 'Institute' },
        { key: 'vehicle', header: 'Vehicle Info' },
      ];
    }

    // COMMERCIAL EMPLOYEE
    if (mainTab === 'commercialEmployee') {
      return [
        { key: 'sno', header: 'S.No' },
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'phone', header: 'Phone' },
        { key: 'subCategory', header: 'Sub Category' },
        { key: 'employerRegNo', header: 'Employer Reg No' },
      ];
    }

    // HOUSE HELP
    if (mainTab === 'houseHelp') {
      return [
        { key: 'sno', header: 'S.No' },
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'phone', header: 'Phone' },
        { key: 'subCategory', header: 'Sub Category' },
      ];
    }

    // VISITOR
    if (mainTab === 'visitor') {
      return [
        { key: 'sno', header: 'S.No' },
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'phone', header: 'Phone' },
        { key: 'subCategory', header: 'Sub Category' },
        { key: 'destination', header: 'Destination' },
        { key: 'vehicle', header: 'Vehicle Info' },
      ];
    }

    // OTHER
    if (mainTab === 'other') {
      return [
        { key: 'sno', header: 'S.No' },
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'phone', header: 'Phone' },
        { key: 'subCategory', header: 'Sub Category' },
        { key: 'purpose', header: 'Purpose of Visit' },
        { key: 'vehicle', header: 'Vehicle Info' },
      ];
    }

    // DEFAULT (RESIDENTIAL / COMMERCIAL)
    return [
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
  render: (_, row) => {
    if (subTab === 'residential') {
      return (
        <button
          onClick={() => router.push(`/familydetails/${row.userId}`)}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid #22c55e',
            background: '#22c55e',
            color: '#fff',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          View More
        </button>
      );
    }
  },
}
    ];
  }, [mainTab, subTab]);

  return (
    <DashboardLayout pageTitle="Member Types">

      {/* TABS */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
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

      {/* SUB TABS */}
      {mainTab === 'residentialCommercial' && (
        <div style={{ display: 'flex', width: '100%', borderBottom: '1px solid #e5e7eb' }}>
          {[
            { key: 'residential', label: 'Residential' },
            { key: 'commercial', label: 'Commercial' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSubTab(tab.key)}
              style={{
                flex: 1,
                padding: '12px 0',
                border: 'none',
                background: 'transparent',
                color: subTab === tab.key ? '#22c55e' : '#9ca3af',
                fontWeight: subTab === tab.key ? 600 : 500,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* TABLE */}
      <div style={{ marginTop: 16 }}>
        <DataTable
          columns={columns}
          data={tableData}
          loading={isLoading}
          emptyMessage="No data found"
        />
      </div>

      {/* VIEW MODAL */}
      <FormModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Request Details"
      >
        {selectedRow ? (
          <div style={{ display: "grid", gap: "10px" }}>
            {Object.entries(selectedRow).map(([k, v], i) => (
              k !== 'raw' && (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px",
                  background: "#f9fafb",
                  borderRadius: 8
                }}>
                  <span>{k}</span>
                  <span>{String(v)}</span>
                </div>
              )
            ))}
          </div>
        ) : (
          <div>No data</div>
        )}
      </FormModal>

      {/* ADD MODAL */}
      <FormModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Non Member"
      >
        <CommonEntityForm
          title="Enter Details"
          fields={nonMemberFields}
          onSave={() => setAddModalOpen(false)}
          onCancel={() => setAddModalOpen(false)}
          saveButtonText="Create"
          showStatusToggle={false}
        />
      </FormModal>

    </DashboardLayout>
  );
}