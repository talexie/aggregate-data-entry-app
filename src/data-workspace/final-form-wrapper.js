import PropTypes from 'prop-types'
import React from 'react'
import { Form } from 'react-final-form'

function mapObject(input, callback) {
    return Object.fromEntries(Object.entries(input).map(callback))
}

function createInitialValues(dataValueSet) {
    return mapObject(dataValueSet, ([deId, dataElement]) => {
        return [
            deId,
            mapObject(dataElement, ([cocId, { value }]) => [cocId, value]),
        ]
    })
}

const onSubmit = (values, form) => console.log({ values, form })

const subscriptions = {}

export function FinalFormWrapper({ children, dataValueSet }) {
    const initialValues = createInitialValues(dataValueSet)

    return (
        <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            subscriptions={subscriptions}
            keepDirtyOnReinitialize
        >
            {() => children}
        </Form>
    )
}
FinalFormWrapper.propTypes = {
    children: PropTypes.node,
    dataValueSet: PropTypes.object,
}
