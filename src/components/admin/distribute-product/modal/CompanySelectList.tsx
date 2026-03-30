import React from 'react';
import { formatWeightKg } from '@/utils/formatNumber';

interface CompanySelectListProps {
    company: any;
    stt: number;
    isSelected: boolean;
    onToggleSelect: () => void;
    isLast?: boolean;
    disabled?: boolean;
}

const CompanySelectList: React.FC<CompanySelectListProps> = ({
    company,
    stt,
    isSelected,
    onToggleSelect,
    isLast = false,
    disabled = false
}) => {
    return (
        <tr
            className={`${!isLast ? 'border-b border-primary-100' : ''} ${isSelected ? 'bg-primary-50' : ''} odd:bg-white even:bg-primary-50 ${
                disabled ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
            }`}
            onClick={disabled ? undefined : onToggleSelect}
        >
            <td className='py-3 px-4 text-center w-16'>
                <input
                    type='checkbox'
                    checked={isSelected}
                    onChange={disabled ? undefined : onToggleSelect}
                    onClick={(e) => e.stopPropagation()}
                    disabled={disabled}
                    className={`w-4 h-4 accent-primary-600 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                />
            </td>
            <td className='py-3 px-4 text-center w-[5vw]'>
                <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                    {stt}
                </span>
            </td>
            <td className='py-3 px-4 w-[18vw]'>
                <div className='text-gray-900 font-medium'>{company.name || 'N/A'}</div>
                <div className='text-xs text-gray-500 mt-1'>{company.companyEmail || ''}</div>
            </td>
            <td className='py-3 px-4 w-[14vw]'>
                <div className='text-gray-700 line-clamp-2'>{company.city || 'N/A'}</div>
            </td>
            <td className='py-3 px-4 text-right w-[12vw]'>
                <span className='text-gray-700 font-medium'>{formatWeightKg(company.availableCapacity ?? 0)}</span>
            </td>
            {/* <td className='py-3 px-4 text-right w-[12vw]'>
                <span className='text-gray-700 font-medium'>{formatWeightKg(company.currentCapacity ?? 0)}</span>
            </td> */}
            <td className='py-3 px-4 text-right w-[12vw]'>
                <span className='text-gray-700 font-medium'>{formatWeightKg(company.maxCapacity ?? 0)}</span>
            </td>
        </tr>
    );
};

export default CompanySelectList;
