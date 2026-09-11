import { test as base } from '@playwright/test';
import { AuthApiClient } from '../api/auth.client.ts';
import { MessageApiClient } from '../api/message.client.ts';
import { RoomApiClient } from '../api/room.client.ts';

type ApiFixtures = {
    authApiClient: AuthApiClient,
    messageApiClient: MessageApiClient,
    roomApiClient: RoomApiClient,
};

export const api = base.extend<ApiFixtures>({
    authApiClient: async ({ request }, use) => {
        const authClient = new AuthApiClient(request);
        await use(authClient);
    },
    messageApiClient: async ({ request }, use) => {
        const messageClient = new MessageApiClient(request);
        await use(messageClient);
    },
    roomApiClient: async ({ request }, use) => {
        const roomClient = new RoomApiClient(request);
        await use(roomClient);
    },
});