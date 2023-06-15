import { useMemo} from 'react';

export default function usePeriod(periodId,calendar) {
    // @TODO(calendar)
    return useMemo(() => {
        if (!periodId) {
            return null
        }

        try {
            return periodId;
        } catch (e) {
            console.error(e)
            return null
        }
    }, [periodId])
}
