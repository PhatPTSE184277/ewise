'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { X, MapPin, CheckCircle, Package } from 'lucide-react';
import { useTrackingContext } from '@/contexts/admin/TrackingContext';
import SummaryCard from '@/components/ui/SummaryCard';
import ProductList from '@/components/small-collector/package/modal/ProductList';
import Pagination from '@/components/ui/Pagination';

interface TrackingModalProps {
    pkg: any;
    onClose: () => void;
}

const TrackingModal: React.FC<TrackingModalProps> = ({ pkg, onClose }) => {
    const { packageDetail, loadingPackageDetail, fetchPackageDetail } = useTrackingContext();
    const [, setActiveTab] = useState<'products' | 'history'>('products');
    const [productPage, setProductPage] = useState(1);
    const limit = 10;

    const detail = packageDetail || pkg;
    
    useEffect(() => {
        const packageId = pkg?.packageId;
        if (packageId) {
            fetchPackageDetail(packageId, productPage, 10);
        }
    }, [pkg?.packageId, fetchPackageDetail, productPage]);

    const totalPages = detail?.products?.totalItems
        ? Math.ceil(detail.products.totalItems / limit)
        : 1;

    const summaryItems = useMemo(() => (
        [
            {
                icon: <Package size={14} className='text-primary-400' />,
                label: 'Mã kiện hàng',
                value: detail?.packageId || 'N/A',
            },
            {
                icon: <MapPin size={14} className='text-primary-400' />,
                label: 'Điểm thu gom',
                value: detail?.smallCollectionPointsName || detail?.smallCollectionPointsAddress || 'N/A',
            },
            {
                icon: <CheckCircle size={14} className='text-primary-400' />,
                label: 'Trạng thái',
                value: (
                    <span
                        className="flex items-center justify-center h-8 px-4 rounded-full text-sm font-medium bg-transparent text-primary-700"
                        style={{ minWidth: 140 }}
                    >
                        {detail?.status || 'N/A'}
                    </span>
                ),
            }
        ]
    ), [detail]);

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/30 backdrop-blur-sm'
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[98vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800'>
                            Theo dõi kiện hàng
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Main content */}
                <div className='flex-1 overflow-y-auto p-6'>
                    {/* Package Info with SummaryCard */}
                    <SummaryCard items={summaryItems} singleRow={true} />

                    {/* Tab Navigation */}
                    <div className='flex gap-2 border-b border-gray-200 mb-6'>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-4 py-2 font-medium transition-colors relative text-primary-600`}
                        >
                            <div className='flex items-center gap-2'>
                                <Package size={18} />
                                <span>Danh sách sản phẩm</span>
                                <span className='text-sm text-gray-500'>({detail?.products?.totalItems ?? 0})</span>
                            </div>
                            <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600'></div>
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
                        {loadingPackageDetail ? (
                            <div className='p-6 text-center text-gray-400'>Đang tải...</div>
                        ) : (
                            <>
                                <ProductList
                                    products={detail?.products?.data || []}
                                    mode='view'
                                    striped={true}
                                />
                                <Pagination
                                    page={productPage}
                                    totalPages={totalPages}
                                    onPageChange={setProductPage}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackingModal;
