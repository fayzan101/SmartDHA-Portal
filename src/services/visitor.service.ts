import apiClient from "../lib/apiClient";

export interface ExternalVisitorPass {
  cardStatus: any;
  id: string;
  ser: number;
  name: string;
  cnic: string;
  vehicleLicensePlate: string;
  vehicleLicenseNo: number;
  vehicleLicense: string;
  visitorPassType: string | number;
  validFrom: string;
  validTo: string;
  fromDate: string;
  toDate: string; 
  qrCode: string;
  pdfFilePath: string;
  externalUserId: string;
  externalUserName: string;
  created: string;
  createdBy: string;
  lastModified: string;
  lastModifiedBy: string;
  isDeleted: boolean;
  isActive: boolean;
  totalItems?: number;
pageSize?: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  successMessage: string | null;
  errorMessage: string | null;
  data: T;
}

export interface CreateExternalVisitorPassRequest {
  name: string;
  cnic: string;
  vehicleLicensePlate: string;
  vehicleLicenseNo: number;
  description?: string;
  visitorPassType: number;
  validFrom: string;
  validTo: string;
  externalUserId: string;
}

export interface UpdateExternalVisitorPassRequest {
  id: string;
  name: string;
  cnic: string;
  vehicleLicensePlate: string;
  vehicleLicenseNo: number;
  visitorPassType: string | number;
  validFrom: string;
  validTo: string;
  isActive?: boolean;
  isDeleted?: boolean;
  lastModifiedBy?: string;
  externalUserId?: string;
}

export type CreateExternalVisitorPassResponse = ApiResponse<ExternalVisitorPass | null>;
export type UpdateExternalVisitorPassResponse = ApiResponse<ExternalVisitorPass | null>;
export type DeleteExternalVisitorPassResponse = ApiResponse<ExternalVisitorPass | null>;
export type GetExternalVisitorPassByIdResponse = ApiResponse<ExternalVisitorPass | null>;
export interface VisitorData {
  success: boolean;
  message: string;
  upcomingVisitors: ExternalVisitorPass[];
  previousVisitors: ExternalVisitorPass[];
}

export type GetAllExternalVisitorPassResponse = {
  success: boolean;
  message: string;
  data: VisitorData;
};

export const getAllExternalVisitorPass = async (
  pageNumber = 1,
  pageSize = 10
): Promise<GetAllExternalVisitorPassResponse> => {
  const { data } = await apiClient.post(
    "/api/smartdha/visitorpass/get-all-visitors",
    {
  pageNumber: pageNumber - 1,
  pageSize
}
  );
  return data;
};

export const getExternalVisitorPassById = async (
  id: string
): Promise<GetExternalVisitorPassByIdResponse> => {
  const { data } = await apiClient.get<GetExternalVisitorPassByIdResponse>(
    "/visitors/GetVisitorPassById",
    { params: { id } }
  );
  return data;
};

export const createExternalVisitorPass = async (
  payload: CreateExternalVisitorPassRequest
): Promise<CreateExternalVisitorPassResponse> => {
  const { data } = await apiClient.post<CreateExternalVisitorPassResponse>(
    "/visitors/createVisitorPass",
    payload
  );
  return data;
};

export const updateExternalVisitorPass = async (
  payload: UpdateExternalVisitorPassRequest
): Promise<UpdateExternalVisitorPassResponse> => {
  const { data } = await apiClient.post<UpdateExternalVisitorPassResponse>(
    "/visitors/updateVisitorPass",
    payload
  );
  return data;
};

export const deleteExternalVisitorPass = async (
  id: string
): Promise<DeleteExternalVisitorPassResponse> => {
  const { data } = await apiClient.post<DeleteExternalVisitorPassResponse>(
    "/visitors/removeVisitorPass",null,
    { params: { id } }
  );
  return data;
};
