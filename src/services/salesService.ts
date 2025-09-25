import { useAxios } from '@/composables/useAxios';
import type { SalesPayload, SalesResponse, SalesListResponse } from '@/types/sales.type';

export async function postSales(payload: SalesPayload): Promise<SalesResponse> {
    const axios = useAxios();
    const { data } = await axios.post<SalesResponse>('/penjualan', payload);
    return data;
}

export async function getSales(params?: { branch_id?: string | number; page?: number; limit?: number }): Promise<SalesListResponse> {
    const axios = useAxios();
    const { data } = await axios.get<SalesListResponse>('/penjualan', { params });
    return data;
}
  