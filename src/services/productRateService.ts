import { isAxiosError, useAxios } from '@/composables/useAxios';
import { useNotification } from '@/composables/useNotification';
import type { GetProductRateList, ParamsProductRate } from '@/types/productRate';

export const getProductRate: GetProductRateList = async (
    params: ParamsProductRate
) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.get(`rate-ratio/${params.branch_id}/descendants`, { 
            params: {
                year: params.year,
                month: params.month
            }
         });
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
