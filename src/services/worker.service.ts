import apiClient from "../lib/apiClient";

export interface ExternalWorker {
  id: string;
  workerId?: string;
  ser?: number;
  jobType?: number;
  cnic?: string;
  name?: string;
  phoneNo?: string;
  phoneNumber?: string;
  dob?: string;
  dateOfBirth?: string;
  fatherHusbandName?: string;
  fatherOrHusbandName?: string;
  policeVerification?: boolean;
  workerCardDeliveryType?: number;
  workerCardNumber?: string;
  validFrom?: string;
  validTo?: string;
  cardStatus?: number;
  isActive?: boolean;
  externalUserId?: string;
}

export interface ApiResponse<T> {
  statusCode?: number;
  successMessage?: string | null;
  errorMessage?: string | null;
  data: T;
}

/* ---------------- GET ALL (NO PAGINATION NOW) ---------------- */
export const getAllExternalWorkers = async () => {
  const { data } = await apiClient.post(
    "/api/smartdha/worker/get-all-workers",
    {}
  );

  return data;
};

/* ---------------- GET BY ID ---------------- */
export const getExternalWorkerById = async (id: string) => {
  const { data } = await apiClient.get(
    `/api/smartdha/worker/get-worker-by-id/${id}`
  );

  return data;
};

/* ---------------- CREATE ---------------- */
export const createExternalWorker = async (payload: any) => {
  const { data } = await apiClient.post(
    "/api/smartdha/worker/create-worker",
    payload
  );

  return data;
};

/* ---------------- UPDATE ---------------- */
export const updateExternalWorker = async (payload: any) => {
  const formData = new FormData();

  formData.append("WorkerId", payload.workerId);
  formData.append("JobType", payload.jobType);
  formData.append("Name", payload.name || "");
  formData.append("PhoneNo", payload.phoneNo || "");
  formData.append("CNIC", payload.cnic || "");
  formData.append("DOB", payload.dob || "");
  formData.append("FatherHusbandName", payload.fatherHusbandName || "");

  formData.append("WorkerCardNumber", payload.workerCardNumber || "");
  formData.append("CardStatus", String(payload.cardStatus || 0));
  formData.append("WorkerCardDeliveryType", String(payload.workerCardDeliveryType || 0));

  formData.append("ValidFrom", payload.validFrom || "");
  formData.append("ValidTo", payload.validTo || "");
  formData.append("IsActive", String(payload.isActive ?? true));
  formData.append("LastModifiedBy", payload.lastModifiedBy || "");

  if (payload.cnicFront) formData.append("CnicFront", payload.cnicFront);
  if (payload.cnicBack) formData.append("CnicBack", payload.cnicBack);
  if (payload.profilePicture) formData.append("ProfilePicture", payload.profilePicture);
  if (payload.policeVerificationAttachment)
    formData.append("PoliceVerificationAttachment", payload.policeVerificationAttachment);

  const { data } = await apiClient.post(
    "/api/smartdha/worker/update-worker",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

/* ---------------- DELETE ---------------- */
export const deleteExternalWorker = async (id: string) => {
  const { data } = await apiClient.post(
    "/api/smartdha/worker/remove-worker",
    null,
    {
      params: { id },
    }
  );

  return data;
};