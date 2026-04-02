'use client';

import React from 'react';
import { IoFilterOutline } from 'react-icons/io5';

type CategoryStatusFilter = 'Hoạt động' | 'Không hoạt động';

interface CategoryStatusFilterProps {
    value: CategoryStatusFilter;
    onChange: (next: CategoryStatusFilter) => void;
}

const CategoryStatusFilter: React.FC<CategoryStatusFilterProps> = ({ value, onChange }) => {
    return (
        <div className='bg-white rounded-2xl shadow border border-gray-100 px-3 py-2 mb-6'>
            <div className='flex items-center gap-2 flex-wrap min-h-9'>
                <span className='flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 border border-primary-200'>
                    <IoFilterOutline className='text-primary-600' size={16} />
                </span>

                <button
                    onClick={() => onChange('Hoạt động')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        value === 'Hoạt động'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Hoạt động
                </button>

                <button
                    onClick={() => onChange('Không hoạt động')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        value === 'Không hoạt động'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Không hoạt động
                </button>
            </div>
        </div>
    );
};

export default CategoryStatusFilter;
