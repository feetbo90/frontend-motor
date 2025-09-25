
export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    refreshToken: string;
    user: User;
}

export interface User {
    email: string;
    entity_id: string;
    entity_type: string;
    id: string;
    name: string;
}
