import { getNowInCalendar, generateFixedPeriods } from '@dhis2/multi-calendar-dates';
import i18n from '@dhis2/d2-i18n';

export const DAILY = 'DAILY'
export const WEEKLY = 'WEEKLY'
export const WEEKLYWED = 'WEEKLYWED'
export const WEEKLYTHU = 'WEEKLYTHU'
export const WEEKLYSAT = 'WEEKLYSAT'
export const WEEKLYSUN = 'WEEKLYSUN'
export const WEEKS_THIS_YEAR = 'WEEKS_THIS_YEAR'
export const BIWEEKLY = 'BIWEEKLY'
export const MONTHLY = 'MONTHLY'
export const BIMONTHLY = 'BIMONTHLY'
export const QUARTERLY = 'QUARTERLY'
export const SIXMONTHLY = 'SIXMONTHLY'
export const SIXMONTHLYAPR = 'SIXMONTHLYAPR'
export const YEARLY = 'YEARLY'
export const FINANCIAL = 'FINANCIAL'
export const FYNOV = 'FYNOV'
export const FYOCT = 'FYOCT'
export const FYJUL = 'FYJUL'
export const FYAPR = 'FYAPR'

export const PERIOD_TYPE_REGEX = {
  [DAILY]: /^([0-9]{4})([0-9]{2})([0-9]{2})$/, // YYYYMMDD
  [WEEKLY]: /^([0-9]{4})()W([0-9]{1,2})$/, // YYYY"W"[1-53]
  [BIWEEKLY]: /^([0-9]{4})BiW([0-9]{1,2})$/, // YYYY"BiW"[1-27]
  [WEEKLYWED]: /^([0-9]{4})(Wed)W([0-9]{1,2})$/, // YYYY"WedW"[1-53]
  [WEEKLYTHU]: /^([0-9]{4})(Thu)W([0-9]{1,2})$/, // YYYY"ThuW"[1-53]
  [WEEKLYSAT]: /^([0-9]{4})(Sat)W([0-9]{1,2})$/, // YYYY"SatW"[1-53]
  [WEEKLYSUN]: /^([0-9]{4})(Sun)W([0-9]{1,2})$/, // YYYY"SunW"[1-53]
  [MONTHLY]: /^([0-9]{4})([0-9]{2})$/, // YYYYMM
  [BIMONTHLY]: /^([0-9]{4})([0-9]{2})B$/, // YYYY0[1-6]"B"
  [QUARTERLY]: /^([0-9]{4})Q([1234])$/, // YYYY"Q"[1-4]
  [SIXMONTHLY]: /^([0-9]{4})S([12])$/, // YYYY"S"[1/2]
  [SIXMONTHLYAPR]: /^([0-9]{4})AprilS([12])$/, // YYYY"AprilS"[1/2]
  // [SIXMONTHLYNOV]: /^([0-9]{4})NovS([12])$/, // YYYY"NovS"[1/2] Not supported?
  [YEARLY]: /^([0-9]{4})$/, // YYYY
  [FYNOV]: /^([0-9]{4})Nov$/, // YYYY"Nov"
  [FYOCT]: /^([0-9]{4})Oct$/, // YYYY"Oct"
  [FYJUL]: /^([0-9]{4})July$/, // YYYY"July"
  [FYAPR]: /^([0-9]{4})April$/, // YYYY"April"
}

export const getPeriods = ({ periodType, config, fnFilter, periodSettings = {} }) => {
  const offset = parseInt(config?.offset??0, 10)
  const isFilter = config.filterFuturePeriods
  const isReverse = periodType?.match(/^FY|YEARLY/)
      ? true
      : config.reversePeriods

  const { calendar = 'gregory', locale = 'en' } = periodSettings
  const now = getNowInCalendar(calendar)
  const year = (now.eraYear || now.year) + offset

  const params = {
      periodType,
      year,
      calendar,
      locale,
      startingDay: config.startDay,
  }

  let periods = generateFixedPeriods(params)
  periods = isFilter ? fnFilter(periods) : periods
  periods = !isReverse ? periods : periods.reverse()

  return periods
}
export const getPeriodsByType = (periodType, fnFilter, periodSettings,config={}) => {
    if (config && periodType?.includes('WEEKLY')){
        return getPeriods({
          periodType: periodType??"WEEKLY",
          config: {
              ...config,
              startDay: config.startDay,
          },
          fnFilter,
          periodSettings,
        });
    }
    return getPeriods({
        periodType: periodType??"MONTHLY",
        config: config,
        fnFilter,
        periodSettings,
    });
}
export const filterFuturePeriods = (periods) => {
  const array = []
  const now = new Date(Date.now())

  for (let i = 0; i < periods.length; i++) {
      if (new Date(periods[i].startDate) <= now) {
          array.push(periods[i])
      }
  }

  return array
}
export const filterPeriodTypesById = ( allPeriodTypes = [], excludedPeriodTypes = []) =>{
  return  allPeriodTypes.filter((period) =>{
    return !excludedPeriodTypes.includes(period.id)
  });
}

export const getOptions = (periodSettings,config) => {
  return [
      {
          id: DAILY,
          getPeriods: getPeriodsByType(
            DAILY,
            filterFuturePeriods, 
            periodSettings,
            config
          ),
          name: i18n.t('Daily'),
      },
      {
          id: WEEKLY,
          getPeriods: getPeriodsByType(
              WEEKLY,
              filterFuturePeriods,
              periodSettings,
              { startDay: 1 },
          ),
          name: i18n.t('Weekly'),
      },
      {
          id: WEEKLYWED,
          getPeriods: getPeriodsByType(
              WEEKLYWED,
              filterFuturePeriods,
              periodSettings,
              { startDay: 3 },
          ),
          name: i18n.t('Weekly (Start Wednesday)'),
      },
      {
          id: WEEKLYTHU,
          getPeriods: getPeriodsByType(
              WEEKLYTHU,
              filterFuturePeriods,
              periodSettings,
              { startDay: 4 },
          ),
          name: i18n.t('Weekly (Start Thursday)'),
      },
      {
          id: WEEKLYSAT,
          getPeriods: getPeriodsByType(
              WEEKLYSAT,
              filterFuturePeriods,
              periodSettings,
              { startDay: 6 },
          ),
          name: i18n.t('Weekly (Start Saturday)'),
      },
      {
          id: WEEKLYSUN,
          getPeriods: getPeriodsByType(
              WEEKLYSUN,
              filterFuturePeriods,
              periodSettings,
              { startDay: 7 },
          ),
          name: i18n.t('Weekly (Start Sunday)'),
      },
      {
          id: BIWEEKLY,
          getPeriods:getPeriodsByType(
              BIWEEKLY,
              filterFuturePeriods,
              periodSettings,
              config
          ),
          name: i18n.t('Bi-weekly'),
      },
      {
          id: MONTHLY,
          getPeriods:getPeriodsByType(
              MONTHLY,
              filterFuturePeriods,
              periodSettings,
              config
          ),
          name: i18n.t('Monthly'),
      },
      {
          id: BIMONTHLY,
          getPeriods: getPeriodsByType(
              BIMONTHLY,
              filterFuturePeriods,
              periodSettings,
              config
          ),
          name: i18n.t('Bi-monthly'),
      },
      {
          id: QUARTERLY,
          getPeriods:getPeriodsByType(
              QUARTERLY,
              filterFuturePeriods,
              periodSettings,
              config
          ),
          name: i18n.t('Quarterly'),
      },
      {
          id: SIXMONTHLY,
          getPeriods: getPeriodsByType(
              SIXMONTHLY,
              filterFuturePeriods,
              periodSettings,
              config
          ),
          name: i18n.t('Six-monthly'),
      },
      {
          id: SIXMONTHLYAPR,
          getPeriods: getPeriodsByType(
              SIXMONTHLYAPR,
              filterFuturePeriods,
              periodSettings,
              config
          ),
          name: i18n.t('Six-monthly April'),
      },
      {
          id: YEARLY,
          getPeriods: getPeriodsByType(
              YEARLY,
              filterFuturePeriods,
              periodSettings,
              config
          ),
          name: i18n.t('Yearly'),
      },
      {
          id: FYNOV,
          getPeriods: getPeriodsByType(
              FYNOV,
              filterFuturePeriods,
              periodSettings,
              config
          ),
          name: i18n.t('Financial year (Start November)'),
      },
      {
          id: FYOCT,
          getPeriods: getPeriodsByType(
              FYOCT,
              filterFuturePeriods,
              periodSettings,
              config
          ),
          name: i18n.t('Financial year (Start October)'),
      },
      {
          id: FYJUL,
          getPeriods: getPeriodsByType(
              FYJUL,
              filterFuturePeriods,
              periodSettings,
              config
          ),
          name: i18n.t('Financial year (Start July)'),
      },
      {
          id: FYAPR,
          getPeriods: getPeriodsByType(
              FYAPR,
              filterFuturePeriods,
              periodSettings,
              config
          ),
          name: i18n.t('Financial year (Start April)'),
      },
  ]
}
export const getFixedPeriodsOptionsById = (id, periodSettings={},config={}) => {
  return getOptions(periodSettings,config).find((option) => option.id === id)
}

//export const getFixedPeriodsOptions = () => getOptions()

export const getYearOffsetFromNow = (yearStr) =>
  parseInt(yearStr) - new Date(Date.now()).getFullYear()

export const parsePeriodCode = (code, allowedTypes) => {
  const periodTypes = Object.keys(PERIOD_TYPE_REGEX)
  let i = 0
  let type = undefined
  let match = undefined

  while (i < periodTypes.length && !match) {
      type = periodTypes[i]
      match = code?.match(PERIOD_TYPE_REGEX[type])
      i++
  }

  if (
      !match || (Array.isArray(allowedTypes) && !allowedTypes.some((t) => t === type))
  ) {
      return undefined
  }

  const period = getFixedPeriodsOptionsById(type)
  const offset = getYearOffsetFromNow(match[1])
  const options = period.getPeriods({ offset })

  return {
      id: period.id,
      name: period.name,
      year: match[1],
      options,
  }
}
