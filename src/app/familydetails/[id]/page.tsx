'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import apiClient from '@/lib/apiClient';

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
const sectionCard = {
  background: '#fff',
  padding: '16px',
  borderRadius: '10px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const thStyle = {
  border: '1px solid #e5e7eb',
  padding: '10px',
  fontSize: '12px',
  fontWeight: 600,
  background: '#f9fafb',
  textAlign: 'left' as const,
};

const tdStyle = {
  border: '1px solid #e5e7eb',
  padding: '8px',
  fontSize: '12px',
};

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
export default function FamilyDetailsPage() {
  const { id: userId } = useParams(); // IMPORTANT: this is already userId

  const [family, setFamily] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [luggage, setLuggage] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ─────────────────────────────────────────────
  // FETCH DATA (ONLY VALID APIs)
  // ─────────────────────────────────────────────
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

        // FAMILY
        const userData = familyRes.data?.data?.items?.[0];
        setFamily(userData?.familyMembers || []);

        // OTHERS
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
  // UI
  // ─────────────────────────────────────────────
  return (
    <DashboardLayout pageTitle="Family Details">

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* FAMILY */}
          <div style={sectionCard}>
            <h3>Family Details</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Relation</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>DOB</th>
                  <th style={thStyle}>CNIC</th>
                </tr>
              </thead>
              <tbody>
                {family.map((f, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{f.name}</td>
                    <td style={tdStyle}>{relationMap[f.relation] || '-'}</td>
                    <td style={tdStyle}>{f.phone}</td>
                    <td style={tdStyle}>{formatDate(f.dob)}</td>
                    <td style={tdStyle}>{f.cnic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* VEHICLES */}
          <div style={sectionCard}>
            <h3>Vehicles</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>License Plate</th>
                  <th style={thStyle}>Make</th>
                  <th style={thStyle}>Model</th>
                  <th style={thStyle}>Year</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{v.licenseNumber}</td>
                    <td style={tdStyle}>{v.make}</td>
                    <td style={tdStyle}>{v.model}</td>
                    <td style={tdStyle}>{v.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* WORKERS */}
          <div style={sectionCard}>
            <h3>Workers</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Job Type</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>CNIC</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((w, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{w.name}</td>
                    <td style={tdStyle}>{jobTypeMap[w.jobType] || '-'}</td>
                    <td style={tdStyle}>{w.phoneNo}</td>
                    <td style={tdStyle}>{w.cnic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* VISITORS */}
          <div style={sectionCard}>
            <h3>Visitors</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>CNIC</th>
                  <th style={thStyle}>Vehicle</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((v, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{v.name}</td>
                    <td style={tdStyle}>{v.cnic}</td>
                    <td style={tdStyle}>{v.vehicleLicensePlate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* LUGGAGE */}
          <div style={sectionCard}>
            <h3>Luggage</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>CNIC</th>
                </tr>
              </thead>
              <tbody>
                {luggage.map((l, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{l.name || '-'}</td>
                    <td style={tdStyle}>{l.cnic || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PROPERTIES */}
          <div style={sectionCard}>
            <h3>Properties</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Phase</th>
                  <th style={thStyle}>Plot</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{p.categoryName}</td>
                    <td style={tdStyle}>{p.subCategoryName}</td>
                    <td style={tdStyle}>{p.phaseName}</td>
                    <td style={tdStyle}>{p.plotNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </DashboardLayout>
  );
}