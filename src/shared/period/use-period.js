import { createFixedPeriodFromPeriodId } from '@dhis2/multi-calendar-dates'
import { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

const queryKey = [`/system/info`]

const queryOpts = {
    refetchOnMount: false,
    //select: selectorFunction,
    staleTime: 24 * 60 * 60 * 1000,
}

export default function usePeriod(periodId,calendar) {
    // @TODO(calendar)
    /*const [calendar,setCalendar]= useState('gregory');
    const { data, isLoading } = useQuery(queryKey, queryOpts);
    console.log('xxx::::',data);
    useEffect(()=>{
        if(!isLoading){
            if(data?.calendar==='ethiopian'){
                setCalendar('ethiopic');
            }
        }
    },[data?.calendar,isLoading]);*/
    return useMemo(() => {
        if (!periodId) {
            return null
        }

        try {
            return createFixedPeriodFromPeriodId({ periodId, calendar })
        } catch (e) {
            console.error(e)
            return null
        }
    }, [periodId,calendar])
}
