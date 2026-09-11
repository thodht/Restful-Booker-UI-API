import { test, expect } from '../../src/fixtures/page.fixtures';
import contactMessages from '../../src/data/contact_messages.json';


test.describe('Validate Contact Us form and send a message @regression', () => {
    test('Validate the form and send a message', async ({ homePage }) => {
        await homePage.loadHomePage();

        // Form validation and submission for each message in the contactMessages.json
        for (const messageObj of contactMessages) {
            await homePage.submitContactMessage(messageObj.name, messageObj.email, messageObj.phone, messageObj.subject, messageObj.message);
            const message = await homePage.getMessageByText(messageObj.expectedMessage);
            expect(message).toContain(messageObj.expectedMessage);
            await homePage.refresh(); // Refresh the page to reset the form for the next message          
        }
    });
});