'use client';

import React, { useMemo, useState } from 'react';
import { X, User, Flag, Tag, Calendar, Building2, MapPin } from 'lucide-react';
import CustomTextarea from '@/components/ui/CustomTextarea';
import SummaryCard from '@/components/ui/SummaryCard';
import { formatDate } from '@/utils/FormatDate';
import type { ReportItem } from '@/services/admin/ReportService';

interface ReportDetailModalProps {
	open: boolean;
	report: ReportItem | null;
	loading?: boolean;
	submitting?: boolean;
	onClose: () => void;
	onSubmitAnswer: (message: string) => Promise<boolean>;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
	open,
	report,
	loading = false,
	submitting = false,
	onClose,
	onSubmitAnswer,
}) => {
	const [answer, setAnswer] = useState('');

	const isAnswered = useMemo(() => {
		const msg = (report?.answerMessage ?? '').trim();
		return msg.length > 0;
	}, [report?.answerMessage]);

	const summaryItems = useMemo(() => {
		if (!report) return [];
		return [
			{ icon: <User size={18} className='text-primary-600' />, label: 'Người báo cáo', value: report.reportUserName || 'N/A' },
			{ icon: <Flag size={18} className='text-primary-600' />, label: 'Trạng thái', value: report.status || '' },
			{ icon: <Tag size={18} className='text-primary-600' />, label: 'Loại', value: report.reportType || '' },
			{ icon: <Calendar size={18} className='text-primary-600' />, label: 'Ngày tạo', value: formatDate(report.createdAt || '') },
			{ icon: <Building2 size={18} className='text-primary-600' />, label: 'Công ty', value: report.companyName || '' },
			{ icon: <MapPin size={18} className='text-primary-600' />, label: 'Điểm thu gom', value: report.smallCollectionPointName || '' },
		];
	}, [report]);

	const canAnswer = Boolean(report?.reportId) && !isAnswered;

	const handleClose = () => {
		setAnswer('');
		onClose();
	};

	const handleSubmit = async () => {
		if (!answer.trim()) return;
		const ok = await onSubmitAnswer(answer.trim());
		if (ok) {
			setAnswer('');
		}
	};

	if (!open) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
			<div className='absolute inset-0 bg-black/30 backdrop-blur-sm'></div>

			<div className='relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
				<div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100'>
					<div>
						<h2 className='text-2xl font-bold text-gray-800'>Chi tiết báo cáo</h2>
					</div>
					<button
						onClick={handleClose}
						disabled={submitting}
						className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition disabled:opacity-40'
						aria-label='Đóng'
					>
						<X size={28} />
					</button>
				</div>

				<div className='flex-1 overflow-y-auto p-6 space-y-4 bg-white'>
					{loading ? (
						<div className='text-sm text-gray-500'>Đang tải...</div>
					) : !report ? (
						<div className='text-sm text-gray-500'>Không có dữ liệu</div>
					) : (
						<>
							<SummaryCard items={summaryItems} />

							<div className='p-4 rounded-xl border border-primary-100 bg-white'>
								<div className='text-xs text-gray-500 mb-1'>Mô tả</div>
								<div className='text-sm text-gray-900 whitespace-pre-line wrap-break-word'>
									{report.reportDescription || ''}
								</div>
							</div>

							<div className='p-4 rounded-xl border border-primary-100 bg-white'>
								<div className='text-xs text-gray-500 mb-1'>Nội dung trả lời</div>
								{isAnswered ? (
									<div className='text-sm text-gray-900 whitespace-pre-line wrap-break-word'>{report.answerMessage}</div>
								) : (
									<CustomTextarea
										value={answer}
										onChange={setAnswer}
										placeholder='Nhập nội dung trả lời...'
										rows={4}
										disabled={!canAnswer || submitting}
									/>
								)}
								{!canAnswer ? (
									<div className='text-xs text-gray-500 mt-2'>Báo cáo đã được trả lời, chỉ có thể xem.</div>
								) : null}
							</div>
						</>
					)}
				</div>

				<div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white'>
					{canAnswer ? (
						<button
							onClick={handleSubmit}
							disabled={submitting || !answer.trim()}
							className='px-6 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed'
						>
							{submitting ? 'Đang gửi...' : 'Gửi trả lời'}
						</button>
					) : (
						<button
							onClick={handleClose}
							className='px-6 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200 bg-primary-600 hover:bg-primary-700'
						>
							Đóng
						</button>
					)}
				</div>
			</div>

			<style jsx>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: scale(0.96) translateY(10px);
					}
					to {
						opacity: 1;
						transform: scale(1) translateY(0);
					}
				}
				.animate-fadeIn {
					animation: fadeIn 0.3s ease-out;
				}
			`}</style>
		</div>
	);
};

export default ReportDetailModal;
