'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import apiClient from '@/lib/apiClient';
import DataTable, { Column } from '@/components/tables/DataTable';
import { useSearch } from "@/context/searchContext";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const formatDate = (d: string) => {
  if (!d || d.startsWith('0001')) return '-';
  return new Date(d).toLocaleDateString();
};

const relationMap: any = {
  0: 'Spouse',
  1: 'Child',
  2: 'Parent',
};

const jobTypeMap: any = {
  1: 'Driver',
  2: 'Maid',
  3: 'Cook',
  4: 'Other',
};

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const titleStyle = {
  marginBottom: '10px',
  fontSize: '16px',
  fontWeight: 600,
  color: '#111827',
};

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
export default function FamilyDetailsPage() {
  const { id: userId } = useParams();
  const { searchValue } = useSearch();
  const [family, setFamily] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [luggage, setLuggage] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchAll = async () => {
      try {
        setLoading(true);

        const [
          familyRes,
          vehicleRes,
          workerRes,
          visitorRes,
          luggageRes,
          propertyRes,
        ] = await Promise.all([
          apiClient.get(`/api/smartdha/userfamily/get-user-by-id/${userId}`),
          apiClient.get(`/api/smartdha/vehicle/${userId}`),
          apiClient.get(`/api/smartdha/worker/get-worker-by-id/${userId}`),
          apiClient.get(`/api/smartdha/visitorpass/${userId}`),
          apiClient.get(`/api/smartdha/luggagepass/${userId}`),
          apiClient.get(`/api/smartdha/residenceproperty/get-property-by-id/${userId}`),
        ]);

        const userData = familyRes.data?.data;
        setFamily(userData?.familyMembers || []);

        setVehicles(vehicleRes.data?.data?.vehicles || []);
        setWorkers(workerRes.data?.data?.workers || []);
        setVisitors(visitorRes.data?.data?.visitorPasses || []);
        setLuggage(luggageRes.data?.data?.luggagePasses || []);

        const props = propertyRes.data?.data?.properties || [];
        setProperties(props.map((p: any) => p.data));

      } catch (err) {
        console.log('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [userId]);

  // ─────────────────────────────────────────────
  // COLUMNS
  // ─────────────────────────────────────────────
  const familyColumns: Column<any>[] = [
    { key: 'name', header: 'Name' },
    { key: 'relation', header: 'Relation', render: (v) => relationMap[v] || '-' },
    { key: 'phone', header: 'Phone' },
    { key: 'dob', header: 'DOB', render: (v) => formatDate(v) },
    { key: 'cnic', header: 'CNIC' },
    { key: 'residentCardNumber', header: 'Resident Card No.' },
  ];

  const vehicleColumns: Column<any>[] = [
    { key: 'licenseNumber', header: 'License Plate' },
    { key: 'eTagId', header: 'E-Tag ID' },
    {key: 'owner', header: 'Ownership'},
    { key: 'make', header: 'Make' },
    { key: 'model', header: 'Model' },
    { key: 'year', header: 'Year' },
    {key: 'color', header: 'Color' },
  ];

  const workerColumns: Column<any>[] = [
    { key: 'name', header: 'Name' },
    { key: 'jobType', header: 'Job Type', render: (v) => jobTypeMap[v] || '-' },
    { key: 'phoneNo', header: 'Phone' },
    { key: 'cnic', header: 'CNIC' },
    {key: 'workerCardNo', header: 'Worker Card No.'},
    {key: 'policeVerification', header: 'Police Verification', render: (v) => v ? 'Yes' : 'No' },
  ];

  const visitorColumns: Column<any>[] = [
    { key: 'name', header: 'Name' },
    { key: 'cnic', header: 'CNIC' },
    {
     key: 'vehicleLicensePlate',
  header: 'Vehicle',
  render: (_: any, row: any) => {
    const plate = row.vehicleLicensePlate || '';
    const number = row.vehicleLicenseNo || '';

    if (!plate && !number) return '-';
    if (!number) return plate;
    if (!plate) return number;

    return `${plate}-${number}`;
  },
    },
    {key: 'visitorPassType', header: 'Pass Type'},
    {key: 'validTo', header: 'Validity', render: (v) => formatDate(v)},
  
  ];

  const luggageColumns: Column<any>[] = [
    { key: 'name', header: 'Name' },
    { key: 'cnic', header: 'CNIC' },
    {
     key: 'vehicleLicensePlate',
  header: 'Vehicle',
  render: (_: any, row: any) => {
    const plate = row.vehicleLicensePlate || '';
    const number = row.vehicleLicenseNo || '';

    if (!plate && !number) return '-';
    if (!number) return plate;
    if (!plate) return number;

    return `${plate}-${number}`;
  }},
  {key: 'validTo', header: 'Validity', render: (v) => formatDate(v)},
  ];

  const propertyColumns: Column<any>[] = [
  { key: 'categoryName', header: 'Category' },
  { key: 'subCategoryName', header: 'Type' },
  { key: 'phaseName', header: 'Phase' },

  // ✅ Plot (merged nicely)
  {
    key: 'plotNo',
    header: 'Plot',
    render: (_: any, row: any) => {
      const plot = row.plot || '';
      const number = row.plotNo || '';

      if (!plot && !number) return '-';
      if (!number) return plot;
      if (!plot) return number;

      return `${plot}-${number}`; // e.g. H-2354
    },
  },

  // ✅ Street
  { key: 'streetNo', header: 'Street' },

  // ✅ Khayaban (handle empty)
  {
    key: 'khayaban',
    header: 'Khayaban',
    render: (v: string) => v || '-',
  },

  // ✅ Floor
  {
    key: 'floor',
    header: 'Floor',
    render: (v: number) => v ?? '-',
  },

  // ✅ Property Tag
  { key: 'propertyTag', header: 'Property Tag' },

  // ✅ Possession Type
  { key: 'possessionTypeName', header: 'Possession' },
];
  

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  return (
    <DashboardLayout pageTitle="Family Details">

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* FAMILY */}
          <div>
            <h3 style={titleStyle}>Family Members</h3>
            <DataTable columns={familyColumns} data={family} loading={loading} />
          </div>

          {/* VEHICLES */}
          <div>
            <h3 style={titleStyle}>Vehicles</h3>
            <DataTable columns={vehicleColumns} data={vehicles} loading={loading} />
          </div>

          {/* WORKERS */}
          <div>
            <h3 style={titleStyle}>Workers</h3>
            <DataTable columns={workerColumns} data={workers} loading={loading} />
          </div>

          {/* VISITORS */}
          <div>
            <h3 style={titleStyle}>Visitors</h3>
            <DataTable columns={visitorColumns} data={visitors} loading={loading} />
          </div>

          {/* LUGGAGE */}
          <div>
            <h3 style={titleStyle}>Luggage</h3>
            <DataTable columns={luggageColumns} data={luggage} loading={loading} />
          </div>

          {/* PROPERTIES */}
          <div>
            <h3 style={titleStyle}>Properties</h3>
            <DataTable columns={propertyColumns} data={properties} loading={loading} />
          </div>

        </div>
      )}
    </DashboardLayout>
  );
}