import apiClient from "../lib/apiClient";

/* ---------------- GET ALL ---------------- */
export const getAllExternalWorkers = async (pageNumber = 1, pageSize = 10) => {
  const { data } = await apiClient.post(
    "/api/smartdha/worker/get-all-workers",
    {
      pageNumber,
      pageSize,
    }
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

/* ---------------- UPDATE (FIXED STYLE) ---------------- */
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