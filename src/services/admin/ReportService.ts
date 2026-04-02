import axios from '@/lib/axios';

export interface ReportItem {
  reportId: string;
  reportUserName: string;
  reportRouteId?: string | null;
  reportDescription?: string | null;
  reportType?: string | null;
  answerMessage?: string | null;
  resolvedAt?: string | null;
  createdAt?: string | null;
  reportUserId?: string | null;
  status?: string | null;
  companyName?: string | null;
  smallCollectionPointName?: string | null;
}

export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  data: T[];
}

/**
 * Fetch available report types from backend.
 * GET /report/type
 */
export const getReportTypes = async (): Promise<string[]> => {
  const response = await axios.get<string[]>('/report/type');
  return response.data;
};

/**
 * Filter reports with pagination and optional filters.
 * GET /report/filter
 */
export const filterReports = async (params: {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  start?: string | null;
  end?: string | null;
} = {}): Promise<PaginatedResponse<ReportItem>> => {
  const response = await axios.get<PaginatedResponse<ReportItem>>('/report/filter', {
    params: {
      PageNumber: params.page ?? 1,
      Limit: params.limit ?? 10,
      Type: params.type,
      Status: params.status,
      Start: params.start,
      End: params.end,
    },
  });
  return response.data;
};

/**
 * Get a single report by id.
 * GET /report/{id}
 */
export const getReportById = async (id: string): Promise<ReportItem> => {
  const response = await axios.get<ReportItem>(`/report/${id}`);
  return response.data;
};

/**
 * Send an answer message for a report.
 * PUT /report/answer/{id}
 * Body: JSON string message
 */
export async function answerReport(id: string, message: string): Promise<any> {
  const response = await axios.put(`/report/answer/${id}`, JSON.stringify(message), {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
}

const ReportService = {
  getReportTypes,
  filterReports,
  getReportById,
  answerReport,
};

export default ReportService;
