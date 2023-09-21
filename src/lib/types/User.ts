export interface User {
    id: string;
    fullName: string;
    address: string;
    nonce: string;
    active: boolean;
}

export interface Admin {
    id: string;
    fullName: string;
    email: string;
    avatar?: string;
    updatedAt: string;
    createdAt: string;
    isActivated: boolean;
    emailConfirmed: boolean;
    isSuspended: boolean;
    isBlocked: boolean;
    role: string;
    lastLogin: string;
    changeEmail?: string;
}