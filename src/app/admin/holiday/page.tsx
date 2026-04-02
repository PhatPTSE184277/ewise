'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, Download } from 'lucide-react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import Toast from '@/components/ui/Toast';
import HolidayService, { type PublicHoliday } from '@/services/admin/HolidayService';
import ImportHolidayModal from '@/components/admin/holiday/modal/ImportHolidayModal';
import HolidayList from '@/components/admin/holiday/HolidayList';
import { getActiveSystemConfigs } from '@/services/admin/SystemConfigService';
import { pickExcelTemplateUrl } from '@/utils/excelTemplateConfig';

const AdminHolidayPage: React.FC = () => {
	const [holidays, setHolidays] = useState<PublicHoliday[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showImportModal, setShowImportModal] = useState(false);
	const [templateUrl, setTemplateUrl] = useState<string | null>(null);
	const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>(
		{
			open: false,
			type: 'error',
			message: '',
		}
	);

	const fetchActive = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await HolidayService.getActiveHolidays();
			setHolidays(Array.isArray(data) ? data : []);
		} catch {
			setError('Không thể tải danh sách ngày nghỉ lễ');
			setHolidays([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void fetchActive();
	}, [fetchActive]);

	useEffect(() => {
		const loadTemplate = async () => {
			try {
				const configs = await getActiveSystemConfigs('Excel');
				setTemplateUrl(pickExcelTemplateUrl(configs, ['ngay nghi', 'nghi le', 'holiday', 'public holiday']));
			} catch {
				setTemplateUrl(null);
			}
		};

		void loadTemplate();
	}, []);

	const handleImportExcel = async (file: File): Promise<boolean> => {
		try {
			const res = await HolidayService.importHolidaysFromExcel(file);
			// handle explicit failure payloads
			if (res && res.success === false) {
				const msg = res.message || 'Thêm dữ liệu thất bại';
				const details = Array.isArray(res.details) ? res.details.join('\n') : '';
				setToast({ open: true, type: 'error', message: details ? `${msg}\n${details}` : msg });
				return false;
			}

			await fetchActive();
			setToast({ open: true, type: 'success', message: 'Thêm dữ liệu hoàn tất' });
			return true;
		} catch (err: any) {
			// Try to read structured error from server
			const data = err?.response?.data ?? err?.data ?? null;
			if (data) {
				const base = data.message || data.error || 'Thêm dữ liệu thất bại';
				const details = Array.isArray(data.details) ? data.details.join('\n') : (typeof data.details === 'string' ? data.details : '');
				const message = details ? `${base}\n${details}` : base;
				setToast({ open: true, type: 'error', message });
			} else {
				setToast({ open: true, type: 'error', message: 'Thêm dữ liệu thất bại' });
			}
			return false;
		}
	};

	const rows = useMemo(() => holidays ?? [], [holidays]);

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative'>
			<div className='flex items-center justify-between gap-2 mb-3'>
				<div className='flex items-center gap-3 min-w-0'>
					<div className='w-10 h-10 rounded-full bg-primary-600 shadow-sm flex items-center justify-center shrink-0'>
						<CalendarDays className='text-white' size={18} />
					</div>
					<div className='min-w-0'>
						<h1 className='text-3xl font-bold text-gray-900 truncate'>Ngày nghỉ lễ</h1>
					</div>
				</div>

				<div className='flex items-center gap-3 shrink-0'>
					<a
						href={templateUrl || '#'}
						download
						onClick={(e) => {
							if (!templateUrl) e.preventDefault();
						}}
						className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition font-medium shadow-sm ${
							templateUrl
								? 'border-primary-300 text-primary-600 hover:bg-primary-50'
								: 'border-gray-200 text-gray-400 cursor-not-allowed'
						}`}
					>
						<Download size={18} />
						Tải file mẫu
					</a>
					<button
						type='button'
						className='flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium shadow-md border border-primary-200 cursor-pointer'
						onClick={() => setShowImportModal(true)}
					>
						<IoCloudUploadOutline size={18} />
						Nhập từ Excel
					</button>
				</div>
			</div>

			{error ? (
				<div className='p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm mb-3'>{error}</div>
			) : null}

			<HolidayList holidays={rows} loading={loading} />

			{showImportModal ? (
				<ImportHolidayModal
					open={showImportModal}
					onClose={() => setShowImportModal(false)}
					onImport={handleImportExcel}
				/>
			) : null}

			<Toast
				open={toast.open}
				type={toast.type}
				message={toast.message}
				onClose={() => setToast({ ...toast, open: false })}
			/>
		</div>
	);
};

export default AdminHolidayPage;
