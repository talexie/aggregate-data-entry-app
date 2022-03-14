import { Checkbox } from '@dhis2/ui'
import React, { useState } from 'react'
import { useField } from 'react-final-form'
import { useDataValueMutation } from '../data-entry-cell/use-data-value-mutation.js'
import styles from './inputs.module.css'
import { convertCallbackSignatures, InputPropTypes } from './utils.js'

export const TrueOnlyCheckbox = ({
    fieldname,
    dataValueParams,
    setSyncStatus,
}) => {
    const { input, meta } = useField(fieldname, {
        type: 'checkbox',
        subscription: { value: true, dirty: true, valid: true },
    })

    const [lastSyncedValue, setLastSyncedValue] = useState()
    const { mutate } = useDataValueMutation()
    const syncData = (value) => {
        // todo: Here's where an error state could be set: ('onError')
        mutate(
            // Empty values need an empty string
            { ...dataValueParams, value: value || '' },
            {
                onSuccess: () => {
                    setLastSyncedValue(value)
                    setSyncStatus({ syncing: false, synced: true })
                },
            }
        )
    }

    // todo: checking then unchecking the box will send a single unnecessary POST
    const handleBlur = () => {
        // For 'True only', can only send 'true' (or '1') or ''
        const value = input.checked ? 'true' : ''
        const { dirty, valid } = meta
        if (dirty && valid && value !== lastSyncedValue) {
            syncData(value)
        }
    }

    return (
        <div className={styles.checkboxWrapper}>
            <Checkbox
                dense
                {...convertCallbackSignatures(input)}
                onBlur={(e) => {
                    handleBlur()
                    input.onBlur(e)
                }}
            />
        </div>
    )
}
TrueOnlyCheckbox.propTypes = InputPropTypes
