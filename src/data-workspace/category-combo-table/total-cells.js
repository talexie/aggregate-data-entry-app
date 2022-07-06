import i18n from '@dhis2/d2-i18n'
import { TableCell, TableCellHead, TableRow } from '@dhis2/ui'
import propTypes from 'prop-types'
import React, { useMemo } from 'react'
import { calculateColumnTotals, calculateRowTotal } from './calculate-totals.js'
import styles from './category-combo-table.module.css'
import { useValueMatrix } from './use-value-matrix.js'

export const TotalCell = ({ children }) => (
    <TableCell className={styles.totalCell}>{children}</TableCell>
)

TotalCell.propTypes = {
    children: propTypes.node,
}

export const TotalHeader = ({ rowSpan }) => (
    <TableCellHead className={styles.totalHeader} rowSpan={rowSpan}>
        {i18n.t('Totals')}
    </TableCellHead>
)

TotalHeader.propTypes = {
    rowSpan: propTypes.number,
}

export const RowTotal = ({ dataElements, categoryOptionCombos, row }) => {
    const matrix = useValueMatrix(dataElements, categoryOptionCombos)
    const rowTotal = useMemo(
        () => calculateRowTotal(matrix, row),
        [matrix, row]
    )

    return <TotalCell>{rowTotal}</TotalCell>
}

RowTotal.propTypes = {
    categoryOptionCombos: propTypes.array,
    dataElements: propTypes.array,
    row: propTypes.number,
}

export const ColumnTotals = ({
    renderTotalSum,
    paddingCells,
    dataElements,
    categoryOptionCombos,
}) => {
    const matrix = useValueMatrix(dataElements, categoryOptionCombos)
    const columnTotals = useMemo(() => calculateColumnTotals(matrix), [matrix])

    return (
        <TableRow>
            <TableCellHead className={styles.totalHeader}>
                {i18n.t('Totals')}
            </TableCellHead>
            {columnTotals.map((v, i) => (
                <TotalCell key={i}>{v}</TotalCell>
            ))}
            {paddingCells.map((_, i) => (
                <TotalCell key={i} />
            ))}
            {renderTotalSum && (
                <TotalCell>
                    {columnTotals.reduce((acc, curr) => acc + curr, 0)}
                </TotalCell>
            )}
        </TableRow>
    )
}

ColumnTotals.propTypes = {
    categoryOptionCombos: propTypes.array,
    dataElements: propTypes.array,
    paddingCells: propTypes.array,
    renderTotalSum: propTypes.bool,
}
