import { isAxiosError, useAxios } from '@/composables/useAxios';
import { useNotification } from '@/composables/useNotification';
import type { AddLoadComponent, DeleteLoadComponent, GetLoadComponentList, ParamLoadComponentList, UpdateLoadComponent } from '@/types/load-component.type.ts';

export const getLoadComponentList: GetLoadComponentList = async (
    params: ParamLoadComponentList
) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.get('/beban', { params });
        return data
    } catch (error: unknown) {
        let message = 'Gagal mendapatkan data beban.'
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
export const postLoadComponent: AddLoadComponent = async (payload) => {
    const axios = useAxios();
    const { notifySuccess, notifyError } = useNotification()
    try {
        const { data } = await axios.post('/beban', payload)
        notifySuccess({ title: 'Success Message', msg: data.message || 'Data beban berhasil ditambah' })
        return data
    } catch (error: unknown) {
        let message = 'Gagal menyimpan data beban.'
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
export const putLoadComponent: UpdateLoadComponent = async (id, payload) => {
    const axios = useAxios();
    const { notifySuccess, notifyError } = useNotification()
    try {
        const { data } = await axios.put(`/beban/${id}`, payload)
        notifySuccess({ title: 'Success Message', msg: data.message || 'Data beban berhasil diubah' })
        return data
    } catch (error: unknown) {
        let message = 'Gagal mengubah data beban.'
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
export const deleteLoadComponent: DeleteLoadComponent = async (id) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.delete(`/beban/${id}`)
        return data
    } catch (error: unknown) {
        let message = 'Gagal menghapus data beban.'
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