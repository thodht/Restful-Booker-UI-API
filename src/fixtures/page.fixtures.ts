import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page.ts';
import { HomePage } from '../pages/home.page.ts';
import { BookingPage } from '../pages/booking.page.ts';

type PagesFixtures = {
    loginPage: LoginPage;
    homePage: HomePage;
    bookingPage: BookingPage;
};

export const test = base.extend<PagesFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },
    bookingPage: async ({ page }, use) => {
        const bookingPage = new BookingPage(page);
        await use(bookingPage);
    }
});

export { expect } from '@playwright/test';