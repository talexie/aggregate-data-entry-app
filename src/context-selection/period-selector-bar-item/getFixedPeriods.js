import {
    getMonthlyPeriods,
    getDailyPeriods,
    getCustomCalendarIfExists,
    dhis2CalendarsMap,
    getValidLocale,
    getWeeklyPeriods,
    getYearlyPeriods

} from '@dhis2/multi-calendar-dates';
import {
    getCustomCalendarIfExists,
} from '@dhis2/multi-calendar-dates/utils/helpers';

export const generateFixedPeriods2 = ({
    year: yearString,
    periodType,
    calendar: requestedCalendar,
    locale: requestedLocale = 'en',
    startingDay = 1,
}) => {
    let year
    if (typeof yearString === 'number') {
        year = yearString
    } else {
        if (!isNaN(yearString) && !isNaN(parseInt(yearString))) {
            year = parseInt(yearString)
        } else {
            throw new Error('year must be a number')
        }
    }
    const calendar = getCustomCalendarIfExists(
        dhis2CalendarsMap[requestedCalendar] ?? requestedCalendar
    ) 

    const locale = getValidLocale(requestedLocale)

    if (periodType?.match('WEEKLY')) {
        return getWeeklyPeriods({
            year,
            periodType,
            locale,
            calendar,
            startingDay,
        })
    }
    if (periodType?.startsWith('FY') || periodType === 'YEARLY') {
        // financial year
        return getYearlyPeriods({ year, periodType, locale, calendar })
    }
    if (periodType.match(/SIXMONTHLY/) || periodType.match(/QUARTERLY/)) {
        return getMonthlyPeriods({ year, periodType, locale, calendar })
    }
    switch (periodType) {
        case 'MONTHLY':
        case 'BIMONTHLY':
        case 'QUARTERLY':
        case 'SIXMONTHLY':
        case 'SIXMONTHLYAPR':{
            console.log("T:",getMonthlyPeriods({ year, periodType, locale, calendar }));
            return getMonthlyPeriods({ year, periodType, locale, calendar })
        }
            
        case 'DAILY':
            return getDailyPeriods({ year, periodType, locale, calendar })
        default:
            throw new Error(
                `can not generate period for unrecognised period type "${periodType}"`
            )
    }
}