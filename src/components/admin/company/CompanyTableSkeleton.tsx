import React from 'react';

const CompanyTableSkeleton: React.FC = () => (
    <tr className='border-b border-gray-100 hover:bg-gray-50'>
        <td className='py-3 px-4 text-center w-16'>
            <div className='inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 animate-pulse mx-auto' />
        </td>
        <td className='py-3 px-4 font-medium w-44'>
            <div className='h-4 bg-gray-200 rounded w-32 animate-pulse' />
        </td>
        <td className='py-3 px-4 text-gray-700 w-52'>
            <div className='h-4 bg-gray-200 rounded w-40 animate-pulse' />
        </td>
        <td className='py-3 px-4 text-gray-700 w-36'>
            <div className='h-4 bg-gray-200 rounded w-28 animate-pulse' />
        </td>
        <td className='py-3 px-4 text-gray-700 w-52'>
            <div className='h-4 bg-gray-200 rounded w-36 animate-pulse' />
        </td>
        <td className='py-3 px-4 w-36'>
            <div className='flex justify-center gap-2'>
                <div className='h-8 w-8 bg-gray-200 rounded animate-pulse' />
            </div>
        </td>
    </tr>
);

export default CompanyTableSkeleton;
