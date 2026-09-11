import { test } from '../../src/fixtures/page.fixtures';
import loginUsers from '../../src/data/login_users.json';

test.describe('Login', () => {
    test('Login with valid credentials', async ({ loginPage, homePage }) => {
        await homePage.navigateTo('/');
        await homePage.clickAdminLink();
        // Login with valid credential
        const user = loginUsers.valid[0];
        await loginPage.login(user.email, user.password);
    });
}); 