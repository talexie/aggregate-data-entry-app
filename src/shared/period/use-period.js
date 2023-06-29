import { useMemo} from 'react';
export default function usePeriod(periodId,periods) {
    // @TODO(calendar)
    return useMemo(() => {
        if (!periodId) {
            return null
        }

        try {
            const pe = (periods || [])?.find((period)=>period?.id === periodId);
            if(pe){
                return {
                    ...pe,
                    year: parseInt(pe?.endDate?.substring(0,4),10),
                    displayName: pe?.name
                }
            }
            return pe;
        } catch (e) {
            console.error(e)
            return null
        }
    }, [periodId])
}



