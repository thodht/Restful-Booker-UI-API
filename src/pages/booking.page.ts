import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page.ts';
import type { RoomDetails, Guest } from '../fixtures/data.fixture.ts';
import { Utils } from '../utils/utils.ts';

export class BookingPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private readonly FirstNameInput = this.page.getByRole('textbox', { name: 'Firstname' });
    private readonly LastNameInput = this.page.getByRole('textbox', { name: 'Lastname' });
    private readonly EmailInput = this.page.getByRole('textbox', { name: 'Email' });
    private readonly PhoneInput = this.page.getByRole('textbox', { name: 'Phone' });

    private readonly ReserveNowButton = this.page.getByRole('button', { name: 'Reserve Now' });
    private readonly CancelButton = this.page.getByRole('button', { name: 'Cancel' });
    private readonly ReturnHomeButton = this.page.getByRole('link', { name: 'Return home' });

    private ROOM_SELECTORS = {
        roomCards: "div.mb-4",
        name: "h1.fw-bold.mb-2", // Assuming the room name is in an h1 element
        accessibility: "span.badge.bg-success", // Assuming accessibility info is in a span with class badge.bg-success
        maxGuests: "div.text-muted", // Assuming max guests info is in a div with class text-muted
        description: "p", // Assuming the room description is in a p with class card-text
        price: "span.fs-2.fw-bold.text-primary.me-2", // Assuming price is in a div with bold font
        amenitiesCard: "div.row.g-3.d-flex.flex-wrap",
        amenities: "span", // Assuming the room description is in a p with class card-text
        policiesCard: "div.row.g-4",
        policies: "li", // Assuming the room description is in a p with class card-text
        fees: "div.d-flex.justify-content-between", // Assuming the service fee is in a div with class d-flex.gap-2.align-items-center        
    } as const;


    // Click the Reserve Now button to submit the booking form
    async clickReserveNow() {
        await this.ReserveNowButton.click();
    }

    // Click the Cancel button to cancel the booking process and return to the home page
    async clickCancel() {
        await this.CancelButton.click();
    }

    // Click the Return Home button to return to the home page after booking
    async clickReturnHome() {
        await this.ReturnHomeButton.click();
    }

    // Collect room details from the booking page and return a RoomDetails object
    async getRoomDetails(): Promise<RoomDetails> {
        const url = this.page.url();
        const roomID: number = Number(url.split('?')[0].split('/').pop()); // Extract room ID from URL
        const roomName = (await this.page.locator(this.ROOM_SELECTORS.name).textContent())?.split(' ')[0] || "";
        const roomAccessibility = await this.page.locator(this.ROOM_SELECTORS.accessibility).first().textContent() || "";
        const roomMaxGuests = Utils.parseNumber(await this.page.locator(this.ROOM_SELECTORS.maxGuests).last().textContent() || "");
        const roomDescription = await this.page.locator(this.ROOM_SELECTORS.description).first().textContent() || "";
        const roomPrice = Utils.parseNumber(await this.page.locator(this.ROOM_SELECTORS.price).last().textContent() || "");
        const amentiniesCard = this.page.locator(this.ROOM_SELECTORS.roomCards).nth(4);
        const roomAmenities = await amentiniesCard.locator(this.ROOM_SELECTORS.amenities).allInnerTexts() || [];
        const policiesCard = this.page.locator(this.ROOM_SELECTORS.roomCards).nth(5);
        const roomPolicies = await policiesCard.locator(this.ROOM_SELECTORS.policies).allInnerTexts() || [];
        const roomCleanFee = Utils.parseNumber(await this.page.locator(this.ROOM_SELECTORS.fees).nth(1).last().textContent() || "");
        const roomServiceFee = Utils.parseNumber(await this.page.locator(this.ROOM_SELECTORS.fees).nth(2).last().textContent() || "");

        const room: RoomDetails = {
            id: roomID,
            name: roomName,
            accessibility: roomAccessibility,
            maxGuests: roomMaxGuests,
            description: roomDescription,
            price: roomPrice,
            amenities: roomAmenities,
            policies: roomPolicies,
            cleanFee: roomCleanFee,
            serviceFee: roomServiceFee
        };

        return room;
    }

    // Select check-in and check-out dates and click Reserve Now
    // The datetime picker doesn't work at the moment, so just click Reserve Now button.
    async submitCheckInCheckOutDates() {
        await this.ReserveNowButton.click();
    }

    // Fill in guest info and click Reserve Now button
    async submitGuestInfo(guest: Guest) {
        await this.FirstNameInput.focus();
        await this.FirstNameInput.fill(guest.firstName);
        //await this.FirstNameInput.dispatchEvent('input');
        await this.LastNameInput.focus();
        await this.LastNameInput.fill(guest.lastName);
        //await this.LastNameInput.dispatchEvent('input');
        await this.EmailInput.focus();
        await this.EmailInput.fill(guest.email);
        //await this.EmailInput.dispatchEvent('input');
        await this.PhoneInput.focus();
        await this.PhoneInput.fill(guest.phone);
        //await this.PhoneInput.dispatchEvent('input');
        await this.ReserveNowButton.click();
        await expect(this.page.getByRole('heading', { name: 'Booking Confirmed' })).toBeVisible();
    }
}