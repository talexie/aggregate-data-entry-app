import { createFixedPeriodFromPeriodId } from '@dhis2/multi-calendar-dates'
import { useMemo} from 'react';

export default function usePeriod(periodId,calendar) {
    console.log("XXX:::",calendar);
    // @TODO(calendar)
    return useMemo(() => {
        if (!periodId) {
            return null
        }

        try {
            return createFixedPeriodFromPeriodId({ periodId, calendar: calendar })
        } catch (e) {
            console.error(e)
            return null
        }
    }, [periodId,calendar])
}
