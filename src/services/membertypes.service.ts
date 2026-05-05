import apiClient from "../lib/apiClient";

export interface MemberTypesRequest {
  id: string;
  categoryName: string;
  subCategoryName: string;
  status: number;

  name: string;
  phoneNumber: string;
  cnic: string;

  vehicleNumber: string;
  instituteName: string;
  employeeRegistrationNumber: string;

  phaseName: string;
  zoneName: string;
  khayaban: string;
  laneNo: string;
  plotNo: string;
  floors: string;

  purposeVisit: string;
}

const statuses = [0, 1, 2, 3];

export const getAllMemberTypesRequests = async (): Promise<MemberTypesRequest[]> => {
  const requests = await Promise.all(
    statuses.map((status) =>
      apiClient.get(`/api/nonmember/get-nonmember-requests`, {
        params: { status },
      })
    )
  );

  // merge all responses
  const merged = requests.flatMap((res) => res.data.data || []);

  return merged;
};