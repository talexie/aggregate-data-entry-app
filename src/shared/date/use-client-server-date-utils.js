import { useCallback, useMemo } from 'react'
import useServerTimeOffset from './use-server-time-offset.js';

export default function useClientServerDateUtils(calendar) {
    const serverTimeOffset = useServerTimeOffset(calendar);

    const fromServerDate = useCallback(
        (serverDate) => {
            const clientDate = new Date(serverDate.getTime() + serverTimeOffset);
            return { serverDate, clientDate }
        },
        [serverTimeOffset,calendar]
    )

    const fromClientDate = useCallback(
        (clientDate) => {
            const serverDate = new Date(clientDate.getTime() - serverTimeOffset);
            return { clientDate, serverDate }
        },
        [serverTimeOffset,calendar]
    )

    return useMemo(
        () => ({ fromServerDate, fromClientDate }),
        [fromServerDate, fromClientDate]
    )
}
