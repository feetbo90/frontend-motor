import { isAxiosError, useAxios } from '@/composables/useAxios';
import { useNotification } from '@/composables/useNotification';
import type { AddStockCirculation, DeleteStockCirculation, GetStockCirculationList, ParamStockCirculationList, UpdateStockCirculation } from '@/types/stock-circulation.type.ts';

export const getStockCirculationList: GetStockCirculationList = async (
    params: ParamStockCirculationList
) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.get('/sirkulasi-stock', { params });
        return data
    } catch (error: unknown) {
        let message = 'Gagal mendapatkan data sirkulasi stok.'
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
export const postStockCirculation: AddStockCirculation = async (payload) => {
    const axios = useAxios();
    const { notifySuccess, notifyError } = useNotification()
    try {
        const { data } = await axios.post('/sirkulasi-stock', payload)
        notifySuccess({ title: 'Success Message', msg: data.message || 'Data sirkulasi stok berhasil ditambah' })
        return data
    } catch (error: unknown) {
        let message = 'Gagal menyimpan data sirkulasi stok.'
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
export const putStockCirculation: UpdateStockCirculation = async (id, payload) => {
    const axios = useAxios();
    const { notifySuccess, notifyError } = useNotification()
    try {
        const { data } = await axios.put(`/sirkulasi-stock/${id}`, payload)
        notifySuccess({ title: 'Success Message', msg: data.message || 'Data sirkulasi stok berhasil diubah' })
        return data
    } catch (error: unknown) {
        let message = 'Gagal mengubah data sirkulasi stok.'
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
export const deleteStockCirculation: DeleteStockCirculation = async (id) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.delete(`/sirkulasi-stock/${id}`)
        return data
    } catch (error: unknown) {
        let message = 'Gagal menghapus data sirkulasi stok.'
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