import { isAxiosError, useAxios } from '@/composables/useAxios';
import { useNotification } from '@/composables/useNotification';
import type { AddIncome, GetIncomeList, ParamIncomeList, UpdateIncome } from '@/types/income.type';
import type { DeleteSalesResponse, SalesPayload, SalesResponse } from '@/types/sales.type';

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

export const getIncomeList: GetIncomeList = async (
    params: ParamIncomeList
) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.get('/pendapatan', { params });
        return data
    } catch (error: unknown) {
        let message = 'Gagal mendapatkan data pendapatan.'
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
export const postIncome: AddIncome = async (payload) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.post('/pendapatan', payload)
        return data
    } catch (error: unknown) {
        let message = 'Gagal menyimpan data pendapatan.'
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
export const putIncome: UpdateIncome = async (id,payload) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.put(`/pendapatan/${id}`, payload)
        return data
    } catch (error: unknown) {
        let message = 'Gagal mengubah data pendapatan.'
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