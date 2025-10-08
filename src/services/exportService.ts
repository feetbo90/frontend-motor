import { isAxiosError, useAxios } from '@/composables/useAxios';
import { useNotification } from '@/composables/useNotification';
import type { GetExport, PostImport } from '@/types/export';

export const getExport: GetExport = async (
    params
) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const newParams = {
            year: params.year?.toString() ?? '',
            month: params.month?.toString() ?? '',
        };
        const queryString = new URLSearchParams(newParams).toString();
        const { data } = await axios.get(`/export/${params.type}?${queryString}`);
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
export const postImport: PostImport = async (
    file
) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await axios.post(`/upsert/import-to-cabang`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data
    } catch (error: unknown) {
        let message = 'Gagal mengimport data.'
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