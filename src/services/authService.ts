import { isAxiosError, useAxios } from '@/composables/useAxios';
import type { LoginPayload, LoginResponse, SignUpPayload, SignUpResponse } from '@/types/auth-login.type';


export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
    const axios = useAxios();
    const { data } = await axios.post<LoginResponse>('/auth/login', payload);
    return data;
}

export async function logoutApi(): Promise<void> {
    const axios = useAxios();
    await axios.post('auth/logout');
}


export async function signupnApi(payload: SignUpPayload): Promise<SignUpResponse> {
    // const axios = useAxios();
    // const { data } = await axios.post<SignUpResponse>('/auth/register', payload);
    // return data;
    const axios = useAxios();
    try {
        const { data } = await axios.post<SignUpResponse>('/auth/register', payload );
        return data
    } catch (error: unknown) {
        let message = 'Gagal melakukan register.'
        if (isAxiosError(error)) {
            message =
                error.response?.data?.message ??
                error.message ??
                message
        }
        throw error
    }
}