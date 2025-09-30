import { isAxiosError, useAxios } from '@/composables/useAxios';
import { useNotification } from '@/composables/useNotification';
import type { AddResidualValueReserve, DeleteResidualValueReserve, GetResidualValueReserveList, ParamResidualValueReserveList, UpdateResidualValueReserve } from '@/types/residual-value-reserve.type.ts';

export const getResidualValueReserveList: GetResidualValueReserveList = async (
    params: ParamResidualValueReserveList
) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.get('/cadangan', { params });
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
export const postResidualValueReserve: AddResidualValueReserve = async (payload) => {
    const axios = useAxios();
    const { notifySuccess, notifyError } = useNotification()
    try {
        const { data } = await axios.post('/cadangan', payload)
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
export const putResidualValueReserve: UpdateResidualValueReserve = async (id, payload) => {
    const axios = useAxios();
    const { notifySuccess, notifyError } = useNotification()
    try {
        const { data } = await axios.put(`/cadangan/${id}`, payload)
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
export const deleteResidualValueReserve: DeleteResidualValueReserve = async (id) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.delete(`/cadangan/${id}`)
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