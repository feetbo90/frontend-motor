import { isAxiosError, useAxios } from '@/composables/useAxios';
import { useNotification } from '@/composables/useNotification';
import type { Entities, CabangResponse } from '@/types/entities.type';

export async function getEntities(): Promise<Entities> {
    const axios = useAxios();
    const { data } = await axios.get<Entities>('/entities');
    return data;
}

export async function getCabangs(): Promise<CabangResponse> {
    const axios = useAxios();
    const { notifyError } = useNotification();
    try {
        const { data } = await axios.get<CabangResponse>('/entity/cabang');
        return data;
    } catch (error: unknown) {
        let message = 'Gagal mendapatkan data cabang.';
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
