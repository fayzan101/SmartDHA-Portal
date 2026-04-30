import apiClient from "../lib/apiClient";
export interface SyncSummaryResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string | null;
  data: {
    totalRecords: number;
    totalSuccess: number;
    totalFailed: number;
    totalPendingRetry: number;
  };
}
export interface DashboardCountResponse {
  totalWorkers: number;
  totalResidents: number;
  totalProperties: number;
  totalVehicles: number;
}

export const getDashboardCount = async (): Promise<DashboardCountResponse> => {
  const response = await apiClient.post<DashboardCountResponse>(
    "/api/smartdha/dashboard/dashboard-count",
    {}
  );
  return response.data;
};

export interface ExternalSearchRequest {
  pageNumber: number;
  pageSize: number;
  globalSearch: string;
  name: string;
  cnic: string;
  phoneNumber: string;
  tagNumber: string;
  rfidCardNumber: string;
  workerCardNumber: string;
  vehicleLicensePlate: string;
  cardStatus: number;
  tagStatus: number;
  userType: number;
  validFrom: string;
  validTo: string;
}

export interface ExternalSearchResponse {
  statusCode: number;
  successMessage: string;
  errorMessage: string | null;
  data: any; // Adjust type as needed based on API response
}

export const externalSearch = async (
  body: ExternalSearchRequest
): Promise<ExternalSearchResponse> => {
  const response = await apiClient.post<ExternalSearchResponse>(
    "/dashboard/external-search",
    body
  );
  return response.data;
};
