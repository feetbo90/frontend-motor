
export interface LoginPayload {
    email: string;
    password: string;
}
export interface SignUpPayload {
    name: string;
    email: string;
    password: string;
    entity_type:string;
    entity_id:string
}

export interface LoginResponse {
    token: string;
    refreshToken: string;
    user: User;
}
export interface SignUpResponse {
    message:string;
    user: {
        id:number;
        emai:string;
        name:string
    };
}


export interface User {
    email: string;
    entity_id: number;
    entity_type: string;
    id: string;
    name: string;
}
