'use client';

import { useEffect, useState, useMemo } from 'react';
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
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { searchValue } = useSearch();
  const router = useRouter();

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Member | null>(null);

  // ==============================
  // FETCH MEMBERS (ONCE ONLY)
  // ==============================
  const fetchMembers = async () => {
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
        }
      );

      const json = await res.json();
      const data = json?.data;

      if (!data?.items) {
        setAllMembers([]);
        return;
      }

      const mapped: Member[] = (data.items || []).map(
        (item: any, idx: number) => ({
          sno: idx + 1,
          userId: item.userId,
          name: item.name,
          email: item.email || item.registeredEmail || '-',
          mobileNo: item.mobileNo || item.registeredMobileNo || '-',
          memberNo: item.memberNo || '-',
          memPk: item.memPk || '-',
          userType: item.userType,
          staffNo: item.staffNo || '-',
        })
      );

      setAllMembers(mapped);
    } catch (err: any) {
      setError(err?.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ==============================
  // SEARCH FILTER
  // ==============================
  const filteredMembers = useMemo(() => {
    return allMembers.filter((item) =>
      item.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.mobileNo?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.memberNo?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.memPk?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [allMembers, searchValue]);

  // ==============================
  // CLIENT-SIDE PAGINATION
  // ==============================
  const totalPages = Math.ceil(filteredMembers.length / pageSize);

  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredMembers.slice(start, end);
  }, [filteredMembers, currentPage]);

  // reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

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

  return (
    <DashboardLayout pageTitle="Members">
      <DataTable<Member>
        columns={columns}
        data={paginatedMembers}
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