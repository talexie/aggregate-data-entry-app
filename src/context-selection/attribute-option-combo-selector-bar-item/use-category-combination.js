import { useQuery } from '@tanstack/react-query'
import {
    parsePeriodId,
    useConvertClientDateAtServerTimezone,
    useDataSetId,
    usePeriodId,
} from '../../shared/index.js'

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
    const convertClientDateAtServerTimezone =
        useConvertClientDateAtServerTimezone()
    const [periodId] = usePeriodId()
    const [dataSetId] = useDataSetId()
    const params = {
        fields: [
            'categoryCombo[isDefault,displayName,categories[id,displayName,categoryOptions[id,displayName,startDate,endDate]]]',
        ],
    }
    const queryKey = [
        'dataSets',
        {
            id: dataSetId,
            params,
        },
    ]
    const {
        isIdle,
        isLoading: loading,
        error,
        data,
    } = useQuery(queryKey, {
        enabled: !!dataSetId && !!periodId,
        select: (data) => {
            const period = parsePeriodId(periodId)
            // period dates are computed client side, category option stard and
            // end dates are in the server timezone
            const periodStartDate = convertClientDateAtServerTimezone(
                new Date(period.startDate)
            )
            const periodEndDate = convertClientDateAtServerTimezone(
                new Date(period.endDate)
            )

            const { categories } = data.categoryCombo
            const categoriesWithFilteredOptions = categories.map(
                (category) => ({
                    ...category,
                    categoryOptions: category.categoryOptions.filter(
                        (categoryOption) =>
                            isOptionWithinPeriod({
                                periodStartDate,
                                periodEndDate,
                                categoryOption,
                            })
                    ),
                })
            )

            return {
                ...data.categoryCombo,
                categories: categoriesWithFilteredOptions,
            }
        },
    })

    return {
        called: !isIdle,
        loading,
        error,
        data,
    }
}
