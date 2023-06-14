import { usePeriod, usePeriodId } from '../../shared/index.js'

export default function useSelectorBarItemValue(calendar) {
    const [periodId] = usePeriodId()
    const selectedPeriod = usePeriod(periodId,calendar)
    return selectedPeriod?.displayName
}
