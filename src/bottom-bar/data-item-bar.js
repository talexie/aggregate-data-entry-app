import i18n from '@dhis2/d2-i18n'
import { Button, IconInfoFilled24} from '@dhis2/ui'
import React from 'react'
import { useRightHandPanelContext } from '../right-hand-panel/index.js'
import { dataDetailsSidebarId, useHighlightedField } from '../shared/index.js'
import styles from './data-item-bar.module.css'

export default function DataItemBar({ showLabel=true}) {
    const rightHandPanel = useRightHandPanelContext()
    const item = useHighlightedField()

    return (
        
        showLabel?(
            <div className={styles.container}>
                <span className={styles.name}>
                    {item.displayFormName}
                    {item.categoryOptionComboName &&
                        ` | ${item.categoryOptionComboName}`}
                </span>

                <Button
                    secondary
                    small
                    onClick={() => {
                        rightHandPanel.id === dataDetailsSidebarId
                            ? rightHandPanel.hide()
                            : rightHandPanel.show(dataDetailsSidebarId)
                    }}
                >
                    {rightHandPanel.id === dataDetailsSidebarId
                        ? i18n.t('Hide details')
                        : i18n.t('View details')}
                </Button>
            </div>
        ):
        (
            <div className={styles.noticeBox} onClick={() => {
                rightHandPanel.id === dataDetailsSidebarId
                    ? rightHandPanel.hide()
                    : rightHandPanel.show(dataDetailsSidebarId)
            }}>
                <IconInfoFilled24
                    className={styles.noticeBox}
                />
            </div>
            
        )
    )
}
