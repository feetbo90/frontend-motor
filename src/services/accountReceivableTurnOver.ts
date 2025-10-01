import { isAxiosError, useAxios } from '@/composables/useAxios';
import { useNotification } from '@/composables/useNotification';
import type { AddAccountReceivableTurnOver, DeleteAccountReceivableTurnOver, GetAccountReceivableTurnOverList, ParamAccountReceivableTurnOverList, UpdateAccountReceivableTurnOver } from '@/types/account-receivable-turnover.type';

export const getAccountReceivableTurnOverList: GetAccountReceivableTurnOverList = async (
    params: ParamAccountReceivableTurnOverList
) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.get('/sirkulasi-piutang', { params });
        return data
    } catch (error: unknown) {
        let message = 'Gagal mendapatkan data sirkulasi piutang.'
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
export const postAccountReceivableTurnOver: AddAccountReceivableTurnOver = async (payload) => {
    const axios = useAxios();
    const { notifySuccess, notifyError } = useNotification()
    try {
        const { data } = await axios.post('/sirkulasi-piutang', payload)
        notifySuccess({ title: 'Success Message', msg: data.message || 'Data sirkulasi piutang berhasil ditambah' })
        return data
    } catch (error: unknown) {
        let message = 'Gagal menyimpan data sirkulasi piutang.'
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
export const putAccountReceivableTurnOver: UpdateAccountReceivableTurnOver = async (id, payload) => {
    const axios = useAxios();
    const { notifySuccess, notifyError } = useNotification()
    try {
        const { data } = await axios.put(`/sirkulasi-piutang/${id}`, payload)
        notifySuccess({ title: 'Success Message', msg: data.message || 'Data sirkulasi piutang berhasil diubah' })
        return data
    } catch (error: unknown) {
        let message = 'Gagal mengubah data sirkulasi piutang.'
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
export const deleteAccountReceivableTurnOver: DeleteAccountReceivableTurnOver = async (id) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.delete(`/sirkulasi-piutang/${id}`)
        return data
    } catch (error: unknown) {
        let message = 'Gagal menghapus data sirkulasi piutang.'
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