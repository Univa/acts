import React from 'react'
import {
    Settings,
    Type
} from './scenes';
import { ThemeContext } from './theme-context.jsx'
import {
    BrowserRouter as Router,
    Switch,
    Link,
    Route
} from 'react-router-dom';

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            theme: {
                color: {
                    notTyped: "white",
                    correct: "green",
                    incorrect: "red",
                    bg: "#323232"
                }
            }
        }
    }

    render() {
        return (
            <ThemeContext.Provider value={ this.state.theme }>
                <Router>
                    <Type />
                </Router>
            </ThemeContext.Provider>
        )
    }
}