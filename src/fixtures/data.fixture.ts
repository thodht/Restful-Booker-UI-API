// ----- Guest that books a room -----
export interface Guest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

// Room details on booking page
export interface RoomDetails {
    id: number;
    name: string;
    accessibility: string;
    maxGuests: number;
    description: string;
    price: number;
    amenities: string[] | null;
    policies: string[];
    cleanFee: number;
    serviceFee: number;
}

// Guest info that are used to book a room
export interface Guest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

// Booking details
export interface Booking {
    bookingId: number;
    room: RoomDetails;
    guest: Guest;
    checkInDate: Date;
    checkOutDate: Date;
    roomFee: number;
    totalPrice: number;
}