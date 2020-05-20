import React from 'react'
import { withCookies, Cookies } from 'react-cookie'
import { instanceOf } from 'prop-types'
import {
    Bank,
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
        let startTime = parseInt(props.cookies.get("startTime") || 60, 10)
        if (isNaN(startTime) || startTime <= 0) {
            startTime = 60
        }

        let linesAhead = parseInt(props.cookies.get("linesAhead") || 1, 10)
        if (isNaN(linesAhead) || linesAhead < 0) {
            linesAhead = 1
        }

        let linesBehind = parseInt(props.cookies.get("linesBehind") || 1, 10)
        if (isNaN(linesBehind) || linesBehind < 0) {
            linesAhead = 1
        }

        let customBank = props.cookies.get("customBank")
        if (customBank === undefined) {
            customBank = ["sample", "words", "wow"]
        } else {
            customBank = customBank.split(" ")
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
                startTime: startTime,
                linesAhead: linesAhead,
                linesBehind: linesBehind,
                wordBank: props.cookies.get("wordBank") || "Default",
                customBank: customBank
            }
        }

        this.updateSettingsContext = (setting, value) => {
            var new_data = this.deepCopyObject(this.state.settings)
            var cookie_value;
            
            if (setting === "linesAhead" || setting === "linesBehind") {
                value = parseInt(value, 10)
                if (value < 0) {
                    value = 0
                } else if (value > 5) {
                    value = 5
                } else if (isNaN(value)) {
                    value = 1
                }
            } else if (setting === "startTime") {
                value = parseInt(value, 10)
                if (value < 0) {
                    value = 0
                } else if (isNaN(value)) {
                    value = 60
                }
            } else if (setting === "customBank") {
                if (value.join(" ") === "") {
                    value = ["sample", "words", "wow"]
                } else {
                    value = value.filter(word => word !== "")
                }
            }

            if (setting === "customBank") {
                cookie_value = value.join(" ")
            } else {
                cookie_value = value
            }

            this.changeSetting(new_data, setting, value)
            this.setCookie(setting, cookie_value)

            this.setState(prevState => ({
                settings: {
                    ...prevState.settings,
                    ...new_data
                }
            }))
        }
    }

    deepCopyObject(object) {
        if (typeof object !== "object") {
            return object
        }

        var newObj = Array.isArray(object) ? [] : {}

        for (var key in object) {
            newObj[key] = this.deepCopyObject(object[key])
        }

        return newObj
    }

    changeSetting(settings, setting_name, value) {
        var path = setting_name.split("-")
        var setting = settings
        for (var loc of path.slice(0, path.length - 1)) {
            setting = setting[loc]
        }
        setting[path[path.length - 1]] = value
    }

    setCookie(key, value) {
        this.props.cookies.set(key, value, { path: "/acts" })
    }

    render() {
        document.body.style.background = this.state.settings.theme.color.bg
        return (
            <SettingsContext.Provider value={ this.state.settings }>
                <Router basename="/">
                    <Commands updateSettings={ this.updateSettingsContext }/>
                    <Switch>
                        <Route path="/bank">
                            <Bank updateSettings={ this.updateSettingsContext }/>
                        </Route>
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
