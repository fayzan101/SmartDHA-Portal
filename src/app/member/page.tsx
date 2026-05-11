'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { Column } from '../../components/tables/DataTable';
import { Eye } from 'lucide-react';
import FormModal from '../../components/popup/FormModal';

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

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Member | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(
          'https://dfpwebp.dhakarachi.org/api/smartdha/user/members',
          {
            method: 'GET',
            headers: {
              accept: '*/*',
              Authorization: `Bearer YOUR_TOKEN_HERE`,
            },
          }
        );

        const json = await res.json();

        const mapped: Member[] = (json?.data || []).map(
          (item: any, idx: number) => ({
            sno: idx + 1,
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

    fetchMembers();
  }, [currentPage]);

  const handleView = (row: Member) => {
    setSelectedRow(row);
    setViewModalOpen(true);
  };

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
        data={members}
        loading={loading}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        addButtonLabel={undefined}
        error={error || undefined}
      />

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