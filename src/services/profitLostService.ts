import { isAxiosError, useAxios } from '@/composables/useAxios';
import { useNotification } from '@/composables/useNotification';
import type { AddProfitLost, DeleteProfitLost, GetProfitLostList, ParamProfitLostList, UpdateProfitLost } from '@/types/profit-lost.type.ts';

export const getProfitLostList: GetProfitLostList = async (
    params: ParamProfitLostList
) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.get('/laba-rugi', { params });
        return data
    } catch (error: unknown) {
        let message = 'Gagal mendapatkan data laba rugi.'
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
export const postProfitLost: AddProfitLost = async (payload) => {
    const axios = useAxios();
    const { notifySuccess, notifyError } = useNotification()
    try {
        const { data } = await axios.post('/laba-rugi', payload)
        notifySuccess({ title: 'Success Message', msg: data.message || 'Data laba rugi berhasil ditambah' })
        return data
    } catch (error: unknown) {
        let message = 'Gagal menyimpan data laba rugi.'
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
export const putProfitLost: UpdateProfitLost = async (id, payload) => {
    const axios = useAxios();
    const { notifySuccess, notifyError } = useNotification()
    try {
        const { data } = await axios.put(`/laba-rugi/${id}`, payload)
        notifySuccess({ title: 'Success Message', msg: data.message || 'Data laba rugi berhasil diubah' })
        return data
    } catch (error: unknown) {
        let message = 'Gagal mengubah data laba rugi.'
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
export const deleteProfitLost: DeleteProfitLost = async (id) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.delete(`/laba-rugi/${id}`)
        return data
    } catch (error: unknown) {
        let message = 'Gagal menghapus data laba rugi.'
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