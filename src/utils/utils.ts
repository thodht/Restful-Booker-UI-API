//import { format } from 'date-fns';

export const Utils = {
    parseNumber(input: string): number {
        const match = input.match(/[\d,.]+/);
        return match ? parseFloat(match[0].replace(",", "")) : 0;
    }
}