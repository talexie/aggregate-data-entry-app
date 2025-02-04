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
    convertGregoryToOther
} from '../../shared/index.js'
import DisabledTooltip from './disabled-tooltip.js'
import PeriodMenu from './period-menu.js'
import { useDateLimit } from './use-date-limit.js'
import usePeriods from './use-periods.js'
import useSelectorBarItemValue from './use-select-bar-item-value.js'
import YearNavigator from './year-navigator.js'

export const PERIOD = 'PERIOD'

const getMaxYear = (dateLimit) => {
    // periods run up to, but not including dateLimit, so decrement by 1 ms in case limit is 1 January
    return new Date(dateLimit - 1).getUTCFullYear()
}

export const PeriodSelectorBarItem = () => {
    const currentDate = useClientServerDate()
    const currentDay = formatJsDateToDateString(currentDate.serverDate)
    const currentFullYear = parseInt(currentDay.split('-')[0])
    const [periodOpen, setPeriodOpen] = useState(false)
    const [periodId, setPeriodId] = usePeriodId()
    const [selected, setSelected] = useState(null);
    const selectedPeriod = usePeriod(periodId)
    const [dataSetId] = useDataSetId()
    const { data: metadata } = useMetadata()
    const dataSet = selectors.getDataSetById(metadata, dataSetId)
    const dataSetPeriodType = periodTypesMapping[dataSet?.periodType]
    const openFuturePeriods = dataSet?.openFuturePeriods || 0
    const { show: showWarningAlert } = useAlert((message) => message, {
        warning: true,
    })

    const [year, setYear] = useState(selectedPeriod?.year || currentFullYear)

    const dateLimit = useDateLimit()

    const [maxYear, setMaxYear] = useState(() => getMaxYear(dateLimit))
    const periods = usePeriods({
        periodType: dataSetPeriodType,
        openFuturePeriods,
        dateLimit,
        year,
    })

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
                setYear(currentFullYear)
            }
        }
    }, [dataSetPeriodType, selectedPeriod?.year, dateLimit, currentFullYear])

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
        dataSet,
        periodId,
        setPeriodId,
        showWarningAlert,
        dataSetPeriodType,
    ])

    const selectorBarItemValue = useSelectorBarItemValue(selected)

    return (
        <div data-test="period-selector">
            <DisabledTooltip>
                <SelectorBarItem
                    disabled={!dataSetId}
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
                                periods={convertGregoryToOther(periods,dataSetPeriodType)}
                                onChange={({ selected, period }) => {
                                    setSelected(period)
                                    setPeriodId(selected)
                                    setPeriodOpen(false)
                                }}
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
