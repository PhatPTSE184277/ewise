import axios from '@/lib/axios';

export interface PublicHoliday {
	publicHolidayId: string;
	name: string;
	description?: string | null;
	startDate: string;
	endDate: string;
}

/**
 * Get active public holidays.
 * Endpoint: GET /api/holiday/active
 */
export const getActiveHolidays = async (): Promise<PublicHoliday[]> => {
	const response = await axios.get<PublicHoliday[]>('/holiday/active');
	return response.data;
};

/**
 * Import public holidays from an Excel file (multipart/form-data).
 * Endpoint: POST /api/holiday/import-excel
 */
export const importHolidaysFromExcel = async (file: File): Promise<any> => {
	const form = new FormData();
	form.append('file', file);

	const response = await axios.post('/holiday/import-excel', form, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});

	return response.data;
};

const HolidayService = {
	getActiveHolidays,
	importHolidaysFromExcel,
};

export default HolidayService;
