import React from 'react';
import SmallPointConfigList from './SmallPointConfigList';

interface CompanyDetailConfigProps {
    company: any;
    onUpdateRadius: (companyId: number, smallPointId: number, radiusKm: number) => void;
    onUpdateMaxDistance: (companyId: number, smallPointId: number, maxRoadDistanceKm: number) => void;
}

const CompanyDetailConfig: React.FC<CompanyDetailConfigProps> = ({
    company,
    onUpdateRadius,
    onUpdateMaxDistance
}) => {
    return (
        <>
            <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200">
                        <svg className='w-4 h-4 text-primary-600' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                        </svg>
                    </span>
                    Cấu hình điểm thu gom
                </h3>
                <span className='text-base text-gray-500 font-medium'>
                    {company.companyName || 'N/A'}
                </span>
            </div>
            <SmallPointConfigList
                company={company}
                onUpdateRadius={onUpdateRadius}
                onUpdateMaxDistance={onUpdateMaxDistance}
            />
        </>
    );
};

export default CompanyDetailConfig;
