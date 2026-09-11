import type { APIRequestContext, APIResponse } from '@playwright/test';
import { Endpoints } from '../data/api.config.ts';

export interface MessagePayload {
    name: string,
    email: string,
    phone: string,
    subject: string,
    description: string
}

export interface Message extends MessagePayload {
    messageid: number,
}

export class MessageApiClient {
    // Pass Playwright's request context into the client instance
    constructor(private readonly request: APIRequestContext) { }

    async submitMessage(payload: MessagePayload): Promise<APIResponse> {
        const response = await this.request.post(Endpoints.message, {
            data: payload,
        });
        return response;
    }

    /**
     * Fetch a message by ID
     */
    async getMessage(messageId: number): Promise<APIResponse> {
        const response = await this.request.get(`${Endpoints.message}${messageId}`);
        return response;
    }

    /**
     * Delete a message by ID
     */
    async deleteMessage(messageId: number, token: string): Promise<APIResponse> {
        const response = await this.request.delete(`${Endpoints.message}${messageId}`, { headers: { 'Authorization': token } });
        return response;
    }
}