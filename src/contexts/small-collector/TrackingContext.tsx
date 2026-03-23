'use client';

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    ReactNode
} from 'react';
import { useAuth } from '@/redux';
import {
    filterTrackingPackages,
    getTrackingPackageDetail
} from '@/services/small-collector/TrackingService';
import {
    TrackingContextType,
    TrackingFilterParams,
    TrackingPackageItem
} from '@/types/Tracking';
import { PackageType } from '@/types/Package';
import { getFirstDayOfMonthString, getTodayString } from '@/utils/getDayString';

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const TrackingProvider: React.FC<Props> = ({ children }) => {
    const { user } = useAuth();

    const [packages, setPackages] = useState<TrackingPackageItem[]>([]);
    const [packageDetail, setPackageDetail] = useState<PackageType | null>(null);
    const [loadingPackages, setLoadingPackages] = useState(false);
    const [loadingPackageDetail, setLoadingPackageDetail] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [stats, setStats] = useState<{ packing: number; closed: number; shipping: number; recycled: number } | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);

    const [filter, setFilterState] = useState<TrackingFilterParams>({
        page: 1,
        limit: 10,
        status: 'Đang vận chuyển',
        fromDate: getFirstDayOfMonthString(),
        toDate: getTodayString(),
        smallCollectionPointId: user?.smallCollectionPointId
    });

    useEffect(() => {
        setFilterState((prev) => {
            if (prev.smallCollectionPointId === user?.smallCollectionPointId) {
                return prev;
            }

            return {
                ...prev,
                smallCollectionPointId: user?.smallCollectionPointId
            };
        });
    }, [user?.smallCollectionPointId]);

    const setFilter = useCallback((next: Partial<TrackingFilterParams>) => {
        setFilterState((prev) => {
            const merged = { ...prev, ...next };
            const nextEntries = Object.entries(next);

            const hasRealChange = nextEntries.some(([key, value]) => {
                return prev[key as keyof TrackingFilterParams] !== value;
            });

            return hasRealChange ? merged : prev;
        });
    }, []);

    const fetchStats = useCallback(async (customFilter?: Partial<TrackingFilterParams>) => {
        if (!user?.smallCollectionPointId) {
            setStats({ packing: 0, closed: 0, shipping: 0, recycled: 0 });
            return;
        }

        try {
            const baseParams: Record<string, any> = {
                ...filter,
                ...customFilter,
                smallCollectionPointId: user.smallCollectionPointId
            };

            const statuses = ['Đang đóng gói', 'Đã đóng thùng', 'Đang vận chuyển', 'Tái chế'];

            const promises = statuses.map((s) => {
                const p: Record<string, any> = { ...baseParams, status: s };
                Object.keys(p).forEach((key) => {
                    if (p[key] === undefined || p[key] === null || p[key] === '') delete p[key];
                });
                return filterTrackingPackages(p).then((res) => res.totalItems || 0).catch(() => 0);
            });

            const [packing, closed, shipping, recycled] = await Promise.all(promises);
            setStats({ packing, closed, shipping, recycled });
        } catch {
            setStats({ packing: 0, closed: 0, shipping: 0, recycled: 0 });
        }
    }, [filter, user?.smallCollectionPointId]);

    const fetchPackages = useCallback(
        async (customFilter?: Partial<TrackingFilterParams>) => {
            if (!user?.smallCollectionPointId) {
                setPackages([]);
                setTotalPages(1);
                setTotalItems(0);
                return;
            }

            setLoadingPackages(true);
            setError(null);

            try {
                const params: Record<string, any> = {
                    ...filter,
                    ...customFilter,
                    smallCollectionPointId: user.smallCollectionPointId
                };

                Object.keys(params).forEach((key) => {
                    if (params[key] === undefined || params[key] === null || params[key] === '') {
                        delete params[key];
                    }
                });

                const response = await filterTrackingPackages(params);
                setPackages(response.data || []);
                setTotalPages(response.totalPages || 1);
                setTotalItems(response.totalItems || 0);
                // update stats after fetching packages
                void fetchStats(customFilter);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Không thể tải danh sách kiện hàng theo dõi');
                setPackages([]);
                setTotalPages(1);
                setTotalItems(0);
            } finally {
                setLoadingPackages(false);
            }
        },
        [filter, user?.smallCollectionPointId, fetchStats]
    );

    const fetchPackageDetail = useCallback(async (packageId: string, page = 1, limit = 10) => {
        setLoadingPackageDetail(true);
        setError(null);

        try {
            const response = await getTrackingPackageDetail(packageId, page, limit);
            setPackageDetail(response || null);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Không thể tải chi tiết kiện hàng');
            setPackageDetail(null);
        } finally {
            setLoadingPackageDetail(false);
        }
    }, []);

    const clearPackageDetail = useCallback(() => {
        setPackageDetail(null);
    }, []);

    useEffect(() => {
        void fetchPackages();
    }, [fetchPackages]);

    const value: TrackingContextType = {
        packages,
        packageDetail,
        loadingPackages,
        loadingPackageDetail,
        totalPages,
        totalItems,
        stats,
        filter,
        error,
        setFilter,
        fetchPackages,
        fetchPackageDetail,
        clearPackageDetail
    };

    return (
        <TrackingContext.Provider value={value}>
            {children}
        </TrackingContext.Provider>
    );
};

export const useTrackingContext = (): TrackingContextType => {
    const ctx = useContext(TrackingContext);
    if (!ctx) {
        throw new Error('useTrackingContext must be used within TrackingProvider');
    }
    return ctx;
};

export default TrackingContext;
