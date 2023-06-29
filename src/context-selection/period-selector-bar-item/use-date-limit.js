
import moment from 'moment'
import { useMemo } from 'react'
import {
    selectors,
    useDataSetId,
    useMetadata,
    formatJsDateToDateString,
    getCurrentDate,
    periodTypesMapping,
    useClientServerDateUtils,
    useClientServerDate,
    getPeriodsByType,
} from '../../shared/index.js'

const getMaxYear = (dateLimit) => {
    // periods run up to, but not including dateLimit, so decrement by 1 ms in case limit is 1 January
    return parseInt(new Date(dateLimit).getUTCFullYear(),10);
}
export const computePeriodDateLimit = ({
    periodType,
    serverDate,
    openFuturePeriods = 0,
    calendar
}) => {
    //const calendar = 'gregory'
    const date = serverDate.toLocaleDateString('sv');
    const [currentPeriod] = getPeriodsByType(periodType,()=>{},{
        year: getMaxYear(date),
        calendar: calendar
    }).reverse();
    if (openFuturePeriods <= 0 && currentPeriod) {
        return new Date(currentPeriod?.startDate)
    }

    const followingPeriods = getPeriodsByType(periodType,()=>{},{
        year: getMaxYear(currentPeriod?.startDate),
        calendar,
        steps: openFuturePeriods,
    })

    const [lastFollowingPeriod] = followingPeriods.slice(-1)
    return new Date(lastFollowingPeriod?.startDate)
}

/**
 * Returns the first date that is exluded. For example the currend period type
 * is 'Daily' and two open future periods are allowed, then the date limit is
 * two days ahead as that's the first day that's not allowed (the current
 * period is a considered afuture period)
 */
export const useDateLimit = (calendar) => {
    const [dataSetId] = useDataSetId()
    const { data: metadata, isLoading } = useMetadata()
    const { fromClientDate } = useClientServerDateUtils(calendar);
    let currentDate = useClientServerDate({calendar: calendar})
    const currentDay = formatJsDateToDateString(currentDate?.serverDate);
    return useMemo(
        () => {
            currentDate = fromClientDate(getCurrentDate(calendar))
            const dataSet = selectors.getDataSetById(metadata, dataSetId)

            if (!dataSet || isLoading) {
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
        [dataSetId, metadata, currentDay, currentDate, fromClientDate,calendar,isLoading]
    )
}
