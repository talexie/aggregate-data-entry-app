import { usePeriod, usePeriodId } from '../../shared/index.js'

export default function useSelectorBarItemValue(selected) {
    const [periodId] = usePeriodId()
    const selectedPeriod = usePeriod(periodId)
   // return selectedPeriod?.displayName
   return selected?.name || selected?.displayName;
}
