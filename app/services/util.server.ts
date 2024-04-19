import type { User } from 'payload/generated-types';

export function isAdmin(user?: User) {
    return user?.role === 'admin';
}

export function isDevelopment() {
    return process.env.NODE_ENV !== 'production';
}

export function isErrorResponse(error: unknown) {
    return error && typeof error === 'object' && 'status' in error;
}

export function isError(error: unknown): error is Error {
    return error instanceof Error;
}
