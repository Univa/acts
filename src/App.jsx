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
        let starttime = parseInt(props.cookies.get("starttime") || 60, 10)
        if (isNaN(starttime) || starttime <= 0) {
            starttime = 60
        }

        let linesAhead = parseInt(props.cookies.get("linesAhead") || 1, 10)
        if (isNaN(linesAhead) || linesAhead < 0) {
            linesAhead = 1
        }

        let linesBehind = parseInt(props.cookies.get("linesBehind") || 1, 10)
        if (isNaN(linesBehind) || linesBehind < 0) {
            linesAhead = 1
        }

        this.state = {
            settings: {
                theme: {
                    color: {
                        notTyped: props.cookies.get("theme-color-notTyped") || "white",
                        correct: props.cookies.get("theme-color-correct") || "green",
                        incorrect: props.cookies.get("theme-color-incorrect") || "red",
                        bg: props.cookies.get("theme-color-bg") || "#323232",
                        command: props.cookies.get("theme-color-command") || "yellow",
                        timer: props.cookies.get("theme-color-timer") || "white",
                        counter: props.cookies.get("theme-color-counter") || "white",
                        speed: props.cookies.get("theme-color-speed") || "white",
                        charHighlight: props.cookies.get("theme-color-charHighlight") || "rgba(0, 0, 0, 0.2)",
                        wordHighlight: props.cookies.get("theme-color-wordHighlight") || "rgba(0, 0, 0, 0.2)",
                        lineHighlight: props.cookies.get("theme-color-lineHighlight") || "rgba(0, 0, 0, 0.2)"
                    }
                },
                starttime: starttime,
                linesAhead: linesAhead,
                linesBehind: linesBehind,
                wordBank: props.cookies.get("wordBank") || "Default"
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
        document.body.style.background = this.state.settings.theme.color.bg
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
