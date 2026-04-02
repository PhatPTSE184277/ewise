
'use client';

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	ReactNode
} from 'react';
import {
	getMyProfile,
	updateUserProfile,
	type ApiUserProfile,
	type UpdateProfilePayload
} from '@/services/ProfileService';

interface ProfileContextType {
	profile: ApiUserProfile | null;
	loading: boolean;
	updating: boolean;
	error: string | null;
	fetchProfile: () => Promise<void>;
	updateProfile: (payload: UpdateProfilePayload) => Promise<boolean>;
	clearError: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
	const [profile, setProfile] = useState<ApiUserProfile | null>(null);
	const [loading, setLoading] = useState(false);
	const [updating, setUpdating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchProfile = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getMyProfile();
			setProfile(data);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Không thể tải thông tin cá nhân');
			setProfile(null);
		} finally {
			setLoading(false);
		}
	}, []);

	const updateProfile = useCallback(
		async (payload: UpdateProfilePayload) => {
			const userId = profile?.userId;
			if (!userId) {
				setError('Thiếu thông tin người dùng');
				return false;
			}

			setUpdating(true);
			setError(null);
			try {
				const updated = await updateUserProfile(userId, payload);
				setProfile(updated);
				return true;
			} catch (err: any) {
				setError(err?.response?.data?.message || 'Cập nhật thất bại');
				return false;
			} finally {
				setUpdating(false);
			}
		},
		[profile?.userId]
	);

	const clearError = useCallback(() => setError(null), []);

	useEffect(() => {
		void fetchProfile();
	}, [fetchProfile]);

	const value = useMemo(
		() => ({ profile, loading, updating, error, fetchProfile, updateProfile, clearError }),
		[profile, loading, updating, error, fetchProfile, updateProfile, clearError]
	);

	return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = (): ProfileContextType => {
	const ctx = useContext(ProfileContext);
	if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
	return ctx;
};

export default ProfileContext;
