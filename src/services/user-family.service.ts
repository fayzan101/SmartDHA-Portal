import apiClient from "../lib/apiClient";
export interface UserFamily {
	id: string;
	ser: number;
	name: string;
	residentCardNumber: string | null;
	profilePicture: string | null;
	cnic: string;
	phoneNumber: string;
	fatherOrHusbandName: string | null;
	relation: number;
	dateOfBirth: string;
	validTo: string | null;
	validFrom: string | null;
	cardStatus: string | null;
	externalUserId: string;
	externalUserName: string | null;
	created: string;
	createdBy: string;
	isDeleted: boolean;
	isActive: boolean;
	lastModified: string | null;
	lastModifiedBy: string | null;
}
export interface GetAllUserFamilyResponse {
	statusCode: number;
	successMessage: string | null;
	errorMessage: string | null;
	data: UserFamily[];
}
export interface UserFamilyMember {
  id: string;
  name: string;
  relation: number;
  phone: string;
  dob: string;
  cnic?: string;
  fatherOrHusbandName?: string;
  residentCardNumber?: string;
  validFrom?: string;
  validTo?: string;
}

export interface UserFamilyGroup {
  userId: string;
  userName: string;
  familyMembers: UserFamilyMember[];
}
export const getAllUserFamily = async () => {
  const response = await apiClient.post(
    "/api/smartdha/userfamily/get-all-users",
    {}
  );

  // IMPORTANT: return ONLY items array
  return response.data.data.items;
};
export const removeUserFamily = async (id: string): Promise<any> => {
	const response = await apiClient.post(
		`/userfamily/removeUserFamily`,
		null,
		{ params: { id } }
	);
	return response.data;
};

export interface GetUserFamilyByIdResponse {
	statusCode: number;
	successMessage: string | null;
	errorMessage: string | null;
	data: UserFamily;
}

export const getUserFamilyById = async (id: string): Promise<UserFamily> => {
	const response = await apiClient.get<GetUserFamilyByIdResponse>(
		`/userfamily/GetUserFamilyById`,
		{ params: { id } }
	);
	return response.data.data;
};
export interface CreateUserFamilyRequest {
	ser: number;
	name: string;
	residentCardNumber: string | null;
	profilePicture: string | null;
	cnic: string;
	phoneNumber: string;
	fatherOrHusbandName: string | null;
	relation: number;
	dateOfBirth: string;
	validTo: string | null;
	validFrom: string | null;
	cardStatus: string | null;
	externalUserId: string;
	createdBy: string;
}

export const createUserFamily = async (data: CreateUserFamilyRequest): Promise<any> => {
	const response = await apiClient.post(
		"/userfamily/createUserFamily",
		data
	);
	return response.data;
};
export interface UpdateUserFamilyRequest {
	id: string;
	ser: number;
	name: string;
	residentCardNumber: string | null;
	profilePicture: string | null;
	cnic: string;
	phoneNumber: string;
	fatherOrHusbandName: string | null;
	lastModifiedBy: string;
	relation: number;
	dateOfBirth: string;
	validTo: string | null;
	validFrom: string | null;
	cardStatus: string | null;
}

export const updateUserFamily = async (data: UpdateUserFamilyRequest): Promise<any> => {
	const response = await apiClient.post(
		"/userfamily/updateUserFamily",
		data
	);
	return response.data;
};