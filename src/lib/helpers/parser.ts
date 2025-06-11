"use client"
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export function formatDate(
    date: string | Date,
    formatText: "date" | "time" | "datetime" | "year_month_date" | "date_hour_second" | (string & {}) = "date"
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
        case "date_hour_second": {
            formatString = "dd-MM-yyyy HH:mm:ss";
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


export function formatDateISO(date: Date | null) {
    if (!date) return '';

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}