import { useCallback, useMemo } from 'react'
import useServerTimeOffset from './use-server-time-offset.js';
import moment from 'moment';

export default function useClientServerDateUtils(calendar) {
    const serverTimeOffset = useServerTimeOffset(calendar);

    const fromServerDate = useCallback(
        (serverDate) => {
            let clientDate = new Date(serverDate.getTime() + serverTimeOffset);
            if(calendar === 'ethiopic'){
                clientDate = new Date(moment(new Date(serverDate.getTime() + serverTimeOffset)?.toLocaleDateString('en-GB-u-ca-ethiopic').substring(0,10)));
            }
            return { serverDate, clientDate }
        },
        [serverTimeOffset]
    )

    const fromClientDate = useCallback(
        (clientDate) => {
            let serverDate = new Date(clientDate.getTime() - serverTimeOffset);
            if(calendar === 'ethiopic'){
                serverDate = new Date(moment(new Date(clientDate.getTime() - serverTimeOffset)?.toLocaleDateString('en-GB-u-ca-ethiopic').substring(0,10))); 
            }
            return { clientDate, serverDate }
        },
        [serverTimeOffset]
    )

    return useMemo(
        () => ({ fromServerDate, fromClientDate }),
        [fromServerDate, fromClientDate]
    )
}
