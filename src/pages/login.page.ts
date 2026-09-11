import { type Page } from '@playwright/test';
import { BasePage } from './base.page.ts';

export class LoginPage extends BasePage {
    private readonly usernameInput = this.page.getByRole('textbox', { name: 'Username' });
    private readonly passwordInput = this.page.getByRole('textbox', { name: 'Password' });
    private readonly frontPageLink = this.page.getByRole('link', { name: 'Front Page' });
    private readonly logoutButton = this.page.getByRole('button', { name: 'Logout' });
    private readonly errorMessage = this.page.getByText('Invalid credentials');

    constructor(page: Page) {
        super(page);
    }

    // Login method that fills in the username and password fields, Login button unresponsive atm
    async login(username: string, password: string) {
        await this.usernameInput.focus();
        this.usernameInput.fill(username);
        this.usernameInput.dispatchEvent('input'); // Trigger input event to update any bindings
        await this.passwordInput.focus();
        this.passwordInput.fill(password);
        this.passwordInput.dispatchEvent('input'); // Trigger input event to update any bindings
    }

    // Click the logout button to log out the user
    async logout() {
        await this.logoutButton.click();
    }

    // Click the front page link to navigate back to the home page
    async goToFrontPage() {
        await this.frontPageLink.click();
    }

    // Get the error message text content
    async getErrorMessage() {
        return await this.errorMessage.textContent();
    }
}