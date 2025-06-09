"use client"
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export function formatDate(
    date: string | Date,
    formatText: "date" | "time" | "datetime" | "year_month_date" | (string & {}) = "date"
): string {
    let formatString;
    switch (formatText) {
        case "date": {
            formatString = "dd-MM-yyyy";
            break;
        }
        case "time": {
            formatString = "HH:mm";
            break;
        }
        case "datetime": {
            formatString = "dd-MM-yyyy HH:mm";
            break;
        }
        case "year_month_date": {
            formatString = "yyyy-MM-dd";
            break;
        }
        default: {
            formatString = formatText;
            break;
        }
    }
    return date ? format(new Date(date), formatString, { locale: vi }) : "";
}
