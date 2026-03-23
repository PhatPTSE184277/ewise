import axios from '@/lib/axios';
import { TrackingFilterParams, TrackingPackagesResponse } from '@/types/Tracking';
import { PackageType } from '@/types/Package';

export const filterTrackingPackages = async (
    params: TrackingFilterParams
): Promise<TrackingPackagesResponse> => {
    const response = await axios.get<TrackingPackagesResponse>('/packages/tracking', {
        params
    });
    return response.data;
};

export const getTrackingPackageDetail = async (
    packageId: string,
    page: number = 1,
    limit: number = 10
): Promise<PackageType> => {
    const response = await axios.get<PackageType>(`/packages/${packageId}`, {
        params: { page, limit }
    });
    return response.data;
};
