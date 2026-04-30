import apiClient from "../lib/apiClient";

export interface GetAllPropertiesRequest {
  isActive: boolean;
  pageNumber: number;
  pageSize: number;
}

export const getAllProperties = async (payload: GetAllPropertiesRequest) => {
  const response = await apiClient.post(
    "/api/smartdha/residenceproperty/get-all-properties",
    payload
  );
  return response.data;
};