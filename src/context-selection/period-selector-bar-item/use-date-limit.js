
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
} from '../../shared/index.js'
import { generateFixedPeriods } from '@dhis2/multi-calendar-dates'

const getMaxYear = (dateLimit) => {
    // periods run up to, but not including dateLimit, so decrement by 1 ms in case limit is 1 January
    return moment(dateLimit).format('yyyy')
}
export const computePeriodDateLimit = ({
    periodType,
    serverDate,
    openFuturePeriods = 0,
    calendar
}) => {
    //const calendar = 'gregory'
    const date = moment(serverDate).format('yyyy-MM-DD')
    const [currentPeriod] = generateFixedPeriods({
        periodType,
        year: getMaxYear(serverDate),
        calendar,
    })
    console.log("Current:",currentPeriod);
    if (openFuturePeriods <= 0) {
        return new Date(currentPeriod.startDate)
    }

    const followingPeriods = generateFixedPeriods({
        periodType,
        year: getMaxYear(currentPeriod.startDate),
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
export const useDateLimit = (calendar) => {
    const [dataSetId] = useDataSetId()
    const { data: metadata, isLoading } = useMetadata()
    const { fromClientDate } = useClientServerDateUtils(calendar);
    const currentDate = useClientServerDate({calendar: calendar})
    const currentDay = formatJsDateToDateString(currentDate?.serverDate);
    return useMemo(
        () => {
            const currentDate = fromClientDate(getCurrentDate(calendar))
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
        [dataSetId, metadata, currentDay, fromClientDate,calendar,isLoading]
    )
}
