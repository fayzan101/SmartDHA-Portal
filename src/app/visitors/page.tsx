'use client';

import { useEffect, useState, useMemo } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { Column } from '../../components/tables/DataTable';
import { useSearch } from '@/context/searchContext';

interface Visitor {
  sno: number;
  id: string;
  visitorName: string;
  cnicNicopNo: string;
  vehicleInfo: string;
  visitDetail: string;
  validity: string;
  status: boolean;
}

type TabType = 'upcoming' | 'previous';

export default function VisitorPage() {
  const [upcoming, setUpcoming] = useState<Visitor[]>([]);
  const [previous, setPrevious] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  const { searchValue } = useSearch();

  // ================= FETCH =================
  const fetchVisitors = async () => {
    try {
      setLoading(true);
      setError('');

      const token =
        localStorage.getItem('token') ||
        sessionStorage.getItem('token');

      const res = await fetch(
        'https://dfpwebp.dhakarachi.org/api/smartdha/visitorpass/get-all-visitors',
        {
          method: 'POST',
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pageNumber: currentPage - 1,
            pageSize: 10,
          }),
        }
      );

      const json = await res.json();
      const data = json?.data;

      const upcomingRaw = data?.upcomingVisitors || [];
      const previousRaw = data?.previousVisitors || [];

      const mapVisitor = (item: any, idx: number): Visitor => ({
        sno: idx + 1,
        id: item.id,
        visitorName: item.name || '-',
        cnicNicopNo: item.cnic || '-',
        vehicleInfo:
          item.vehicleLicense || item.vehicleLicenseNo
            ? `${item.vehicleLicense || ''}${
                item.vehicleLicenseNo ? `-${item.vehicleLicenseNo}` : ''
              }`
            : '-',
        visitDetail: item.visitorPassType || '-',
        validity: `${item.fromDate?.split('T')[0] || ''} - ${
          item.toDate?.split('T')[0] || ''
        }`,
        status: true,
      });

      setUpcoming(upcomingRaw.map(mapVisitor));
      setPrevious(previousRaw.map(mapVisitor));
    } catch (err: any) {
      setError(err?.message || 'Failed to load visitors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [currentPage]);

  // ================= ACTIVE DATA =================
  const activeData = activeTab === 'upcoming' ? upcoming : previous;

  // ================= SEARCH =================
  const filteredVisitors = useMemo(() => {
    return activeData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [activeData, searchValue]);

  // ================= COLUMNS =================
  const columns: Column<Visitor>[] = [
    { key: 'sno', header: 'S.No' },
    { key: 'visitorName', header: 'Visitor Name' },
    { key: 'vehicleInfo', header: 'Vehicle Info' },
    { key: 'visitDetail', header: 'Visit Detail' },
    { key: 'validity', header: 'Validity' },
    { key: 'cnicNicopNo', header: 'CNIC/NICOP No' },
  ];

  return (
    <DashboardLayout pageTitle="Visitor Pass">

      {/* ================= TABS ================= */}
      {/* WRAPPER to match table width */}
<div style={{ width: '100%' }}>
  
  {/* TABS */}
  <div
    style={{
      display: 'flex',
      width: '100%',
      borderBottom: '1px solid #e5e7eb',
    }}
  >
    <button
      onClick={() => setActiveTab('upcoming')}
      style={{
        flex: 1, // 👈 equal width
        padding: '12px 20px',
        border: 'none',
        background: 'transparent',
        color: activeTab === 'upcoming' ? '#22c55e' : '#6b7280',
        fontWeight: activeTab === 'upcoming' ? 600 : 500,
        cursor: 'pointer',
        textAlign: 'center', // 👈 center text
      }}
    >
      Upcoming Visitors
    </button>

    <button
      onClick={() => setActiveTab('previous')}
      style={{
        flex: 1, // 👈 equal width
        padding: '12px 20px',
        border: 'none',
        background: 'transparent',
        color: activeTab === 'previous' ? '#22c55e' : '#6b7280',
        fontWeight: activeTab === 'previous' ? 600 : 500,
        cursor: 'pointer',
        textAlign: 'center', // 👈 center text
      }}
    >
      Previous Visitors
    </button>
  </div>
</div>

      {/* ================= TABLE ================= */}
      <DataTable<Visitor>
        columns={columns}
        data={filteredVisitors}
        loading={loading}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        error={error || undefined}
      />
    </DashboardLayout>
  );
}