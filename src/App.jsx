import React from 'react'
import {
    Settings,
    Type
} from './scenes';
import { Commands } from './components'
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
                        bg: "#323232",
                        command: "yellow"
                    }
                },
            }
        }

        this.updateSettingsContext = (new_data) => {
            this.setState(prevState => ({
                settings: {
                    ...prevState.settings,
                    new_data
                }
            }))
        }
    }

    render() {
        return (
            <SettingsContext.Provider value={ this.state.settings }>
                <Router basename="/acts">
                    <Commands />
                    <Switch>
                        <Route path="/settings">
                            <Settings updateSettings={ this.updateSettingsContext }/>
                        </Route>
                        <Route path="/">
                            <Type />
                        </Route>
                    </Switch>
                </Router>
            </SettingsContext.Provider>
        )
    }
}