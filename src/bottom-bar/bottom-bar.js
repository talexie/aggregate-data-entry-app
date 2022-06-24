import React from 'react'
import { useCurrentItemContext } from '../shared/index.js'
import styles from './bottom-bar.module.css'
import DataItemBar from './data-item-bar.js'
import MainToolBar from './main-tool-bar.js'

export default function BottomBar() {
    const { item } = useCurrentItemContext()
    const showDataItemBar = !!item

    return (
        <div className={styles.bottomBar}>
            {showDataItemBar && <DataItemBar />}
            <MainToolBar />
        </div>
    )
}
