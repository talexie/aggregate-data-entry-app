import { usePeriod, usePeriodId } from '../../shared/index.js'

export default function useSelectorBarItemValue(periods) {
    const [periodId] = usePeriodId()
    const selectedPeriod = usePeriod(periodId,periods)
    return selectedPeriod?.displayName || selectedPeriod?.name;
}
