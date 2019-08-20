import { Month } from '../models/month';
import { Day } from '../models/day';

export class DateTimeUtils {
    static getDaysInMonth = function (month, year) {
        return new Date(year, month, 0).getDate();
    };

    static readonly months: Array<Month> = [
        { monthNumber: 1, monthDescription: "Jan" },
        { monthNumber: 2, monthDescription: "Feb" },
        { monthNumber: 3, monthDescription: "Mar" },
        { monthNumber: 4, monthDescription: "Apr" },
        { monthNumber: 5, monthDescription: "May" },
        { monthNumber: 6, monthDescription: "Jun" },
        { monthNumber: 7, monthDescription: "Jul" },
        { monthNumber: 8, monthDescription: "Aug" },
        { monthNumber: 9, monthDescription: "Sep" },
        { monthNumber: 10, monthDescription: "Oct" },
        { monthNumber: 11, monthDescription: "Nov" },
        { monthNumber: 12, monthDescription: "Dec" }
    ];

    static readonly days: Array<Day> = [
        { dayNumber: 1, dayDescription: "Mo" },
        { dayNumber: 2, dayDescription: "Tu" },
        { dayNumber: 3, dayDescription: "We" },
        { dayNumber: 4, dayDescription: "Th" },
        { dayNumber: 5, dayDescription: "Fr" },
        { dayNumber: 6, dayDescription: "Sa" },
        { dayNumber: 7, dayDescription: "Su" }
    ]
}