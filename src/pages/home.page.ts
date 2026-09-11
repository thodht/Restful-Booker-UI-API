import { type Page } from '@playwright/test';
import type { Locator } from 'playwright';
import { BasePage } from './base.page.ts';
import type { RoomDetails } from '../fixtures/data.fixture.ts';
import { format } from 'date-fns';
import { Utils } from '../utils/utils.ts';

export class HomePage extends BasePage {
    //Header Links
    private readonly RoomsLink = this.page.getByRole('link', { name: 'Rooms' })
    private readonly BookingLink = this.page.getByRole('link', { name: 'Booking' });
    private readonly AmenitiesLink = this.page.getByRole('link', { name: 'Amenities' });
    private readonly ContactLink = this.page.getByRole('link', { name: 'Contact' });
    private readonly AdminLink = this.page.getByRole('link', { name: 'Admin', exact: true });

    //Contact Section
    private readonly ContactNameInput = this.page.getByTestId('ContactName');
    private readonly ContactEmailInput = this.page.getByTestId('ContactEmail');
    private readonly ContactPhoneInput = this.page.getByTestId('ContactPhone');
    private readonly ContactSubjectInput = this.page.getByTestId('ContactSubject');
    private readonly ContactMessageInput = this.page.getByTestId('ContactDescription');
    private readonly ContactSubmitButton = this.page.getByRole('button', { name: 'Submit' })

    //Availability sections
    private readonly CheckInDateInput = this.page.getByRole('textbox').first();
    private readonly CheckOutDateInput = this.page.getByRole('textbox').nth(1);
    private readonly AvailabilitySubmitButton = this.page.getByRole('button', { name: 'Check Availability' });
    private RoomCards: Locator[] = [];
    private Rooms: RoomDetails[] = [];

    private ROOM_SELECTORS = {
        roomID: "a.btn.btn-primary", // Assuming the room ID is in a link with href starting with '/reservation'
        roomCard: "div.col-md-6.col-lg-4", // Updated selector to target the room card container
        name: "h5.card-title", // Assuming the room name is in an h5 with class card-title
        description: "p.card-text",
        amenityItem: "div.d-flex.gap-3.mb-3.flex-wrap", // Assuming amenities are listed as badges within the card
        price: "div.fw-bold.fs-5", // Assuming price is in a div with bold font
    } as const;

    constructor(page: Page) {
        super(page);
    }

    async loadHomePage() {
        await this.navigateTo('/');
        await this.getRoomCards();
        await this.getRooms();
    }

    // Header link methods
    async clickRoomsLink() {
        await this.RoomsLink.click();
    }

    async clickBookingLink() {
        await this.BookingLink.click();
    }

    async clickAmenitiesLink() {
        await this.AmenitiesLink.click();
    }

    async clickContactLink() {
        await this.ContactLink.click();
    }

    async clickAdminLink() {
        await this.AdminLink.click();
    }

    // ----- Availability form methods -----
    // Scrape room details from a room card element
    async scrapeRoomCard(card: Locator, index: number): Promise<RoomDetails> {
        let room: RoomDetails = {
            id: index,
            accessibility: "",
            maxGuests: 0,
            name: "",
            description: "",
            price: 0,
            amenities: [],
            policies: [],
            cleanFee: 0,
            serviceFee: 0
        };

        room.id = Number((await card.locator(this.ROOM_SELECTORS.roomID).getAttribute('href'))?.split('?')[0].split('/').pop());;
        room.name = (await card.locator(this.ROOM_SELECTORS.name).textContent())?.trim() ?? "";
        room.description = (await card.locator(this.ROOM_SELECTORS.description).textContent())?.trim() ?? "";
        room.amenities = (await card.locator(this.ROOM_SELECTORS.amenityItem).textContent())?.split(' ').map(a => a.trim()).filter(Boolean) ?? [];
        room.price = Utils.parseNumber((await card.locator(this.ROOM_SELECTORS.price).textContent())?.trim() ?? "0");

        return room;
    }

    // Get all room cards on the page and store them in this.RoomCards
    async getRoomCards(): Promise<Locator[]> {
        await this.page.waitForSelector(this.ROOM_SELECTORS.roomCard, { timeout: 20_000 });
        this.RoomCards = [];
        this.RoomCards = await this.page.locator(this.ROOM_SELECTORS.roomCard).all();
        return this.RoomCards;
    }

    // Scrape details from the room cards and store them in this.Rooms
    async getRooms(): Promise<RoomDetails[]> {
        this.Rooms = [];
        let index = 0;
        for (const card of this.RoomCards) {
            const room = await this.scrapeRoomCard(card, index);
            index++;
            this.Rooms.push(room);
        }
        return this.Rooms;
    }

    // Check availability for the next 7 days
    async checkAvailabilityNextNDays(N: number): Promise<void> {
        const checkInDate = format(new Date(), 'dd-MM-yyyy');
        const checkOutDate = format(new Date().getDate() + N, 'dd-MM-yyyy');
        await this.CheckInDateInput.focus();
        this.CheckInDateInput.fill(checkInDate);
        await this.CheckInDateInput.dispatchEvent('input'); // Trigger input event to update any bindings
        await this.CheckOutDateInput.focus();
        this.CheckOutDateInput.fill(checkOutDate);
        await this.CheckOutDateInput.dispatchEvent('input'); // Trigger input event to update any bindings
        await this.AvailabilitySubmitButton.click();
        await this.getRoomCards();
        await this.getRooms();
    }

    // Check availability for the next 7 days from specific date
    async checkAvailabilityNextNDaysFrom(date: Date, N: number): Promise<void> {
        const checkInDate = format(date, 'dd-MM-yyyy');
        const checkOutDate = format(date.getDate() + N, 'dd-MM-yyyy');
        await this.CheckInDateInput.focus();
        this.CheckInDateInput.fill(checkInDate);
        await this.CheckInDateInput.dispatchEvent('input'); // Trigger input event to update any bindings
        await this.CheckOutDateInput.focus();
        this.CheckOutDateInput.fill(checkOutDate);
        await this.CheckOutDateInput.dispatchEvent('input'); // Trigger input event to update any bindings
        await this.AvailabilitySubmitButton.click();
        await this.getRoomCards();
        await this.getRooms();
    }

    // Check availability for custom dates
    async checkAvailabilityBetween(checkInDate: string, checkOutDate: string): Promise<void> {
        await this.CheckInDateInput.focus();
        this.CheckInDateInput.fill(checkInDate);
        await this.CheckInDateInput.dispatchEvent('input'); // Trigger input event to update any bindings
        await this.CheckOutDateInput.focus();
        this.CheckOutDateInput.fill(checkOutDate);
        await this.CheckOutDateInput.dispatchEvent('input'); // Trigger input event to update any bindings
        await this.AvailabilitySubmitButton.click();
        await this.getRoomCards();
        await this.getRooms();
    }

    async clickBookNow(roomIndex: number) {
        const bookNowButton = this.page.getByRole('link', { name: 'Book now' }).nth(roomIndex);
        await bookNowButton.click();
    }

    async selectCheapestRoom(): Promise<Locator> {
        let cheapestIndex = 0;
        let cheapestPrice = Number.POSITIVE_INFINITY;
        for (let i = 0; i < this.Rooms.length; i++) {
            if (this.Rooms[i].price < cheapestPrice) {
                cheapestPrice = this.Rooms[i].price;
                cheapestIndex = i;
            }
        }
        await this.clickBookNow(cheapestIndex + 1); // Index = 0 was reserved for the Book Now button on the banner.
        return this.RoomCards[cheapestIndex];
    }

    async selectMostExpensiveRoom() {
        let expensiveIndex = 0;
        let expensivePrice = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < this.Rooms.length; i++) {
            if (this.Rooms[i].price > expensivePrice) {
                expensivePrice = this.Rooms[i].price;
                expensiveIndex = i;
            }
        }
        await this.clickBookNow(expensiveIndex + 1); // Book Now index = 0 was reserved on the banner.
        return this.RoomCards[expensiveIndex];
    }

    // ----- Contact form method -----

    async submitContactMessage(name: string, email: string, phone: string, subject: string, message: string) {
        await this.ContactNameInput.focus();
        await this.ContactNameInput.fill(name);
        //await this.ContactNameInput.dispatchEvent('input'); // Trigger input event to update any bindings
        await this.ContactEmailInput.focus();
        await this.ContactEmailInput.fill(email);
        await this.ContactPhoneInput.focus();
        await this.ContactPhoneInput.fill(phone);
        await this.ContactSubjectInput.focus();
        await this.ContactSubjectInput.fill(subject);
        await this.ContactMessageInput.focus();
        await this.ContactMessageInput.fill(message);
        await this.ContactSubmitButton.click();
    }

    async getMessageByText(text: string) {
        const message = await this.page.getByText(text).textContent();
        return message;
    }
}