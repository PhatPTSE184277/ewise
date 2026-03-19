'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useMemo, useState } from 'react';
import { Tag, FileText, CircleDollarSign, Coins, CalendarDays } from 'lucide-react';
import SummaryCard from '@/components/ui/SummaryCard';
import { formatDate } from '@/utils/FormatDate';

interface VoucherDetailProps {
    voucher: any;
    onClose: () => void;
}

const VoucherDetail: React.FC<VoucherDetailProps> = ({ voucher, onClose }) => {
    const [selectedImg, setSelectedImg] = useState(0);
    const [zoomImg, setZoomImg] = useState<string | null>(null);

    const images = useMemo(() => {
        if (!voucher) return [];

        if (Array.isArray(voucher?.imageUrls) && voucher.imageUrls.length > 0) {
            return voucher.imageUrls.filter(Boolean);
        }
        if (Array.isArray(voucher?.images) && voucher.images.length > 0) {
            return voucher.images.filter(Boolean);
        }
        if (typeof voucher?.imageUrl === 'string' && voucher.imageUrl.trim()) {
            return [voucher.imageUrl.trim()];
        }
        return [];
    }, [voucher]);

    const currentImage = images[selectedImg] || null;

    if (!voucher) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <div className='absolute inset-0 bg-black/50 backdrop-blur-sm'></div>

            <div className='relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>Chi tiết voucher</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                        aria-label='Đóng'
                    >
                        &times;
                    </button>
                </div>

                <div className='flex-1 overflow-y-auto p-6 bg-gray-50'>
                    <div className='flex flex-col md:flex-row gap-6'>
                        <div className='md:w-1/3 bg-white rounded-xl border border-primary-100 p-4 shadow-sm'>
                            <div className='w-full flex flex-col items-center gap-3'>
                                {currentImage ? (
                                    <img
                                        src={currentImage}
                                        alt='Ảnh voucher'
                                        className='w-full max-w-[220px] h-44 object-contain rounded-xl border border-primary-200 bg-white cursor-zoom-in shadow-sm'
                                        onClick={() => setZoomImg(currentImage)}
                                        onError={(e) => {
                                            e.currentTarget.src = '';
                                        }}
                                    />
                                ) : (
                                    <div className='w-full max-w-[220px] h-44 flex items-center justify-center rounded-xl border border-primary-200 bg-white shadow-sm'>
                                        <span className='text-gray-500'>Ảnh voucher</span>
                                    </div>
                                )}
                                <div className='flex gap-2 flex-wrap justify-center'>
                                    {images.map((img: string, idx: number) => (
                                        <img
                                            key={`${img}-${idx}`}
                                            src={img}
                                            alt={`Ảnh ${idx + 1}`}
                                            className={`w-14 h-14 object-cover rounded-lg border cursor-pointer transition-all ${
                                                selectedImg === idx
                                                    ? 'border-primary-500 ring-2 ring-primary-200 scale-105'
                                                    : 'border-primary-100 hover:border-primary-200'
                                            }`}
                                            onClick={() => setSelectedImg(idx)}
                                            onError={(e) => {
                                                e.currentTarget.src = '';
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='md:w-2/3 space-y-4'>
                            <SummaryCard
                                items={[
                                    {
                                        icon: <Tag size={14} className='text-primary-400' />,
                                        label: 'Mã voucher',
                                        value: voucher?.code || 'Không rõ',
                                    },
                                    {
                                        icon: <FileText size={14} className='text-primary-400' />,
                                        label: 'Tên voucher',
                                        value: voucher?.name || 'Không rõ',
                                    },
                                    {
                                        icon: <CircleDollarSign size={14} className='text-primary-400' />,
                                        label: 'Giá trị',
                                        value: String(voucher?.value ?? 0),
                                    },
                                    {
                                        icon: <Coins size={14} className='text-primary-400' />,
                                        label: 'Điểm đổi',
                                        value: String(voucher?.pointsToRedeem ?? 0),
                                    },
                                    {
                                        icon: <CalendarDays size={14} className='text-primary-400' />,
                                        label: 'Bắt đầu',
                                        value: formatDate(voucher?.startAt) || 'Chưa có',
                                    },
                                    {
                                        icon: <CalendarDays size={14} className='text-primary-400' />,
                                        label: 'Kết thúc',
                                        value: formatDate(voucher?.endAt) || 'Chưa có',
                                    },
                                ]}
                            />

                            <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                                <p className='text-sm font-semibold text-gray-700 mb-2'>Mô tả</p>
                                <p className='text-sm text-gray-700 whitespace-pre-wrap'>
                                    {voucher?.description || 'Chưa có mô tả'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {zoomImg && (
                <div
                    className='fixed inset-0 bg-black/70 flex items-center justify-center z-60'
                    onClick={() => setZoomImg(null)}
                >
                    <img
                        src={zoomImg}
                        alt='Ảnh voucher phóng to'
                        className='max-w-[90vw] max-h-[90vh] shadow-2xl rounded-xl object-contain border-4 border-white'
                    />
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.96) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.25s ease-out;
                }
            `}</style>
        </div>
    );
};

export default VoucherDetail;
