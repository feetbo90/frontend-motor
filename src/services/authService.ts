import { useAxios } from '@/composables/useAxios';
import type { LoginPayload, LoginResponse } from '@/types/auth-login.type';


export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
    const axios = useAxios();
    const { data } = await axios.post<LoginResponse>('/auth/login', payload);
    return data;
}

export async function logoutApi(): Promise<void> {
    const axios = useAxios();
    await axios.post('/auth/logout');
}
