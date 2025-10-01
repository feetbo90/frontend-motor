import { isAxiosError, useAxios } from '@/composables/useAxios';
import { useNotification } from '@/composables/useNotification';
import type { SalesPayload, SalesResponse, SalesListResponse, DeleteSalesResponse } from '@/types/sales.type';
import type { AxiosError } from 'axios';


export async function postSales(payload: SalesPayload): Promise<SalesResponse> {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.post<SalesResponse>('/penjualan', payload)
        return data
    } catch (error: unknown) {
        let message = 'Gagal menyimpan data penjualan.'
        if (isAxiosError(error)) {
            message =
                error.response?.data?.message ??
                error.message ??
                message
        }
        notifyError({ title: 'Error Message', msg: message })
        throw error
    }
}
export async function putSales(id: number | null, payload: SalesPayload): Promise<SalesResponse> {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.put<SalesResponse>(`/penjualan/${id}`, payload)
        return data
    } catch (error: unknown) {
        let message = 'Gagal menyimpan data penjualan.'
        if (isAxiosError(error)) {
            message =
                error.response?.data?.message ??
                error.message ??
                message
        }
        notifyError({ title: 'Error Message', msg: message })
        throw error
    }
}

export async function deleteSales(id: number): Promise<DeleteSalesResponse> {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.delete<DeleteSalesResponse>(`/penjualan/${id}`)
        return data
    } catch (error: unknown) {
        let message = 'Gagal menghapus data penjualan.'
        if (isAxiosError(error)) {
            message =
                error.response?.data?.message ??
                error.message ??
                message
        }
        notifyError({ title: 'Error Message', msg: message })
        throw error
    }
}

export async function getSales(params?: { year?: number | undefined, month?: number | undefined, page?: number; branch_id?: string | number; limit?: number }): Promise<SalesListResponse> {
    const axios = useAxios();
    const { data } = await axios.get<SalesListResponse>('/penjualan', { params });
    return data;
}
