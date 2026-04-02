import axios from '@/lib/axios';

export interface AdminParentCategory {
	id: string;
	name: string;
	parentCategoryId?: string | null;
	status?: string;
}

/**
 * Get parent categories for admin panel.
 * If `status` is provided it will be passed as query param (e.g. "Hoạt động").
 */
export const getAdminParentCategories = async (status?: string): Promise<AdminParentCategory[]> => {
	const response = await axios.get<AdminParentCategory[]>('/categories/admin/parents', {
		params: status ? { status } : undefined,
	});
	return response.data;
};

export interface AdminChildCategory {
	id: string;
	name: string;
	parentCategoryId?: string | null;
	status?: string;
}

export interface PaginatedResponse<T> {
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
 	data: T[];
}

/**
 * Get child categories for admin panel with optional filters and pagination.
 * Matches: GET /api/categories/admin/child?parentId=...&name=...&status=...&page=1&limit=10
 */
export const getAdminChildCategories = async (
 	params: {
 		parentId?: string;
 		name?: string;
 		status?: string;
 		page?: number;
 		limit?: number;
 	} = {}
): Promise<PaginatedResponse<AdminChildCategory>> => {
 	const response = await axios.get<PaginatedResponse<AdminChildCategory>>('/categories/admin/child', {
 		params,
 	});
 	return response.data;
};

export interface AdminAttribute {
 	id: string;
 	name: string;
 	minValue?: number;
 	maxValue?: number;
 	unit?: string;
 	status?: string;
}

/**
 * Get attributes for a category in admin panel.
 * Example: GET /api/categories/attribute/admin?categoryId=...&status=...
 */
export const getAdminCategoryAttributes = async (
 	params: { categoryId?: string; status?: string } = {}
): Promise<AdminAttribute[]> => {
 	const response = await axios.get<AdminAttribute[]>('/categories/attribute/admin', {
 		params,
 	});
 	return response.data;
};

export interface AdminBrand {
 	brandId: string;
 	name: string;
}

export interface AdminBrandCategory {
	categoryName?: string;
	categoryId?: string;
	brandId: string;
	brandName: string;
	points?: number;
	status?: string;
}

/**
 * Get brands for a sub-category (admin) with pagination.
 * Matches: GET /api/brand-category/admin/{categoryId}?page=1&limit=10&status=...
 */
export const getBrandsBySubCategory = async (
	categoryId: string,
	params: { brandName?: string; status?: string; page?: number; limit?: number } = {}
): Promise<PaginatedResponse<AdminBrandCategory>> => {
	const response = await axios.get<PaginatedResponse<AdminBrandCategory>>(`/brand-category/admin/${categoryId}`, {
		params,
	});
	return response.data;
};

/**
 * Import categories via Excel file upload (multipart/form-data).
 * Endpoint: POST /api/categories/system/import-excel
 */
export const importCategoriesFromExcel = async (file: File): Promise<any> => {
 	const form = new FormData();
 	form.append('file', file);

 	const response = await axios.post('/categories/system/import-excel', form, {
 		headers: { 'Content-Type': 'multipart/form-data' },
 	});

 	return response.data;
};

const CategoryService = {
	getAdminParentCategories,
	getAdminChildCategories,
	getAdminCategoryAttributes,
	getBrandsBySubCategory,
	importCategoriesFromExcel,
};

export default CategoryService;

