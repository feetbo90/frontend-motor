import { isAxiosError, useAxios } from '@/composables/useAxios';
import { useNotification } from '@/composables/useNotification';
import type { AddAccountReceivable, DeleteAccountReceivable, GetAccountReceivableList, ParamAccountReceivableList, UpdateAccountReceivable } from '@/types/account-receivable.type';

export const getAccountReceivableList: GetAccountReceivableList = async (
    params: ParamAccountReceivableList
) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.get('piutang', { params });
        return data
    } catch (error: unknown) {
        let message = 'Gagal mendapatkan data piutang.'
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
export const postAccountReceivable: AddAccountReceivable = async (payload) => {
    const axios = useAxios();
    const { notifySuccess, notifyError } = useNotification()
    try {
        const { data } = await axios.post('piutang', payload)
        notifySuccess({ title: 'Success Message', msg: data.message || 'Data piutang berhasil ditambah' })
        return data
    } catch (error: unknown) {
        let message = 'Gagal menyimpan data piutang.'
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
export const putAccountReceivable: UpdateAccountReceivable = async (id, payload) => {
    const axios = useAxios();
    const { notifySuccess, notifyError } = useNotification()
    try {
        const { data } = await axios.put(`/piutang/${id}`, payload)
        notifySuccess({ title: 'Success Message', msg: data.message || 'Data piutang berhasil diubah' })
        return data
    } catch (error: unknown) {
        let message = 'Gagal mengubah data piutang.'
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
export const deleteAccountReceivable: DeleteAccountReceivable = async (id) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.delete(`piutang/${id}`)
        return data
    } catch (error: unknown) {
        let message = 'Gagal menghapus data piutang.'
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