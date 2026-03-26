import axios from '@/lib/axios';

export const getUndistributedProducts = async (workDate: string, page: number = 1, limit: number = 10): Promise<any> => {
	const response = await axios.get('/assign/products-by-date', {
		params: { workDate, page, limit },
	});
	return response.data;
};

export const getCollectionCompanies = async (page: number = 1, limit: number = 10): Promise<any> => {
  const response = await axios.get('/collection-company/filter', {
    params: {
      page,
      limit,
      type: 'Công ty thu gom',
      status: 'Đang hoạt động',
    },
  });
  return response.data;
};

export const getDistributedProductsByDate = async (workDate: string) => {
  const response = await axios.get('/assign/products-by-date', {
    params: { workDate },
  });
  return response.data;
};

export const getCompanyMetricsByDate = async (workDate: string) => {
  const response = await axios.get('/product-query/company-metrics', {
    params: { workDate },
  });
  return response.data;
};

export const getSCPProductsStatus = async (
  smallPointId: string,
  workDate: string,
  page: number = 1,
  limit: number = 10
) => {
  const response = await axios.get('/product-query/scp-products-status', {
    params: { smallPointId, workDate, page, limit },
  });
  return response.data;
};

export const distributeProducts = async (
  data: { workDate: string; productIds: string[]; targetCompanyIds?: string[] }
) => {
  const response = await axios.post('/assign/products', data);
  return response.data;
};

export type CompanyCapacityResponse = {
  companyId: string;
  companyMaxCapacity: number;
  companyCurrentCapacity: number;
  warehouses: Array<{
    id: string;
    name: string;
    maxCapacity: number;
    currentCapacity: number;
    availableCapacity: number;
  }>;
};

export const getCapacityPoints = async (companyId: string): Promise<CompanyCapacityResponse> => {
  const response = await axios.get(`/Capacity/company/${companyId}`);
  return response.data;
};