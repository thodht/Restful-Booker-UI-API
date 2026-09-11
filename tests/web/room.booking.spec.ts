import { test } from '../../src/fixtures/page.fixtures';
import guests from '../../src/data/guests.json';
// import { format } from 'date-fns';

test.describe(`Check for availability and book a room @smoke @regression`, () => {
    test('Check for availability', async ({ homePage, bookingPage }) => {
        await homePage.loadHomePage();
        //await homePage.selectCheapestRoom();
        await homePage.selectMostExpensiveRoom();

        //const roomDetails = await bookingPage.getRoomDetails();
        await bookingPage.submitCheckInCheckOutDates();
        await bookingPage.submitGuestInfo(guests[0]);
        //console.log('Most expensive room selected', roomDetails.name, ':', roomDetails.price);
    });
});