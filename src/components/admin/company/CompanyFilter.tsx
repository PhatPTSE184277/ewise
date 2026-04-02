import React from 'react';
import { IoFilterOutline } from 'react-icons/io5';

interface CompanyFilterProps {
    status: string;
    type: string;
    onStatusChange: (status: string) => void;
    onTypeChange: (type: string) => void;
}

const CompanyFilter: React.FC<CompanyFilterProps> = ({ status, type, onStatusChange, onTypeChange }) => {
    return (
        <div className='flex flex-col lg:flex-row lg:items-start lg:justify-start gap-1 mb-4'>
            <div className='bg-white rounded-2xl shadow border border-gray-100 px-2 py-2 self-start lg:self-center'>
                <div className='flex items-center gap-1'>
                    <span className='text-xs text-gray-500 font-semibold mr-1 hidden sm:inline'>Loại:</span>
                    <button
                        onClick={() => onTypeChange('Công ty thu gom')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                            type === 'Công ty thu gom'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Công ty thu gom
                    </button>
                    <button
                        onClick={() => onTypeChange('Công ty tái chế')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                            type === 'Công ty tái chế'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Công ty tái chế
                    </button>
                </div>
            </div>

            <div className='bg-white rounded-2xl shadow border border-gray-100 px-2 py-2'>
                <div className='flex items-center gap-1 flex-wrap'>
                    <span className='flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 border border-primary-200'>
                        <IoFilterOutline className='text-primary-600' size={16} />
                    </span>
                    <button
                        onClick={() => onStatusChange('Đang hoạt động')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[90px] ${
                            status === 'Đang hoạt động'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Đang hoạt động
                    </button>
                    <button
                        onClick={() => onStatusChange('Không hoạt động')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[90px] ${
                            status === 'Không hoạt động'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Không hoạt động
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanyFilter;
