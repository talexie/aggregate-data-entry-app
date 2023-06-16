export const periodIdentifiers = [
    'DAILY',
    'WEEKLY',
    'WEEKLYWED',
    'WEEKLYTHU',
    'WEEKLYSAT',
    'WEEKLYSUN',
    'BIWEEKLY',
    'MONTHLY',
    'BIMONTHLY',
    'QUARTERLY',
    'QUARTERLYNOV', // used in Ethiopia
    'SIXMONTHLY',
    'SIXMONTHLYAPR',
    'SIXMONTHLYNOV', // used in Ethiopia
    'YEARLY',
    'FYNOV',
    'FYOCT',
    'FYJUL',
    'FYAPR',
]
const periodTypes = Object.fromEntries(
    periodIdentifiers.map((periodType) => [periodType, periodType])
)

export default periodTypes
