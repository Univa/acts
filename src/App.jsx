import React from 'react'
import {
    Settings,
    Type
} from './scenes';
import { SettingsContext } from './settings-context.jsx'
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
            settings: {
                theme: {
                    color: {
                        notTyped: "white",
                        correct: "green",
                        incorrect: "red",
                        bg: "#323232"
                    }
                },
            }
        }
    }

    render() {
        return (
            <SettingsContext.Provider value={ this.state.settings }>
                <Router>
                    <Type />
                </Router>
            </SettingsContext.Provider>
        )
    }
}