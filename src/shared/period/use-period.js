import { createFixedPeriodFromPeriodId } from '@dhis2/multi-calendar-dates'
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

const queryKey = [`/system/info`]

const queryOpts = {
    refetchOnMount: false,
    select: selectorFunction,
    staleTime: 24 * 60 * 60 * 1000,
}

const calendar = 'gregory';
export default function usePeriod(periodId) {
    // @TODO(calendar)
    const { data } = useQuery(queryKey, queryOpts);
    
    return useMemo(() => {
        const currentCalendar = (data?.calendar==='ethiopian'?'ethiopic':data?.calendar)??calendar;
        if (!periodId) {
            return null
        }

        try {
            return createFixedPeriodFromPeriodId({ periodId, currentCalendar })
        } catch (e) {
            console.error(e)
            return null
        }
    }, [periodId,data?.calendar])
}
