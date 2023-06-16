// @TODO: export the groups from the multi-calendar-dates library
import { periodIdentifiers } from './period-types';

export const yearlyFixedPeriodTypes = periodIdentifiers.filter((periodType) =>
    periodType.match(/^(YEARLY|FY[A-Z]{3})/)
)
