import {
    getAdjacentFixedPeriods,
    getFixedPeriodByDate,
} from '@dhis2/multi-calendar-dates'
import moment from 'moment'
import { useMemo, useState, useEffect } from 'react'
import {
    selectors,
    useDataSetId,
    useMetadata,
    formatJsDateToDateString,
    getCurrentDate,
    periodTypesMapping,
    useClientServerDateUtils,
    useClientServerDate,
} from '../../shared/index.js'
import { useQuery } from '@tanstack/react-query';

const queryKey = [`/system/info`]

const queryOpts = {
    refetchOnMount: false,
    //select: selectorFunction,
    staleTime: 24 * 60 * 60 * 1000,
}
export const computePeriodDateLimit = ({
    periodType,
    serverDate,
    openFuturePeriods = 0,
    calendar
}) => {
    //const calendar = 'gregory'
    const date = moment(serverDate).format('yyyy-MM-DD')
    const currentPeriod = getFixedPeriodByDate({
        periodType,
        date,
        calendar,
    })
    console.log("current Period:",currentPeriod);
    if (openFuturePeriods <= 0) {
        return new Date(currentPeriod.startDate)
    }

    const followingPeriods = getAdjacentFixedPeriods({
        period: currentPeriod,
        calendar,
        steps: openFuturePeriods,
    })

    const [lastFollowingPeriod] = followingPeriods.slice(-1)

    return new Date(lastFollowingPeriod.startDate)
}

/**
 * Returns the first date that is exluded. For example the currend period type
 * is 'Daily' and two open future periods are allowed, then the date limit is
 * two days ahead as that's the first day that's not allowed (the current
 * period is a considered afuture period)
 */
export const useDateLimit = () => {
    const [dataSetId] = useDataSetId()
    const [calendar,setCalendar]= useState('gregory');
    const { data: metadata } = useMetadata()
    const { fromClientDate } = useClientServerDateUtils(calendar);
    const currentDate = useClientServerDate({calendar: calendar})
    
    const { data, isLoading } = useQuery(queryKey, queryOpts);
    useEffect(()=>{
        if(!isLoading){
            if(data?.calendar==='ethiopian'){
                setCalendar('ethiopic');
            }
        }
    },[data?.calendar,isLoading]);
    const currentDay = formatJsDateToDateString(currentDate?.serverDate);
    return useMemo(
        () => {
            console.log("calendar:",calendar, "date:",currentDate);
            const currentDate = fromClientDate(getCurrentDate(calendar))
            console.log("current Date:",currentDate);
            const dataSet = selectors.getDataSetById(metadata, dataSetId)

            if (!dataSet) {
                return currentDay;
            }

            const periodType = periodTypesMapping[dataSet.periodType]
            const openFuturePeriods = dataSet.openFuturePeriods || 0

            return computePeriodDateLimit({
                periodType,
                openFuturePeriods,
                serverDate: currentDate.serverDate,
                calendar: calendar
            })
        },

        // Adding `dateWithoutTime` to the dependency array so this hook will
        // recompute the date limit when the actual date changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataSetId, metadata, currentDay, fromClientDate,calendar]
    )
}
