import React from 'react';

const VoucherTableSkeleton: React.FC = () => (
    <tr className='border-b border-gray-100'>
        <td className='py-3 px-4 text-center w-16'>
            <div className='inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 animate-pulse mx-auto' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-32 animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-40 animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-24 animate-pulse' />
        </td>
        <td className='py-3 px-4'>
            <div className='h-4 bg-gray-200 rounded w-24 animate-pulse' />
        </td>
        <td className='py-3 px-4 text-center'>
            <div className='h-8 w-8 bg-gray-200 rounded animate-pulse mx-auto' />
        </td>
    </tr>
);

export default VoucherTableSkeleton;
