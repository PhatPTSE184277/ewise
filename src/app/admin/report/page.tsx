'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Flag } from 'lucide-react';
import Toast from '@/components/ui/Toast';
import Pagination from '@/components/ui/Pagination';
import ReportFilter, { type ReportStatusFilter } from '@/components/admin/report/ReportFilter';
import ReportList from '@/components/admin/report/ReportList';
import ReportDetailModal from '@/components/admin/report/modal/ReportDetailModal';
import ReportService, { type ReportItem } from '@/services/admin/ReportService';
import CustomDateRangePicker from '@/components/ui/CustomDateRangePicker';

const AdminReportPage: React.FC = () => {
	const [types, setTypes] = useState<string[]>([]);
	const [type, setType] = useState('');
	const [status, setStatus] = useState<ReportStatusFilter>('Đang xử lý');
	const [startDate, setStartDate] = useState<string>(() => {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, '0');
		return `${year}-${month}-01`;
	});
	const [endDate, setEndDate] = useState<string>(() => {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, '0');
		const day = String(today.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	});

	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [totalPages, setTotalPages] = useState(1);
	const [reports, setReports] = useState<ReportItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [detailOpen, setDetailOpen] = useState(false);
	const [selected, setSelected] = useState<ReportItem | null>(null);
	const [detailLoading, setDetailLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>({
		open: false,
		type: 'error',
		message: '',
	});

	const tableScrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const loadTypes = async () => {
			try {
				const data = await ReportService.getReportTypes();
				const list = Array.isArray(data) ? data : [];
				setTypes(list);
				if (list.length > 0 && !type) {
					setType(list[0]);
					setPage(1);
				}
			} catch {
				setTypes([]);
			}
		};

		void loadTypes();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchReports = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await ReportService.filterReports({
				page,
				limit,
				type: type || undefined,
				status: status || undefined,
				start: startDate || undefined,
				end: endDate || undefined,
			});

			setReports(Array.isArray(res?.data) ? res.data : []);
			setTotalPages(Number(res?.totalPages || 1));
		} catch {
			setError('Không thể tải danh sách báo cáo');
			setReports([]);
			setTotalPages(1);
		} finally {
			setLoading(false);
		}
	}, [page, limit, type, status, startDate, endDate]);

	useEffect(() => {
		void fetchReports();
	}, [fetchReports]);

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		if (tableScrollRef.current) {
			tableScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	const handleView = async (r: ReportItem) => {
		setDetailOpen(true);
		setSelected(r);
		setDetailLoading(true);
		try {
			const full = await ReportService.getReportById(r.reportId);
			setSelected(full || r);
		} catch {
			setSelected(r);
		} finally {
			setDetailLoading(false);
		}
	};

	const handleCloseDetail = () => {
		setDetailOpen(false);
		setSelected(null);
	};

	const handleSubmitAnswer = async (message: string): Promise<boolean> => {
		if (!selected?.reportId) return false;

		setSubmitting(true);
		try {
			const res = await ReportService.answerReport(selected.reportId, message);
			if (res && res.success === false) {
				const msg = res.message || 'Gửi trả lời thất bại';
				const details = Array.isArray(res.details) ? res.details.join('\n') : '';
				setToast({ open: true, type: 'error', message: details ? `${msg}\n${details}` : msg });
				return false;
			}

			setToast({ open: true, type: 'success', message: 'Gửi trả lời thành công' });
			await fetchReports();
			try {
				const full = await ReportService.getReportById(selected.reportId);
				setSelected(full);
			} catch {
				// ignore
			}
			setDetailOpen(false);
			return true;
		} catch (err: any) {
			const data = err?.response?.data ?? err?.data ?? null;
			if (data) {
				const base = data.message || data.error || 'Gửi trả lời thất bại';
				const details = Array.isArray(data.details)
					? data.details.join('\n')
					: typeof data.details === 'string'
						? data.details
						: '';
				setToast({ open: true, type: 'error', message: details ? `${base}\n${details}` : base });
			} else {
				setToast({ open: true, type: 'error', message: 'Gửi trả lời thất bại' });
			}
			return false;
		} finally {
			setSubmitting(false);
		}
	};

	const rows = useMemo(() => reports ?? [], [reports]);

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8'>
			<div className='flex items-center justify-between gap-2 mb-3'>
				<div className='flex items-center gap-3 min-w-0'>
					<div className='w-10 h-10 rounded-full bg-primary-600 shadow-sm flex items-center justify-center shrink-0'>
						<Flag className='text-white' size={18} />
					</div>
					<div className='min-w-0'>
						<h1 className='text-3xl font-bold text-gray-900 truncate'>Báo cáo</h1>
					</div>
				</div>
				<div className='flex items-center gap-4 flex-1 justify-end max-w-3xl'>
					<div className='flex items-center gap-2 mr-2'>
						<span className='text-xs text-gray-500 font-semibold mr-2 hidden sm:inline'>Loại:</span>
						{(types || []).map((t) => (
							<button
								key={t}
								onClick={() => {
									setType(t);
									setPage(1);
								}}
								className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[120px] ${
									type === t ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								{t}
							</button>
						))}
					</div>
					<div className='min-w-fit'>
						<CustomDateRangePicker
							fromDate={startDate}
							toDate={endDate}
							onFromDateChange={(v) => {
								setStartDate(v);
								setPage(1);
							}}
							onToDateChange={(v) => {
								setEndDate(v);
								setPage(1);
							}}
						/>
					</div>
					
				</div>
			</div>

			<ReportFilter
				status={status}
				onStatusChange={(v) => {
					setStatus(v);
					setPage(1);
				}}
			/>

			{error ? (
				<div className='p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm mb-3'>{error}</div>
			) : null}

			<div className='mb-2' ref={tableScrollRef}>
				<ReportList reports={rows} loading={loading} page={page} limit={limit} onView={handleView} />
			</div>

			<Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />

			<ReportDetailModal
				open={detailOpen}
				report={selected}
				loading={detailLoading}
				submitting={submitting}
				onClose={handleCloseDetail}
				onSubmitAnswer={handleSubmitAnswer}
			/>

			<Toast
				open={toast.open}
				type={toast.type}
				message={toast.message}
				onClose={() => setToast((prev) => ({ ...prev, open: false }))}
			/>
		</div>
	);
};

export default AdminReportPage;
