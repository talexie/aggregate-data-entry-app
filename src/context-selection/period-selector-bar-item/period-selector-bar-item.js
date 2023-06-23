import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import {
    selectors,
    useMetadata,
    usePeriod,
    useDataSetId,
    usePeriodId,
    formatJsDateToDateString,
    periodTypesMapping,
    useClientServerDate,
    yearlyFixedPeriodTypes,
    parsePeriodCode,
    getFixedPeriodsOptionsById,
    getYearOffsetFromNow,
    MONTHLY, 
    QUARTERLY,
    getPeriodsByType
} from '../../shared/index.js'
import DisabledTooltip from './disabled-tooltip.js'
import PeriodMenu from './period-menu.js'
import { useDateLimit } from './use-date-limit.js'
import usePeriods from './use-periods.js'
import useSelectorBarItemValue from './use-select-bar-item-value.js'
import YearNavigator from './year-navigator.js'

export const PERIOD = 'PERIOD'
import { getNowInCalendar } from '@dhis2/multi-calendar-dates';

const periodsSettings ={
  calendar: 'gregory',
  locale:'en'
}
const getUpdatedOptions=(periodType, year)=> {
  const offset = getYearOffsetFromNow(year)
  return  getFixedPeriodsOptionsById(periodType)?.getPeriods({ offset })
}

const getMaxYear = (dateLimit) => {
    // periods run up to, but not including dateLimit, so decrement by 1 ms in case limit is 1 January
    return new Date(dateLimit - 1).getUTCFullYear()
}

export const PeriodSelectorBarItem = ({ calendar, loading,allowedPeriodTypes=[] }) => {
    const now = getNowInCalendar(calendar);
    // use ".eraYear" rather than ".year" because in Ethiopian calendar, eraYear is what our users expect to see (for other calendars, it doesn't matter)
    // there is still a pending decision in Temporal regarding which era to use by default: https://github.com/js-temporal/temporal-polyfill/blob/9350ee7dd0d29f329fc097debf923a517c32f813/lib/calendar.ts#L1964
    const defaultFixedPeriodYear = now.eraYear || now.year;
    /*
    const defaultFixedPeriodType = excludedPeriodTypes?.includes(MONTHLY)
    ? getFixedPeriodsOptionsById(QUARTERLY, periodsSettings)
        : getFixedPeriodsOptionsById(MONTHLY, periodsSettings)
    */


    const currentDate = useClientServerDate({ calendar: calendar })
    const selectorBarItemValue = useSelectorBarItemValue(calendar);
    const currentDay = formatJsDateToDateString(currentDate.serverDate)
    //const currentFullYear = parseInt(currentDay.split('-')[0]);
    const currentFullYear = parseInt(defaultFixedPeriodYear);
    const [periodOpen, setPeriodOpen] = useState(false)
    const [periodId, setPeriodId] = usePeriodId()
    const selectedPeriod = usePeriod(periodId,calendar)
    const [dataSetId] = useDataSetId()
    const { data: metadata, isLoading } = useMetadata()
    const dataSet = selectors.getDataSetById(metadata, dataSetId)
    const dataSetPeriodType = periodTypesMapping[dataSet?.periodType]
    const openFuturePeriods = dataSet?.openFuturePeriods || 0
    const { show: showWarningAlert } = useAlert((message) => message, {
        warning: true,
    })
    const [state,setState] = useState({
        periodType: dataSetPeriodType,
        calendar: calendar,
        year: defaultFixedPeriodYear,
        options: null,
    });
    
    const [year, setYear] = useState(selectedPeriod?.year || currentFullYear)

    const dateLimit = useDateLimit(calendar);
    const [maxYear, setMaxYear] = useState(() => getMaxYear(dateLimit))
    const periods = usePeriods({
        periodType: dataSetPeriodType,
        openFuturePeriods,
        dateLimit: dateLimit,
        year: year,
        calendar: calendar
    })
 

    const onSelectPeriodType = (periodType) => {
        setState({
            periodType,
            options: getUpdatedOptions(periodType, state.year),
        })
        //onChange()
    }

    const onSelectYear = (year) => {
        setState({
            year,
            options: getUpdatedOptions(state.periodType, year),
        })
        //onChange()
    }

    const onSelectPeriod = ({ selected: periodId }, event) => {
        const period =state.options.find(({ id }) => id === periodId)
        //onChange(period, event)
    }

    useEffect(()=>{
    const period = parsePeriodCode(periodId, allowedPeriodTypes)
    setState((t)=>({
        ...t,
        periodType: period?.id??"MONTHLY",
        year: period?.year??defaultFixedPeriodYear,
        options: period?.options,
    }));
    },[periodId,allowedPeriodTypes]);

    console.log("XX:",state,"State:",getPeriodsByType(state?.periodType,()=>{},{
        ...periodsSettings,
        calendar: calendar,
        year: year
    }),"periodID:",periodId);
    
    useEffect(() => {
        if (selectedPeriod?.year) {
            setYear(selectedPeriod.year)
        }
    }, [selectedPeriod?.year])

    useEffect(() => {
        if (dataSetPeriodType) {
            const newMaxYear = getMaxYear(dateLimit)
            setMaxYear(newMaxYear)

            if (!selectedPeriod?.year) {
                //setYear(currentFullYear);
                setYear(newMaxYear);
            }
        }
    //}, [dataSetPeriodType, selectedPeriod?.year, dateLimit, currentFullYear])
    }, [dataSetPeriodType, selectedPeriod?.year, dateLimit])

    useEffect(() => {
        const resetPeriod = (id) => {
            showWarningAlert(`The Period (${id}) is not open or is invalid.`)
            i18n.t('The Period ({{id}}) is not open or is invalid.', {
                id,
            })
            setPeriodId(undefined)
        }

        if (selectedPeriod) {
            const endDate = new Date(selectedPeriod?.endDate)
            if (endDate >= dateLimit) {
                resetPeriod(periodId)
            }

            if (selectedPeriod?.periodType !== dataSetPeriodType) {
                resetPeriod(periodId)
            }
        } else if (periodId) {
            setPeriodId(undefined)
        }
    }, [
        selectedPeriod,
        dateLimit,
        periodId,
        setPeriodId,
        showWarningAlert,
        dataSetPeriodType,
    ])

    return (
        <div data-test="period-selector">
            <DisabledTooltip>
                <SelectorBarItem
                    disabled={!dataSetId || loading || isLoading} 
                    label={i18n.t('Period')}
                    value={periodId ? selectorBarItemValue : undefined}
                    open={periodOpen}
                    setOpen={setPeriodOpen}
                    noValueMessage={i18n.t('Choose a period')}
                >
                    {year ? (
                        <>
                            {!yearlyFixedPeriodTypes.includes(
                                dataSetPeriodType
                            ) && (
                                <YearNavigator
                                    maxYear={maxYear}
                                    year={year}
                                    onYearChange={(year) => setYear(year)}
                                />
                            )}

                            <PeriodMenu
                                periods={periods}
                                onChange={({ selected }) => {
                                    setPeriodId(selected)
                                    setPeriodOpen(false)
                                }}
                                calendar ={ calendar }
                            />
                        </>
                    ) : (
                        <div />
                    )}
                </SelectorBarItem>
            </DisabledTooltip>
        </div>
    )
}
