import { useAxios } from '@/composables/useAxios';
import type { Entities } from '@/types/entities.type';

export async function getEntities(): Promise<Entities> {
    const axios = useAxios();
    const { data } = await axios.get<Entities>('/entities');
    return data;
}
