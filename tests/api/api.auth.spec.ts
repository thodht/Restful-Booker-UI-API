import { expect } from '@playwright/test';
import type { APIResponse } from '@playwright/test';
import { api } from '../../src/fixtures/api.fixtures.ts';
import type { LoginPayload } from '../../src/api/auth.client.ts';
import admin from '../../src/data/admin.user.json' with { type: "json"};
import { AuthState } from '../../src/data/api.config.ts';

api.describe('Auth Operations', () => {
    api('Login', async ({ authApiClient }) => {
        const payload: LoginPayload = {
            username: admin.username,
            password: admin.password
        };

        // Login
        const response: APIResponse = await authApiClient.login(payload);

        expect(response.ok).toBeTruthy();
        const cookieValue = response.headersArray()[0].value;
        const accessToken = cookieValue.split('=')[1].split(';')[0];
        AuthState.saveToken(accessToken);
        expect(accessToken).not.toBeNull;

    });
    api('Logout', async ({ authApiClient }) => {
        // Logout
        const response: APIResponse = await authApiClient.logout(AuthState.accessToken);
        expect(response.ok).toBeTruthy();
    });
});