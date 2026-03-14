import React from 'react';
import CustomNumberInput from '@/components/ui/CustomNumberInput';

interface SmallPointConfigListProps {
    company: any;
    onUpdateRadius: (companyId: number, smallPointId: number, radiusKm: number) => void;
    onUpdateMaxDistance: (companyId: number, smallPointId: number, maxRoadDistanceKm: number) => void;
}

const SmallPointConfigList: React.FC<SmallPointConfigListProps> = ({
    company,
    onUpdateRadius,
    onUpdateMaxDistance
}) => {
    const points = company?.smallPoints ?? [];

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
                                        <th className='py-3 px-4 text-left w-[20vw]'>Tên điểm</th>
                                        <th className='py-3 px-4 text-left w-[12vw]'>Bán kính (km)</th>
                                        <th className='py-3 px-4 text-left w-[14vw]'>Khoảng cách tối đa (km)</th>
                                        <th className='py-3 px-4 text-left w-[10vw]'>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {points.length > 0 ? (
                                        points.map((sp: any, idx: number) => {
                                            return (
                                                <tr
                                                    key={sp.smallPointId}
                                                    className='odd:bg-white even:bg-primary-50'
                                                >
                                                    <td className='py-3 px-4'>
                                                        <span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold px-2'>
                                                            {idx + 1}
                                                        </span>
                                                    </td>
                                                    <td className='py-3 px-4 font-medium text-gray-900'>
                                                        {sp.name || `Point ${sp.smallPointId}`}
                                                    </td>
                                                    <td className='py-3 px-4'>
                                                        <CustomNumberInput
                                                            value={sp.radiusKm || 0}
                                                            min={0}
                                                            max={100}
                                                            step={0.1}
                                                            onChange={(val) => onUpdateRadius(company.companyId, sp.smallPointId, val)}
                                                            className='w-20 px-2 py-1 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-primary-600 font-semibold'
                                                        />
                                                    </td>
                                                    <td className='py-3 px-4'>
                                                        <CustomNumberInput
                                                            value={sp.maxRoadDistanceKm || 0}
                                                            min={0}
                                                            max={100}
                                                            step={0.1}
                                                            onChange={(val) => onUpdateMaxDistance(company.companyId, sp.smallPointId, val)}
                                                            className='w-20 px-2 py-1 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-primary-600 font-semibold'
                                                        />
                                                    </td>
                                                    <td className='py-3 px-4'>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            sp.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {sp.active ? 'Hoạt động' : 'Không hoạt động'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className='text-center py-8 text-gray-400'>
                                                Không có điểm thu gom nào.
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

export default SmallPointConfigList;
