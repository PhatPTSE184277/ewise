import React from 'react';
import { User } from '@/services/admin/SendNotiService';
import { formatDate } from '@/utils/FormatDate';
import { formatNumber } from '@/utils/formatNumber';
// removed masking per request

interface UserShowProps {
    user: User;
    stt: number;
    isLast?: boolean;
    isSelected: boolean;
    onToggleSelect: (userId: string) => void;
    hideRole?: boolean;
}

const UserShow: React.FC<UserShowProps & { rowIndex?: number }> = ({
    user,
    stt,
    isLast = false,
    isSelected,
    onToggleSelect,
    rowIndex = 0
}) => {
    const rowBgClass = rowIndex % 2 === 0 ? 'bg-white' : 'bg-primary-50';

    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBgClass}`}> 
            <td className='py-3 px-4 text-center w-12'>
                <input
                    type='checkbox'
                    checked={isSelected}
                    onChange={() => onToggleSelect(user.userId)}
                    className='w-4 h-4 cursor-pointer accent-primary-600'
                />
            </td>
            <td className='py-3 px-4 text-center w-16'>
                <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
                    {formatNumber(stt)}
                </span>
            </td>
            <td className='py-3 px-4 font-medium text-gray-900 w-52'>
                {user.name || 'Không rõ'}
            </td>
            <td className='py-3 px-4 text-gray-700 w-64'>{user.email}</td>
            <td className='py-3 px-4 text-gray-700 w-36'>
                {user.phone || '-'}
            </td>
            <td className='py-3 px-4 text-gray-700 w-36'>
                {formatDate((user as any).createAt)}
            </td>
        </tr>
    );
};

export default UserShow;
