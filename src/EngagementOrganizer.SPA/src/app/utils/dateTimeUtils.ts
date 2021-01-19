import { Month } from '../models/month';
import { Day } from '../models/day';

export class DateTimeUtils {

    static getDaysInMonth = function (monthBase1, year) {
        return new Date(year, monthBase1, 0).getDate();
    };

    static countDaysTo(date: Date, targetDayOfWeek, directionAndSteps) {
        var count = 0;
        var calculatedDate: Date = date;
        while (calculatedDate.getDay() == targetDayOfWeek) {
            date = this.addDays(date, directionAndSteps);
        }
        return count;
    }

    static addDays(date, days) {
        const copy = new Date(Number(date))
        copy.setDate(date.getDate() + days)
        return copy
    }

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