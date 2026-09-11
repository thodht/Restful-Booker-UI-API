import type { APIRequestContext, APIResponse } from '@playwright/test';
import { Endpoints } from '../data/api.config.ts';

export interface LoginPayload {
    username: string,
    password: string
}

export class AuthApiClient {
    // Pass Playwright's request context into the client instance
    constructor(private readonly request: APIRequestContext) { }

    async login(payload: LoginPayload): Promise<APIResponse> {
        const response = await this.request.post(Endpoints.login, {
            data: payload,
        });
        return response;
    }

    async logout(token: string): Promise<APIResponse> {
        const respnose = await this.request.post(Endpoints.logout, {
            data: { token: token },
        });
        return respnose;
    }

    async validate(token: string): Promise<APIResponse> {
        const respnose = await this.request.post(Endpoints.validate, {
            data: { token: token },
        });
        return respnose;
    }
}