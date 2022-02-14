import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { parsePeriodId } from '../../shared/index.js'
import { useDataSetId, usePeriodId } from '../use-context-selection/index.js'

const QUERY_CATEGORY_COMBINATION = {
    dataSet: {
        resource: 'dataSets',
        id: ({ id }) => id,
        params: {
            fields: 'categoryCombo[isDefault,displayName,categories[id,displayName,categoryOptions[id,displayName,startDate,endDate]]]',
        },
    },
}

const isOptionWithinPeriod = ({
    periodStartDate,
    periodEndDate,
    categoryOption,
}) => {
    // option has not start and end dates
    if (!categoryOption.startDate && !categoryOption.endDate) {
        return true
    }

    if (categoryOption.startDate) {
        const startDate = new Date(categoryOption.startDate)
        if (periodStartDate < startDate) {
            // option start date is after period start date
            return false
        }
    }

    if (categoryOption.endDate) {
        const endDate = new Date(categoryOption.endDate)
        if (periodEndDate > endDate) {
            // option end date is before period end date
            return false
        }
    }

    // option spans over entire period
    return true
}

export default function useCategoryCombination() {
    const [periodId] = usePeriodId()
    const [dataSetId] = useDataSetId()
    const queryKey = [QUERY_CATEGORY_COMBINATION, { id: dataSetId }]
    const {
        isIdle,
        isLoading: loading,
        error,
        data,
    } = useQuery(queryKey, {
        enabled: !!dataSetId,
    })

    const categoryCombo = useMemo(() => {
        if (!data || !periodId) {
            return data?.dataSet.categoryCombo
        }

        const period = parsePeriodId(periodId)
        const periodStartDate = new Date(period.startDate)
        const periodEndDate = new Date(period.endDate)

        const { categories } = data.dataSet.categoryCombo
        const categoriesWithFilteredOptions = categories.map((category) => ({
            ...category,
            categoryOptions: category.categoryOptions.filter((categoryOption) =>
                isOptionWithinPeriod({
                    periodStartDate,
                    periodEndDate,
                    categoryOption,
                })
            ),
        }))

        return {
            ...data.dataSet.categoryCombo,
            categories: categoriesWithFilteredOptions,
        }
    }, [data, periodId])

    return {
        called: !isIdle,
        loading,
        error,
        data: categoryCombo,
    }
}
