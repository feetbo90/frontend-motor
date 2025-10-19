import { isAxiosError, useAxios } from '@/composables/useAxios';
import { useNotification } from '@/composables/useNotification';
import type { AddResources, DeleteResources, GetResourcesList, ParamResourcesList, UpdateResources } from '@/types/resource.type';

export const getResourcesList: GetResourcesList = async (
    params: ParamResourcesList
) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.get('sumber-daya', { params });
        return data
    } catch (error: unknown) {
        let message = 'Gagal mendapatkan data sumber daya.'
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
export const postResources: AddResources = async (payload) => {
    const axios = useAxios();
    const { notifySuccess, notifyError } = useNotification()
    try {
        const { data } = await axios.post('sumber-daya', payload)
        notifySuccess({ title: 'Success Message', msg: data.message || 'Data sumber daya berhasil ditambah' })
        return data
    } catch (error: unknown) {
        let message = 'Gagal menyimpan data sumber daya.'
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
export const putResources: UpdateResources = async (id, payload) => {
    const axios = useAxios();
    const { notifySuccess, notifyError } = useNotification()
    try {
        const { data } = await axios.put(`/sumber-daya/${id}`, payload)
        notifySuccess({ title: 'Success Message', msg: data.message || 'Data sumber daya berhasil diubah' })
        return data
    } catch (error: unknown) {
        let message = 'Gagal mengubah data sumber daya.'
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
export const deleteResources: DeleteResources = async (id) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.delete(`sumber-daya/${id}`)
        return data
    } catch (error: unknown) {
        let message = 'Gagal menghapus data sumber daya.'
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