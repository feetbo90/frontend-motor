import { isAxiosError, useAxios } from '@/composables/useAxios';
import { useNotification } from '@/composables/useNotification';
import type { AddPkColleteralGoods, DeletePkColleteralGoods, GetPkColleteralGoodsList, ParamPkColleteralGoodsList, UpdatePkColleteralGoods } from '@/types/pk-colleteral-goods.types';

export const getPkColleteralGoodsList: GetPkColleteralGoodsList = async (
    params: ParamPkColleteralGoodsList
) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.get('/barang-pk', { params });
        return data
    } catch (error: unknown) {
        let message = 'Gagal mendapatkan data barang PK.'
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
export const postPkColleteralGoods: AddPkColleteralGoods = async (payload) => {
    const axios = useAxios();
    const { notifySuccess, notifyError } = useNotification()
    try {
        const { data } = await axios.post('/barang-pk', payload)
        notifySuccess({ title: 'Success Message', msg: data.message || 'Data barang PK berhasil ditambah' })
        return data
    } catch (error: unknown) {
        let message = 'Gagal menyimpan data barang PK.'
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
export const putPkColleteralGoods: UpdatePkColleteralGoods = async (id, payload) => {
    const axios = useAxios();
    const { notifySuccess, notifyError } = useNotification()
    try {
        const { data } = await axios.put(`/barang-pk/${id}`, payload)
        notifySuccess({ title: 'Success Message', msg: data.message || 'Data barang PK berhasil diubah' })
        return data
    } catch (error: unknown) {
        let message = 'Gagal mengubah data barang PK.'
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
export const deletePkColleteralGoods: DeletePkColleteralGoods = async (id) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.delete(`/barang-pk/${id}`)
        return data
    } catch (error: unknown) {
        let message = 'Gagal menghapus data barang PK.'
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