import React from 'react';
import { formatAddress } from '../../../utils/FormatAddress';
import { formatNumber } from '@/utils/formatNumber';

interface ProductShowProps {
    product: any;
    stt: number;
    isLast?: boolean;
    showCheckbox?: boolean;
    isSelected?: boolean;
    onToggleSelect?: (productId: string) => void;
}

const ProductShow: React.FC<ProductShowProps> = ({ 
    product, 
    stt, 
    isLast = false,
    showCheckbox = false,
    isSelected = false,
    onToggleSelect
}) => {
    const rowBg = (stt - 1) % 2 === 0 ? 'bg-white' : 'bg-primary-50';

    return (
        <tr 
            className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg} ${showCheckbox && isSelected ? 'bg-primary-50' : ''}`}
            onClick={showCheckbox && onToggleSelect ? () => onToggleSelect(product.productId) : undefined}
            style={showCheckbox ? { cursor: 'pointer' } : undefined}
        >
            {showCheckbox && (
                <td className='py-3 px-4 text-center w-16'>
                    <input
                        type='checkbox'
                        checked={isSelected}
                        onChange={() => onToggleSelect && onToggleSelect(product.productId)}
                        onClick={(e) => e.stopPropagation()}
                        className='w-4 h-4 cursor-pointer accent-primary-600'
                    />
                </td>
            )}
            <td className='py-3 px-4 text-center w-[5vw]'>
                <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
                    {formatNumber(stt)}
                </span>
            </td>
            <td className='py-3 px-4 w-[15vw]'>
                <div className='text-gray-900 font-medium truncate' title={`${product.categoryName ?? 'Không rõ'} - ${product.brandName ?? 'Không rõ'}`}>
                    {product.categoryName ? product.categoryName : 'Không rõ'}{' - '}{product.brandName ? product.brandName : 'Không rõ'}
                </div>
            </td>
            <td className='py-3 px-4 w-[20vw]'>
                <div
                    className='line-clamp-2'
                    title={formatAddress(product.address) || 'N/A'}
                >
                    {formatAddress(product.address) || 'N/A'}
                </div>
            </td>
        </tr>
    );
};

export default ProductShow;
