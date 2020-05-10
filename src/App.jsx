import React from 'react'
import { withCookies, Cookies } from 'react-cookie'
import { instanceOf } from 'prop-types'
import {
    Settings,
    Type
} from './scenes';
import { Commands } from './components'
import { SettingsContext } from './settings-context.jsx'
import {
    HashRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

class App extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            settings: {
                theme: {
                    color: {
                        notTyped: props.cookies.get("theme-color-notTyped") || "white",
                        correct: props.cookies.get("theme-color-correct") || "green",
                        incorrect: props.cookies.get("theme-color-incorrect") || "red",
                        bg: props.cookies.get("theme-color-bg") || "#323232",
                        command: props.cookies.get("theme-color-command")|| "yellow"
                    }
                },
                starttime: parseInt(props.cookies.get("starttime"), 10) || 60,
                linesAtATime: parseInt(props.cookies.get("linesAtATime"), 10) || 2
            }
        }

        this.updateSettingsContext = (new_data) => {
            this.setState(prevState => ({
                settings: {
                    ...prevState.settings,
                    ...new_data
                }
            }))
        }
    }

    render() {
        return (
            <SettingsContext.Provider value={ this.state.settings }>
                <Router basename="/">
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

export default withCookies(App);
