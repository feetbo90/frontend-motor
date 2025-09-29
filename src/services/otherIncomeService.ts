import { isAxiosError, useAxios } from '@/composables/useAxios';
import { useNotification } from '@/composables/useNotification';
import type { AddOtherIncome, DeleteOtherIncome, GetOtherIncomeList, ParamOtherIncomeList, UpdateOtherIncome } from '@/types/other-income.type';
import type { DeleteSalesResponse, SalesPayload, SalesResponse } from '@/types/sales.type';

export const getOtherIncomeList: GetOtherIncomeList = async (
    params: ParamOtherIncomeList
) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.get('/pendapatan-lain', { params });
        return data
    } catch (error: unknown) {
        let message = 'Gagal mendapatkan data pendapatan lain.'
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
export const postOtherIncome: AddOtherIncome = async (payload) => {
    const axios = useAxios();
    const { notifySuccess, notifyError } = useNotification()
    try {
        const { data } = await axios.post('/pendapatan-lain', payload)
        notifySuccess({ title: 'Success Message', msg: data.message || 'Data pendapatan lain berhasil ditambah' })
        return data
    } catch (error: unknown) {
        let message = 'Gagal menyimpan data pendapatan lain.'
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
export const putOtherIncome: UpdateOtherIncome = async (id, payload) => {
    const axios = useAxios();
    const { notifySuccess, notifyError } = useNotification()
    try {
        const { data } = await axios.put(`/pendapatan-lain/${id}`, payload)
        notifySuccess({ title: 'Success Message', msg: data.message || 'Data pendapatan lain berhasil diubah' })
        return data
    } catch (error: unknown) {
        let message = 'Gagal mengubah data pendapatan lain.'
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
export const deleteOtherIncome: DeleteOtherIncome = async (id) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.delete(`/pendapatan-lain/${id}`)
        return data
    } catch (error: unknown) {
        let message = 'Gagal menghapus data pendapatan lain.'
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