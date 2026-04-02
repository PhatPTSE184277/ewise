'use client';

import React from 'react';
import { IoFilterOutline } from 'react-icons/io5';

export type ReportStatusFilter = '' | 'Đang xử lý' | 'Đã xử lý';

interface ReportFilterProps {
	types: string[];
	type: string;
	onTypeChange: (value: string) => void;
	status: ReportStatusFilter;
	onStatusChange: (value: ReportStatusFilter) => void;
}

const ReportFilter: React.FC<ReportFilterProps> = ({ types, type, onTypeChange, status, onStatusChange }) => {
	return (
		<div className='flex flex-col lg:flex-row lg:items-start lg:justify-start gap-1 mb-6'>
			<div className='bg-white rounded-2xl shadow border border-gray-100 px-2 py-2'>
				<div className='flex items-center gap-1'>
					<span className='text-xs text-gray-500 font-semibold mr-1 hidden sm:inline'>Loại:</span>
					{(types || []).map((t) => (
						<button
							key={t}
							onClick={() => onTypeChange(t)}
							className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
								type === t ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`}
						>
							{t}
						</button>
					))}
				</div>
			</div>

			<div className='bg-white rounded-2xl shadow border border-gray-100 px-3 py-2'>
				<div className='flex items-center gap-2 flex-wrap'>
					<span className='flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 border border-primary-200'>
						<IoFilterOutline className='text-primary-600' size={16} />
					</span>
					<button
						onClick={() => onStatusChange('Đang xử lý')}
						className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[120px] ${
							status === 'Đang xử lý' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						Đang xử lý
					</button>
					<button
						onClick={() => onStatusChange('Đã xử lý')}
						className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[120px] ${
							status === 'Đã xử lý' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						Đã xử lý
					</button>
				</div>
			</div>
		</div>
	);
};

export default ReportFilter;
