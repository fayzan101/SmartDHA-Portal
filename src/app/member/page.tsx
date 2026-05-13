'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { Column } from '../../components/tables/DataTable';
import FormModal from '../../components/popup/FormModal';
import { useSearch } from '@/context/searchContext';

interface Member {
  sno: number;
  userId: string;
  name: string;
  email: string;
  mobileNo: string;
  memberNo: string;
  memPk: string;
  userType: number;
  staffNo: string;
}

export default function MemberPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { searchValue } = useSearch();
  const router = useRouter();

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Member | null>(null);

  // ==============================
  // FETCH MEMBERS (PAGINATED)
  // ==============================
  const fetchMembers = async (page: number) => {
    try {
      setLoading(true);
      setError('');

      const token =
        localStorage.getItem('token') ||
        sessionStorage.getItem('token');

      const res = await fetch(
        'https://dfpwebp.dhakarachi.org/api/smartdha/user/members',
        {
          method: 'POST',
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pageNumber: page - 1, // API is 0-based
            pageSize: 10,
          }),
        }
      );

      const json = await res.json();
      const data = json?.data;

      if (!data) {
        setMembers([]);
        return;
      }

      setTotalPages(data.totalPages || 1);

      const mapped: Member[] = (data.items || []).map(
        (item: any, idx: number) => ({
          sno: (page - 1) * 10 + idx + 1,
          userId: item.userId,
          name: item.name,
          email: item.email || '-',
          mobileNo: item.mobileNo || '-',
          memberNo: item.memberNo || '-',
          memPk: item.memPk || '-',
          userType: item.userType,
          staffNo: item.staffNo || '-',
        })
      );

      setMembers(mapped);
    } catch (err: any) {
      setError(err?.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  // load on page change
  useEffect(() => {
    fetchMembers(currentPage);
  }, [currentPage]);

  // ==============================
  // VIEW MODAL
  // ==============================
  const handleView = (row: Member) => {
    setSelectedRow(row);
    setViewModalOpen(true);
  };

  // ==============================
  // TABLE COLUMNS
  // ==============================
  const columns: Column<Member>[] = [
    { key: 'sno', header: 'S.No' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'mobileNo', header: 'Mobile No' },
    { key: 'memberNo', header: 'Member No' },
    { key: 'memPk', header: 'MEM PK' },
  ];

  // ==============================
  // SEARCH FILTER
  // ==============================
  const filteredMembers = members.filter((item) =>
    item.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.mobileNo?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.memberNo?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.memPk?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <DashboardLayout pageTitle="Members">
      <DataTable<Member>
        columns={columns}
        data={filteredMembers}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        error={error || undefined}
      />

      {/* VIEW MODAL */}
      <FormModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedRow(null);
        }}
        title="Member Details"
      >
        {selectedRow ? (
          <div style={{ display: 'grid', gap: '10px' }}>
            {[
              { label: 'Name', value: selectedRow.name },
              { label: 'Email', value: selectedRow.email },
              { label: 'Mobile', value: selectedRow.mobileNo },
              { label: 'Member No', value: selectedRow.memberNo },
              { label: 'MEM PK', value: selectedRow.memPk },
              {
                label: 'User Type',
                value: selectedRow.userType === 1 ? 'Member' : 'Non Member',
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px',
                  background: '#f9fafb',
                  border: '1px solid #eee',
                  borderRadius: 8,
                }}
              >
                <span style={{ fontWeight: 600, color: '#16a34a' }}>
                  {item.label}
                </span>
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