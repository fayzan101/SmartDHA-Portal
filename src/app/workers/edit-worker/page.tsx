'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { workerFields } from '../fields';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';
import { useWorkerById } from '../../../hooks/workers/useWorkerById';
import { useUpdateWorker } from '../../../hooks/workers/useUpdateWorker';

/* ---------------- DATE HELPERS ---------------- */

const toDateInputValue = (value?: string | null) => {
  if (!value) return '';
  const match = String(value).match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : '';
};

const toIsoDate = (value?: string) => {
  if (!value) return '';
  const match = String(value).match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : '';
};

/* ---------------- MAPPERS ---------------- */

const toJobType = (value?: string): number => {
  switch (value) {
    case 'driver': return 0;
    case 'cook': return 1;
    case 'guard': return 2;
    case 'peon': return 3;
    case 'gardener': return 4;
    default: return 0;
  }
};

const toCardStatus = (value?: string | number | boolean): number => {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'number') return value;
  if (value === 'active' || value === '1') return 1;
  return 0;
};

const toWorkerCardDeliveryType = (value?: string): number => {
  if (value === 'owner') return 0;
  if (value === 'self') return 1;
  return 0;
};

const toPoliceVerification = (value?: string): boolean => {
  return value === 'yes';
};

/* ---------------- PAGE ---------------- */

export default function EditWorker() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [workerId, setWorkerId] = useState<string | undefined>();
  const [formError, setFormError] = useState('');

  const updateWorkerMutation = useUpdateWorker();
  const { data, isLoading, isError } = useWorkerById(workerId);

  /* ---------------- LOAD ID ---------------- */

  useEffect(() => {
    const selected = getTableRow<{ id?: string }>('workers');

    if (selected?.id) {
      setWorkerId(selected.id);
      clearTableRow('workers');
      return;
    }

    const urlId = searchParams?.get('id');
    if (urlId) {
      setWorkerId(urlId);
    }
  }, [searchParams]);

  /* ---------------- INITIAL VALUES ---------------- */

  const initialValues: ProfileFormData | null = data?.data
    ? {
        jobType: data.data.jobType?.toString() || '',
        fullName: data.data.name || '',
        fatherOrHusband: data.data.fatherOrHusbandName || '',
        dob: toDateInputValue(data.data.dateOfBirth),
        cellNumber: data.data.phoneNumber || '',
        cnic: data.data.cnic || '',
        policeVerification: data.data.policeVerification ? 'yes' : 'no',
        cardDelivery:
          data.data.workerCardDeliveryType === 0 ? 'owner' : 'self',
        cardNo: data.data.workerCardNumber || '',
        issueDate: toDateInputValue(data.data.validFrom),
        expiryDate: toDateInputValue(data.data.validTo),
        cardStatus: data.data.cardStatus === 1 ? 'active' : 'inactive',
      }
    : null;

  /* ---------------- SAVE ---------------- */

  const handleSave = async (formData: ProfileFormData) => {
    if (!workerId || !data?.data) return;

    setFormError('');

    const userRaw =
      typeof window !== 'undefined'
        ? localStorage.getItem('user')
        : null;

    let lastModifiedBy = 'system';

    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        lastModifiedBy =
          user?.fullName || user?.name || user?.email || 'system';
      } catch {
        lastModifiedBy = 'system';
      }
    }

    try {
      await updateWorkerMutation.mutateAsync({
        workerId: workerId,

        jobType: toJobType(formData.jobType),
        name: formData.fullName || '',
        phoneNo: formData.cellNumber || '',
        cnic: formData.cnic || '',
        dob: toIsoDate(formData.dob),

        fatherHusbandName: formData.fatherOrHusband || '',

        workerCardNumber: formData.cardNo || '',
        cardStatus: toCardStatus(formData.cardStatus),
        workerCardDeliveryType: toWorkerCardDeliveryType(formData.cardDelivery),

        validFrom: toIsoDate(formData.issueDate),
        validTo: toIsoDate(formData.expiryDate),

        isActive: true,
        lastModifiedBy,
      });

      router.back();
    } catch (err: any) {
      const message =
        err?.response?.data?.errorMessage ||
        err?.message ||
        'Failed to update worker';

      setFormError(message);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <DashboardLayout pageTitle="Edit Worker">
      <div style={{ margin: '0 auto' }}>
        {formError && (
          <div style={{ color: 'red', marginBottom: 12 }}>
            {formError}
          </div>
        )}

        {!workerId && (
          <div style={{ color: 'red', marginBottom: 12 }}>
            No worker id found for editing.
          </div>
        )}

        {isError && (
          <div style={{ color: 'red', marginBottom: 12 }}>
            Failed to load worker details.
          </div>
        )}

        {(isLoading || initialValues) && (
          <CommonEntityForm
            title="Please update details below!"
            onSave={handleSave}
            onCancel={() => router.back()}
            saveButtonText="Update"
            fields={workerFields}
            initialValues={initialValues || undefined}
            loading={isLoading || updateWorkerMutation.isPending}
            showStatusToggle={false}
          />
        )}
      </div>
    </DashboardLayout>
  );
}