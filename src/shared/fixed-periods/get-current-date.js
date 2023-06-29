import { getNowInCalendar } from '@dhis2/multi-calendar-dates';
/**
 * Initialise a Date instance with Date.now() for Jest mocking.
 */
export default function getCurrentDate(calendar) {
    const now = getNowInCalendar(calendar);
    const currentDate = new Date(`${now.eraYear}-${now.month}-${now.day}`);
    // This will ensure that there's no rounding issue when calculating the
    // offset to the server time
    currentDate.setMilliseconds(0);

    return currentDate
}
