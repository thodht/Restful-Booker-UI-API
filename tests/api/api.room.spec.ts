import { expect } from '@playwright/test';
import type { APIResponse } from '@playwright/test';
import { api } from '../../src/fixtures/api.fixtures.ts';
import type { RoomPayload, Room } from '../../src/api/room.client.ts';
import admin from '../../src/data/admin.user.json' with { type: "json"};

api.describe.serial('Room Operations', () => {
    //test.describe.configure({ mode: 'serial' });

    let roomId: number;
    let token: string;

    const payload: RoomPayload = {
        roomName: "Room 101",
        type: "Family",
        accessible: true,
        image: "/images/room3.jpg",
        description: "Family room, max 6 people.",
        features: ["Wifi", "TV", "Radio", "Refreshments", "Safe", "Views"],
        roomPrice: 160
    };

    api.beforeEach('Login', async ({ authApiClient }) => {
        // Login
        const response: APIResponse = await authApiClient.login({ username: admin.username, password: admin.password });

        expect(response.ok()).toBeTruthy();
        const cookieValue = response.headersArray()[0].value;
        token = cookieValue.split('=')[1].split(';')[0];
    });

    api('Create room', async ({ roomApiClient }) => {
        // Submit Contact Message
        const response: APIResponse = await roomApiClient.createRoom(payload, token);

        const room = await response.json() as unknown as Room;
        expect(room.roomName).toEqual(payload.roomName);
        expect(room.type).toEqual(payload.type);
        expect(room.accessible).toBe(payload.accessible);
        expect(room.image).toEqual(payload.image);
        expect(room.description).toEqual(payload.description);
        expect(room.features).toEqual(payload.features);
        expect(room.roomPrice).toEqual(payload.roomPrice);
        roomId = room.roomid;
        expect(roomId).toBeDefined();
    });

    api('Get room', async ({ roomApiClient }) => {
        // Get contact message
        const response: APIResponse = await roomApiClient.getRoom(roomId);

        const room = await response.json() as unknown as Room;
        expect(room.roomName).toEqual(payload.roomName);
        expect(room.type).toEqual(payload.type);
        expect(room.accessible).toBe(payload.accessible);
        expect(room.image).toEqual(payload.image);
        expect(room.description).toEqual(payload.description);
        expect(room.features).toEqual(payload.features);
        expect(room.roomPrice).toEqual(payload.roomPrice);
        expect(room.roomid).toBe(roomId);
    });

    api('Delete room', async ({ roomApiClient }) => {
        console.log('Deleting room ID:', roomId);
        const response: APIResponse = await roomApiClient.deleteRoom(roomId, token);

        expect(response.status()).toBe(202);
    });
});