import type { APIRequestContext, APIResponse } from '@playwright/test';
import { Endpoints } from '../data/api.config.ts';

export interface RoomPayload {
    roomName: string,
    type: string,
    accessible: boolean,
    image: string,
    description: string,
    features: string[],
    roomPrice: number
}

export interface Room extends RoomPayload {
    roomid: number,
}

export class RoomApiClient {
    // Pass Playwright's request context into the client instance
    constructor(private readonly request: APIRequestContext) { }

    async createRoom(payload: RoomPayload, token: string): Promise<APIResponse> {
        const response = await this.request.post(Endpoints.room, {
            headers: { 'Authorization': token },
            data: payload,
        });
        return response;
    }

    /**
     * Fetch a room by ID
     */
    async getRoom(roomId: number): Promise<APIResponse> {
        const response = await this.request.get(`${Endpoints.room}${roomId}`);
        return response;
    }

    /**
     * Delete a room by ID
     */
    async deleteRoom(roomId: number, token: string): Promise<APIResponse> {
        const response = await this.request.delete(`${Endpoints.room}${roomId}`, { headers: { 'Authorization': token } });
        return response;
    }
}