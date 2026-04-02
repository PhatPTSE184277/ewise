
import axios from '@/lib/axios';

export interface ApiUserProfile {
	userId: string;
	name?: string;
	email?: string;
	phone?: string;
	phoneNumber?: string;
	avatar?: string;
	avatarUrl?: string;
	role?: string;
	points?: number;
	smallCollectionPointId?: string | null;
	collectionCompanyId?: string | null;
	smallCollectionName?: string | null;
	companyName?: string | null;
	status?: string;
	[key: string]: any;
}

export interface UpdateProfilePayload {
	email: string;
	avatarUrl: string;
	phoneNumber: string;
}

export const getMyProfile = async (): Promise<ApiUserProfile> => {
	const response = await axios.get('/users/profile');
	return response.data;
};

export const updateUserProfile = async (
	userId: string,
	payload: UpdateProfilePayload
): Promise<ApiUserProfile> => {
	const response = await axios.put(`/users/${userId}`, payload);
	return response.data;
};
