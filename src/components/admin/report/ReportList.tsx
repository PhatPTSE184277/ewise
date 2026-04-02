'use client';

import React from 'react';
import { Eye } from 'lucide-react';
import type { ReportItem } from '@/services/admin/ReportService';
import ReportRowSkeleton from './ReportTableSkeleton';

interface ReportListProps {
	reports: ReportItem[];
	loading?: boolean;
	page: number;
	limit: number;
	onView: (report: ReportItem) => void;
}

const ReportList: React.FC<ReportListProps> = ({ reports, loading = false, page, limit, onView }) => {
	const rows = reports ?? [];
	const startIndex = Math.max(0, (page - 1) * limit);

	return (
		<div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
			<div className='overflow-x-auto w-full'>
				<div className='inline-block min-w-full align-middle'>
					<div className='overflow-hidden'>
						<div className='max-h-[70vh] overflow-y-auto w-full'>
							<table className='w-full text-sm text-gray-800 table-fixed'>
								<thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
									<tr>
										<th className='py-3 px-4 text-center w-20'>STT</th>
										<th className='py-3 px-4 text-left'>Người báo cáo</th>
										<th className='py-3 px-4 text-left'>Mô tả</th>
										<th className='py-3 px-4 text-center w-[110px]'>Hành động</th>
									</tr>
								</thead>
								<tbody>
									{loading ? (
										Array.from({ length: 6 }).map((_, idx) => <ReportRowSkeleton key={idx} />)
									) : rows.length === 0 ? (
										<tr>
											<td colSpan={4} className='py-8 text-center text-gray-400'>
												Không có báo cáo
											</td>
										</tr>
									) : (
										rows.map((r, idx) => {
											const isLast = idx === rows.length - 1;
											const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-primary-50';
											return (
												<tr key={r.reportId || idx} className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}>
													<td className='py-3 px-4 text-center'>
														<span className='inline-flex min-w-7 h-7 rounded-full bg-primary-600 text-white text-sm items-center justify-center font-semibold mx-auto px-2'>
															{startIndex + idx + 1}
														</span>
													</td>
													<td className='py-3 px-4 truncate' title={r.reportUserName || ''}>
														{r.reportUserName || 'N/A'}
													</td>
													<td className='py-3 px-4 truncate' title={r.reportDescription || ''}>
														{r.reportDescription || ''}
													</td>
													<td className='py-3 px-4'>
														<div className='flex justify-center'>
															<button
																onClick={() => onView(r)}
																className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
																title='Xem chi tiết'
																aria-label='Xem chi tiết'
															>
																<Eye size={16} />
															</button>
														</div>
													</td>
												</tr>
											);
										})
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

export default ReportList;
