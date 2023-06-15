import { generateFixedPeriods } from '@dhis2/multi-calendar-dates'
import moment from 'moment'
import { useMemo, useEffect, useState, useCallback } from 'react'
import {
    formatJsDateToDateString,
    useClientServerDate,
    useUserInfo,
    yearlyFixedPeriodTypes,
} from '../../shared/index.js'



export default function usePeriods({
    periodType,
    year,
    dateLimit,
    // only required when periodType is a yearly period type
    openFuturePeriods,
    calendar
}) {
    // @TODO(calendar)
    const [periods, setPeriods] = useState([]);
    const [isYearlyPeriodType, setIsYearlyPeriodType] = useState(false);
    const [yearForGenerating, setYearForGenerating]= useState(year);
    const { data: userInfo } = useUserInfo()
    const { keyUiLocale: locale } = userInfo.settings
    const currentDate = useClientServerDate({calendar:calendar});
    const currentDay = formatJsDateToDateString(currentDate.serverDate);
    const endsBefore = moment(dateLimit).format('yyyy-MM-DD')
        
    const generateFixedPeriodsPayload = useCallback(()=>({
        calendar: (calendar=='ethiopic'?'ethiopian': calendar),
        periodType: periodType??'MONTHLY',
        year: yearForGenerating,
        endsBefore: endsBefore,
        locale,

        // only used when generating yearly periods, so save to use
        // here, regardless of the period type.
        // + 1 so we include 1970 as well
        yearsCount: yearForGenerating - 1970 + 1,
    }),[calendar,periodType, yearForGenerating,endsBefore,locale]);
    console.log("YYY::", generateFixedPeriodsPayload);
    useEffect(()=>{
        setIsYearlyPeriodType(yearlyFixedPeriodTypes.includes(periodType));
    },[periodType]);

    useEffect(()=>{
        setYearForGenerating(isYearlyPeriodType
        ? year + openFuturePeriods
        : year)
    },[year,openFuturePeriods,isYearlyPeriodType]);

    useEffect(()=>{
        if (!periodType) {
            setPeriods([])
        }
        console.log("YYYYY::",generateFixedPeriodsPayload);
        setPeriods(generateFixedPeriods(generateFixedPeriodsPayload));
        
    },[periodType,generateFixedPeriodsPayload])
    console.log("YYY1111::",periods);
    return useMemo(() => {
        // Adding `currentDay` to the dependency array so this hook will
        // recompute the date limit when the actual date changes
        currentDay

        if (isYearlyPeriodType) {
            return periods
        }
        const [lastPeriodOfPrevYear] = generateFixedPeriods({
            ...generateFixedPeriodsPayload,
            year: yearForGenerating - 1,
        }).slice(-1)
        const [firstPeriodNextYear] = generateFixedPeriods({
            ...generateFixedPeriodsPayload,
            year: yearForGenerating + 1,
        });

        // we want to display the last period of the previous year if it
        // stretches into the current year
        if(
            lastPeriodOfPrevYear &&
            `${year}-01-01` <= lastPeriodOfPrevYear.endDate
        ) 
        {
            const [lastPeriodOfPrevYear] = generateFixedPeriods({
                ...generateFixedPeriodsPayload,
                year: yearForGenerating - 1,
            }).slice(-1)

            periods.unshift(lastPeriodOfPrevYear)
        }

        // if we're allowed to display the first period of the next year, we
        // want to display the first period of the next year if it starts in
        // the current year
        if (
            firstPeriodNextYear &&
            `${year + 1}-01-01` > firstPeriodNextYear.startDate
        ) {
            periods.push(firstPeriodNextYear)
        }
        console.log("pe:",periods);
        return periods.reverse()
    }, [periods, currentDay, year, isYearlyPeriodType,yearForGenerating,generateFixedPeriodsPayload])
}
