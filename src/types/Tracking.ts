import { PackageProductsResponse, PackageType } from '@/types/Package';

export interface TrackingStatusHistory {
    description: string;
    status: string;
    createAt: string;
}

export interface TrackingPackageItem {
    packageId: string;
    smallCollectionPointsId: string;
    status: string;
    smallCollectionPointsName?: string;
    smallCollectionPointsAddress?: string;
    recyclerName?: string;
    recyclerAddress?: string;
    deliveryAt?: string;
    products: PackageProductsResponse;
    statusHistories: TrackingStatusHistory[];
}

export interface TrackingPackagesResponse {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    data: TrackingPackageItem[];
}

export interface TrackingFilterParams {
    page?: number;
    limit?: number;
    recyclerId?: string;
    smallCollectionPointId?: string;
    packageId?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
}

export interface TrackingContextType {
    packages: TrackingPackageItem[];
    packageDetail: PackageType | null;
    loadingPackages: boolean;
    loadingPackageDetail: boolean;
    totalPages: number;
    totalItems: number;
    stats?: {
        packing?: number;
        closed?: number;
        shipping?: number;
        recycled?: number;
    };
    filter: TrackingFilterParams;
    error: string | null;
    setFilter: (next: Partial<TrackingFilterParams>) => void;
    fetchPackages: (customFilter?: Partial<TrackingFilterParams>) => Promise<void>;
    fetchPackageDetail: (packageId: string, page?: number, limit?: number) => Promise<void>;
    clearPackageDetail: () => void;
}
