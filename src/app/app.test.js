import React from 'react'
import { render } from '../test-utils/index.js'
import App from './app.js'

describe('<App />', () => {
    it('renders without crashing', () => {
        render(<App />)
    })
})
