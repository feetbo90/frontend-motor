import { isAxiosError, useAxios } from '@/composables/useAxios';
import { useNotification } from '@/composables/useNotification';
import type { GetProductRateList, GetProductRatioList, GetProductRatesRatiosList, ParamsProductRate } from '@/types/productRate';

export const getProductRate: GetProductRateList = async (
    params: ParamsProductRate
) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.get(`rate-ratio/${params.branch_id}/descendants`, { 
            params: {
                year: params.year,
                month: params.month,
                month_start: params.month_start,
                month_end: params.month_end
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

/** Endpoint: rate-ratio/{branch_id}/descendants/rates-ratios — params: year, month saja */
export const getProductRatesRatios: GetProductRatesRatiosList = async (
    params: ParamsProductRate
) => {
    const axios = useAxios();
    const { notifyError } = useNotification();
    try {
        const { data } = await axios.get(
            `rate-ratio/${params.branch_id}/descendants/rates-ratios`,
            {
                params: {
                    year: params.year,
                    month: params.month,
                },
            }
        );
        return data;
    } catch (error: unknown) {
        let message = 'Gagal mendapatkan data rates ratios.';
        if (isAxiosError(error)) {
            message =
                error.response?.data?.message ??
                error.message ??
                message;
        }
        notifyError({ title: 'Error Message', msg: message });
        throw error;
    }
}
export const getProductRatio: GetProductRatioList = async (
    params: ParamsProductRate
) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.get(`rate-ratio/${params.branch_id}/ratio/descendants`, { 
            params: {
                year: params.year,
                month: params.month,
                month_start: params.month_start,
                month_end: params.month_end
            }
         });
        return data
    } catch (error: unknown) {
        let message = 'Gagal mendapatkan data rasio.'
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

// New functions for range queries
export const getProductRateRange: GetProductRateList = async (
    params: ParamsProductRate
) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.get(`rate-ratio/${params.branch_id}/descendants/range`, { 
            params: {
                year: params.year,
                month_start: params.month_start,
                month_end: params.month_end
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

export const getProductRatioRange: GetProductRatioList = async (
    params: ParamsProductRate
) => {
    const axios = useAxios();
    const { notifyError } = useNotification()
    try {
        const { data } = await axios.get(`rate-ratio/${params.branch_id}/ratio/descendants`, { 
            params: {
                year: params.year,
                month_start: params.month_start,
                month_end: params.month_end
            }
         });
        return data
    } catch (error: unknown) {
        let message = 'Gagal mendapatkan data rasio.'
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
