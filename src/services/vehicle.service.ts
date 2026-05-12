import apiClient from "../lib/apiClient";

export interface ExternalVehicle {
  id: string;
  ser: number;
  licenseNo: number;
  license: string;
  year: string;
  color: string;
  make: string;
  model: string;
  attachment: string | null;
  eTagId: string | null;
  validFrom: string | null;
  validTo: string | null;
  status: boolean | null;
  externalUserId: string;
  created: string;
  createdBy: string;
  isDeleted: boolean;
  isActive: boolean;
  lastModified: string | null;
  lastModifiedBy: string | null;
}

export interface ApiResponse<T> {
  statusCode: number;
  successMessage: string | null;
  errorMessage: string | null;
  data: T;
}

export interface CreateExternalVehicleRequest {
  ser?: number;
  licenseNo: number;
  license: string;
  year: string;
  color: string;
  make: string;
  model: string;
  attachment?: string;
  eTagId: string;
  validFrom: string;
  validTo: string;
  tagStatus: number;
  createdBy: string;
  externalUserId: string;
  isActive: boolean;
}

export interface UpdateExternalVehicleRequest {
  id: string;
  ser?: number;
  licenseNo: number;
  license: string;
  year: string;
  color: string;
  make: string;
  model: string;
  attachment?: string;
  eTagId: string;
  validFrom: string;
  validTo: string;
  tagStatus: number;
  lastModifiedBy?: string;
  externalUserId: string;
  isActive: boolean;
}

export type CreateExternalVehicleResponse = ApiResponse<ExternalVehicle | null>;
export type UpdateExternalVehicleResponse = ApiResponse<ExternalVehicle | null>;
export type DeleteExternalVehicleResponse = ApiResponse<ExternalVehicle | null>;
export type GetExternalVehicleByIdResponse = ApiResponse<ExternalVehicle | null>;
export interface VehicleGroup {
  userId: string;
  userName: string;
  vehicles: ExternalVehicle[];
}

export interface GetAllExternalVehicleData {
  items: VehicleGroup[];
}

export type GetAllExternalVehicleResponse = {
  success: boolean;
  message: string;
  data: GetAllExternalVehicleData;
};

export const getAllExternalVehicles = async (
  pageNumber = 1,
  pageSize = 10
): Promise<GetAllExternalVehicleResponse> => {
  const { data } = await apiClient.post<GetAllExternalVehicleResponse>(
    "/api/smartdha/vehicle/get-all-vehicles",
    { pageNumber, pageSize }
  );
  return data;
};

export const getExternalVehicleById = async (
  id: string
): Promise<GetExternalVehicleByIdResponse> => {
  const { data } = await apiClient.get<GetExternalVehicleByIdResponse>("/vehicle/GetVehicleById", {
    params: { id },
  });
  return data;
};

export const createExternalVehicle = async (
  payload: CreateExternalVehicleRequest
): Promise<CreateExternalVehicleResponse> => {
  const { data } = await apiClient.post<CreateExternalVehicleResponse>("/vehicle/createVehicle", payload);
  return data;
};

export const updateExternalVehicle = async (
  payload: UpdateExternalVehicleRequest
): Promise<UpdateExternalVehicleResponse> => {
  const { data } = await apiClient.post<UpdateExternalVehicleResponse>("/vehicle/updateVehicle", payload);
  return data;
};

export const deleteExternalVehicle = async (
  id: string
): Promise<DeleteExternalVehicleResponse> => {
  const { data } = await apiClient.post<DeleteExternalVehicleResponse>("/vehicle/removeVehicle", null, {
    params: { id },
  });
  return data;
};
