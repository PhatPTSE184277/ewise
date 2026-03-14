import React from 'react';
import CustomNumberInput from '@/components/ui/CustomNumberInput';

interface CompanyRatioListProps {
    companies: any[];
    onRatioChange: (companyId: number, value: number) => void;
    onEditDetail: (company: any) => void;
}

const CompanyRatioList: React.FC<CompanyRatioListProps> = ({
    companies,
    onRatioChange,
    onEditDetail
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto w-full'>
                <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                        <div className='max-h-[40vh] overflow-y-auto w-full'>
                            <table className='w-full text-sm text-gray-800 table-fixed'>
                                <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-200'>
                                    <tr>
                                        <th className='py-3 px-4 text-left w-[8vw]'>STT</th>
                                        <th className='py-3 px-4 text-left w-[30vw]'>Tên công ty</th>
                                        <th className='py-3 px-4 text-left w-[10vw]'>Tỷ lệ (%)</th>
                                        <th className='py-3 px-4 text-center w-[8vw]'>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {companies.length > 0 ? (
                                        companies.map((company, idx) => {
                                            return (
                                                <tr
                                                    key={company.companyId}
                                                    className='odd:bg-white even:bg-primary-50'
                                                >
                                                    <td className='py-3 px-4'>
                                                        <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold px-2'>
                                                            {idx + 1}
                                                        </span>
                                                    </td>
                                                    <td className='py-3 px-4 font-medium text-gray-900'>
                                                        {company.companyName || `Company ${company.companyId}`}
                                                    </td>
                                                    <td className='py-3 px-4'>
                                                        <CustomNumberInput
                                                            value={company.ratioPercent || 0}
                                                            min={0}
                                                            max={100}
                                                            onChange={(val) => onRatioChange(company.companyId, val)}
                                                            className={`w-20 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-primary-600 font-semibold bg-white ${
                                                                company.ratioPercent <= 0 ? 'border-red-400' : 'border-primary-200'
                                                            }`}
                                                        />
                                                    </td>
                                                    <td className='py-3 px-4 text-center'>
                                                        <button
                                                            type='button'
                                                            onClick={() => onEditDetail(company)}
                                                            className='text-primary-600 hover:text-primary-800 flex items-center justify-center transition cursor-pointer mx-auto'
                                                            title='Chỉnh sửa chi tiết'
                                                        >
                                                            <svg width='16' height='16' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' viewBox='0 0 24 24'>
                                                                <path d='M12 20h9' />
                                                                <path d='M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z' />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className='text-center py-8 text-gray-400'>
                                                Không có công ty nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyRatioList;
