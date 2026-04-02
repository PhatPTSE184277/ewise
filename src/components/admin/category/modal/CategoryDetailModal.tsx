'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { X, Layers, Tag, Ruler } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import CategoryService, {
    type AdminAttribute,
    type AdminBrandCategory,
    type AdminChildCategory
} from '@/services/admin/CategoryService';

interface CategoryDetailModalProps {
    open: boolean;
    category: AdminChildCategory | null;
    status?: string;
    onClose: () => void;
}

type TabKey = 'brands' | 'attributes';

const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({ open, category, status, onClose }) => {
    const [activeTab, setActiveTab] = useState<TabKey>('brands');
    const [brands, setBrands] = useState<AdminBrandCategory[]>([]);
    const [brandPage, setBrandPage] = useState(1);
    const [brandTotalPages, setBrandTotalPages] = useState(1);
    const [brandTotalItems, setBrandTotalItems] = useState(0);
    const [attributes, setAttributes] = useState<AdminAttribute[]>([]);
    const [loading, setLoading] = useState(false);

    const categoryId = category?.id;

    useEffect(() => {
        if (!open) return;
        setActiveTab('brands');
        setBrandPage(1);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        setBrandPage(1);
    }, [open, categoryId, status]);

    useEffect(() => {
        if (!open || !categoryId) return;

        let cancelled = false;
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [b, a] = await Promise.all([
                    CategoryService.getBrandsBySubCategory(categoryId, {
                        page: brandPage,
                        limit: 10,
                        status
                    }),
                    CategoryService.getAdminCategoryAttributes({ categoryId, status })
                ]);

                if (cancelled) return;
                setBrands(Array.isArray(b?.data) ? b.data : []);
                setBrandTotalPages(Number(b?.totalPages) || 1);
                setBrandTotalItems(Number(b?.totalItems) || 0);
                setAttributes(Array.isArray(a) ? a : []);
            } catch {
                if (cancelled) return;
                setBrands([]);
                setBrandTotalPages(1);
                setBrandTotalItems(0);
                setAttributes([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void fetchAll();
        return () => {
            cancelled = true;
        };
    }, [open, categoryId, status, brandPage]);

    const title = useMemo(() => category?.name || 'Chi tiết danh mục', [category?.name]);

    if (!open || !category) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/30'></div>

            <div className='relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[95vh]'>
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100'>
                    <div className='flex items-center gap-3 min-w-0'>
                        <div className='w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center'>
                            <Layers size={18} className='text-primary-600' />
                        </div>
                        <div className='min-w-0'>
                            <h2 className='text-xl font-bold text-gray-800 truncate' title={title}>
                                {title}
                            </h2>
                            <div className='text-sm text-gray-500'>Trạng thái: {category.status || 'N/A'}</div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                <div className='flex-1 overflow-y-auto p-6'>
                    <div className='flex gap-2 border-b border-gray-200 mb-6'>
                        <button
                            onClick={() => setActiveTab('brands')}
                            className={`px-4 py-2 font-medium transition-colors relative ${
                                activeTab === 'brands' ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'
                            }`}
                        >
                            <div className='flex items-center gap-2'>
                                <Tag size={18} />
                                <span>Brand</span>
                                <span className='text-sm text-gray-500'>({brandTotalItems || brands.length})</span>
                            </div>
                            {activeTab === 'brands' && (
                                <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600'></div>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('attributes')}
                            className={`px-4 py-2 font-medium transition-colors relative ${
                                activeTab === 'attributes' ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'
                            }`}
                        >
                            <div className='flex items-center gap-2'>
                                <Ruler size={18} />
                                <span>Attribute</span>
                                <span className='text-sm text-gray-500'>({attributes.length})</span>
                            </div>
                            {activeTab === 'attributes' && (
                                <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600'></div>
                            )}
                        </button>
                    </div>

                    <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
                        {loading ? (
                            <div className='p-6 text-center text-gray-400'>Đang tải...</div>
                        ) : activeTab === 'brands' ? (
                            <div className='max-h-[62vh] overflow-auto'>
                                {brands.length ? (
                                    <table className='w-full text-sm text-gray-800 table-fixed'>
                                        <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                                            <tr>
                                                <th className='py-3 px-4 text-center w-[5vw]'>STT</th>
                                                <th className='py-3 px-4 text-left'>Tên</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {brands.map((b, idx) => {
                                                const isLast = idx === brands.length - 1;
                                                const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                                                return (
                                                    <tr
                                                        key={b.brandId}
                                                        className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}
                                                    >
                                                        <td className='py-3 px-4 text-center'>
                                                            <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
                                                                {(brandPage - 1) * 10 + idx + 1}
                                                            </span>
                                                        </td>
                                                        <td className='py-3 px-4 text-gray-700'>{b.brandName || 'N/A'}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className='px-4 py-8 text-center text-gray-400'>Không có brand</div>
                                )}

                                <Pagination
                                    page={brandPage}
                                    totalPages={brandTotalPages}
                                    onPageChange={setBrandPage}
                                />
                            </div>
                        ) : (
                            <div className='max-h-[62vh] overflow-auto'>
                                {attributes.length ? (
                                    <table className='w-full text-sm text-gray-800 table-fixed'>
                                        <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                                            <tr>
                                                <th className='py-3 px-4 text-left'>Tên</th>
                                                <th className='py-3 px-4 text-right w-[110px]'>Min</th>
                                                <th className='py-3 px-4 text-right w-[110px]'>Max</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attributes.map((a, idx) => {
                                                const isLast = idx === attributes.length - 1;
                                                const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-primary-50';
                                                return (
                                                    <tr
                                                        key={a.id}
                                                        className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}
                                                    >
                                                        <td className='py-3 px-4 text-gray-700'>{a.name || 'N/A'}</td>
                                                        <td className='py-3 px-4 text-gray-700 text-right'>{a.minValue ?? '—'}</td>
                                                        <td className='py-3 px-4 text-gray-700 text-right'>{a.maxValue ?? '—'}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className='px-4 py-8 text-center text-gray-400'>Không có attribute</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryDetailModal;
