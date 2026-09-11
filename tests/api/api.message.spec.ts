import { expect } from '@playwright/test';
import type { APIResponse } from '@playwright/test';
import { api } from '../../src/fixtures/api.fixtures.ts';
import type { MessagePayload, Message } from '../../src/api/message.client.ts';
import admin from '../../src/data/admin.user.json' with { type: "json"};

api.describe('Message Operations', () => {
    api.describe.configure({ mode: 'serial' });

    let messageId: number;
    let token: string;

    const payload: MessagePayload = {
        name: "Tho Dinh",
        email: "tho@abc.com",
        phone: "123-456-7890",
        subject: "I have an idea",
        description: "just do this, like this...and this."
    };

    function saveToken(t: string) {
        token = t;
    }

    function saveMessageId(id: number) {
        messageId = id;
    }

    api('Submit message', async ({ messageApiClient }) => {
        // Submit Contact Message
        const response: APIResponse = await messageApiClient.submitMessage(payload);

        expect(response.ok).toBeTruthy();
        const message = await response.json() as unknown as Message;
        expect(message.name).toEqual(payload.name);
        expect(message.email).toEqual(payload.email);
        expect(message.phone).toEqual(payload.phone);
        expect(message.subject).toEqual(payload.subject);
        expect(message.description).toEqual(payload.description);
        saveMessageId(message.messageid);
    });
    api('Get message', async ({ messageApiClient }) => {
        // Get contact message
        const response: APIResponse = await messageApiClient.getMessage(messageId);

        expect(response.ok).toBeTruthy();
        const message = await response.json() as unknown as Message;
        expect(message.name).toEqual(payload.name);
        expect(message.email).toEqual(payload.email);
        expect(message.phone).toEqual(payload.phone);
        expect(message.subject).toEqual(payload.subject);
        expect(message.description).toEqual(payload.description);
    });

    api('Delete message', async ({ authApiClient, messageApiClient }) => {
        const response: APIResponse = await authApiClient.login({ username: admin.username, password: admin.password });

        expect(response.ok).toBeTruthy();
        const cookieValue = response.headersArray()[0].value;
        const token = cookieValue.split('=')[1].split(';')[0];
        // Delete contact message
        const response01: APIResponse = await messageApiClient.deleteMessage(messageId, token);

        expect(response01.status()).toEqual(202);
    });
});