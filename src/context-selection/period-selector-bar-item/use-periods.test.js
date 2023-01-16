import { renderHook } from '@testing-library/react-hooks'
import { periodTypes } from '../../shared/index.js'
import usePeriods from './use-periods.js'

jest.mock('../../shared/date/use-server-time-offset.js', () => ({
    __esModule: true,
    default: jest.fn(() => 0),
}))

describe('usePeriods', () => {
    const actualSystemTime = new Date()
    jest.useFakeTimers()

    afterEach(() => {
        jest.setSystemTime(actualSystemTime)
    })

    it('should return 54 financial year periods for FINANCIAL_APRIL on 2023-03-01', () => {
        jest.setSystemTime(new Date('2023-03-01'))

        const { result } = renderHook(() =>
            usePeriods({
                periodType: periodTypes.FYAPR,
                openFuturePeriods: 2,
                year: 2023,
                dateLimit: new Date('2024-04-01'),
            })
        )

        expect(result.current).toHaveLength(54)
    })

    it('should return 55 financial year periods for FINANCIAL_APRIL on 2023-04-01', () => {
        jest.setSystemTime(new Date('2023-04-01'))

        const { result } = renderHook(() =>
            usePeriods({
                periodType: periodTypes.FYAPR,
                openFuturePeriods: 2,
                year: 2023,
                dateLimit: new Date('2026-04-01'),
            })
        )

        expect(result.current).toHaveLength(55)
    })

    it('should return the first two weeks of 2023', () => {
        jest.setSystemTime(new Date('2023-01-19')) // Thursday

        const { result } = renderHook(() =>
            usePeriods({
                periodType: periodTypes.WEEKLYWED,
                openFuturePeriods: 0,
                year: 2023,
                dateLimit: new Date('2023-01-18'),
            })
        )

        expect(result.current).toHaveLength(2)
    })

    it('should return the last week of 2021 and all weeks of 2022 but the last one', () => {
        jest.setSystemTime(new Date('2023-01-19')) // Thursday

        const { result } = renderHook(() =>
            usePeriods({
                periodType: periodTypes.WEEKLYWED,
                openFuturePeriods: 0,
                year: 2022,
                dateLimit: new Date('2023-01-18'),
            })
        )

        expect(result.current.length).toBe(53)
    })
})
