'use client';

import React from 'react';
import { X, Building2, MapPin, Target } from 'lucide-react';
import SummaryCard from '@/components/ui/SummaryCard';

interface CompanyDetailModalProps {
    open: boolean;
    onClose: () => void;
    company: any;
}

const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
    open,
    onClose,
    company
}) => {
    if (!open || !company) return null;

    const activePoints = company.smallPoints?.filter((sp: any) => sp.active) || [];
    const inactivePoints = company.smallPoints?.filter((sp: any) => !sp.active) || [];

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/50 backdrop-blur-sm'
                onClick={onClose}
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
                            <Building2 size={24} className='text-primary-600' />
                            Chi tiết công ty
                        </h2>
                        <p className='text-sm text-gray-600 mt-1'>
                            Thông tin cấu hình và điểm thu gom
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                <div className='p-6 pb-4 bg-gray-50'>
                    <SummaryCard
                        items={[
                            {
                                icon: <Building2 size={18} className='text-primary-600' />,
                                label: 'Tên công ty',
                                value: company.companyName || `Company ${company.companyId}`,
                            },
                            {
                                icon: <Building2 size={18} className='text-primary-600' />,
                                label: 'Mã công ty',
                                value: company.companyId,
                            },
                            {
                                icon: <Target size={18} className='text-primary-600' />,
                                label: 'Tỷ lệ phân bổ',
                                value: <span className='text-primary-600 font-semibold'>{company.ratioPercent}%</span>,
                            }
                        ]}
                        singleRow={true}
                    />
                </div>

                <div className='px-6 pb-6 bg-gray-50 flex-1 min-h-0'>
                    <div className='bg-white rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col overflow-hidden'>
                        <div className='overflow-x-auto'>
                            <div className='inline-block min-w-full align-middle'>
                                <div className='overflow-hidden'>
                                    <div className='p-6 pb-0'>
                                        {activePoints.length > 0 && (
                                            <div className='mb-6'>
                                                <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                                                    <span className='w-10 h-10 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200'>
                                                        <MapPin size={18} className='text-primary-600' />
                                                    </span>
                                                    Điểm thu gom đang hoạt động
                                                </h3>
                                                <div className='max-h-[34vh] overflow-y-auto'>
                                                <table className='w-full text-sm text-gray-800 table-fixed'>
                                                    <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-200'>
                                                        <tr>
                                                            <th className='py-3 px-4 text-center w-[6vw]'>STT</th>
                                                            <th className='py-3 px-4 text-left w-[44vw]'>Tên điểm</th>
                                                            <th className='py-3 px-4 text-center w-[12vw]'>Bán kính (km)</th>
                                                            <th className='py-3 px-4 text-center w-[14vw]'>KC tối đa (km)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {activePoints.map((point: any, idx: number) => (
                                                            <tr key={point.smallPointId} className='odd:bg-white even:bg-primary-50'>
                                                                <td className='py-3 px-4 text-center'>
                                                                    <span className='w-7 h-7 rounded-full bg-primary-500 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                                                                        {idx + 1}
                                                                    </span>
                                                                </td>
                                                                <td className='py-3 px-4 font-medium text-gray-900'>
                                                                    {point.name || `Point ${point.smallPointId}`}
                                                                </td>
                                                                <td className='py-3 px-4 text-center'>
                                                                    <span className='text-gray-700 font-medium'>{point.radiusKm || 0}</span>
                                                                </td>
                                                                <td className='py-3 px-4 text-center'>
                                                                    <span className='text-gray-700 font-medium'>{point.maxRoadDistanceKm || 0}</span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {inactivePoints.length > 0 && (
                                        <div className='p-6 pt-0'>
                                            <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                                                <span className='w-10 h-10 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200'>
                                                    <MapPin size={18} className='text-primary-600' />
                                                </span>
                                                Điểm thu gom không hoạt động
                                            </h3>
                                            <div className='max-h-[26vh] overflow-y-auto'>
                                                <table className='w-full text-sm text-gray-800 table-fixed'>
                                                    <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold border-b border-primary-200'>
                                                        <tr>
                                                            <th className='py-3 px-4 text-center w-[6vw]'>STT</th>
                                                            <th className='py-3 px-4 text-left w-[30vw]'>Tên điểm</th>
                                                            <th className='py-3 px-4 text-left w-[22vw]'>Địa chỉ</th>
                                                            <th className='py-3 px-4 text-center w-[12vw]'>Bán kính (km)</th>
                                                            <th className='py-3 px-4 text-center w-[14vw]'>KC tối đa (km)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {inactivePoints.map((point: any, idx: number) => (
                                                            <tr key={point.smallPointId} className='odd:bg-white even:bg-primary-50 opacity-70'>
                                                                <td className='py-3 px-4 text-center'>
                                                                    <span className='w-7 h-7 rounded-full bg-gray-100 text-gray-700 text-sm flex items-center justify-center font-semibold mx-auto'>
                                                                        {idx + 1}
                                                                    </span>
                                                                </td>
                                                                <td className='py-3 px-4 font-medium text-gray-900'>
                                                                    {point.name || `Point ${point.smallPointId}`}
                                                                </td>
                                                                <td className='py-3 px-4 text-gray-700'>
                                                                    {point.address || 'N/A'}
                                                                </td>
                                                                <td className='py-3 px-4 text-center'>
                                                                    <span className='text-gray-700 font-medium'>{point.radiusKm || 0}</span>
                                                                </td>
                                                                <td className='py-3 px-4 text-center'>
                                                                    <span className='text-gray-700 font-medium'>{point.maxRoadDistanceKm || 0}</span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {!company.smallPoints || company.smallPoints.length === 0 && (
                                        <div className='p-12 text-center'>
                                            <MapPin size={48} className='text-gray-300 mx-auto mb-4' />
                                            <p className='text-gray-500 font-medium'>
                                                Công ty chưa có điểm thu gom nào
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CompanyDetailModal;
