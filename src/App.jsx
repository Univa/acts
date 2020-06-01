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
import * as themes from './themes'
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

        this.wordBanks = ["default", "custom", "10fastfingers", "typings.gg"]
        let wordBank = props.cookies.get("wordBank")
        if (!this.wordBanks.includes(wordBank)) {
            wordBank = "default"
        }

        let customBank = props.cookies.get("customBank")
        if (customBank === undefined || customBank === "") {
            customBank = ["sample", "words", "wow"]
        } else {
            customBank = customBank.split(" ")
        }

        let cmdPrefixes = props.cookies.get("cmdPrefixes")
        if (cmdPrefixes === undefined || cmdPrefixes === "") {
            cmdPrefixes = ["!", ":", "/"]
        } else {
            cmdPrefixes = cmdPrefixes.split(" ").map(x => x[0])
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
                        lineHighlight: props.cookies.get("theme-color-lineHighlight") || "rgba(0, 0, 0, 0.2)",
                        caret: props.cookies.get("theme-color-caret") || "white"
                    },
                    font: {
                        words: props.cookies.get("theme-font-words") || "Jost",
                        settings: props.cookies.get("theme-font-settings") || "Jost",
                        timer: props.cookies.get("theme-font-timer") || "Jost",
                        counter: props.cookies.get("theme-font-counter") || "Jost",
                        speed: props.cookies.get("theme-font-speed") || "Jost",
                        command: props.cookies.get("theme-font-command") || "Jost",
                        graph: props.cookies.get("theme-font-graph") || "Jost",
                    }
                },
                startTime: startTime,
                linesAhead: linesAhead,
                linesBehind: linesBehind,
                liveGraph: props.cookies.get("liveGraph") === "true",
                wordBank: wordBank,
                customBank: customBank,
                cmdPrefixes: cmdPrefixes
            }
        }

        this.updateSettingsContext = (setting, value, { msg_callback = (msg) => {}, context_callback = (result) => {} } = {}) => {
            var current_setting = this.findSetting(this.state.settings, setting)
            if (current_setting !== undefined && (typeof current_setting !== "object" || Array.isArray(current_setting))) {
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
                } else if (setting === "wordBank") {
                    value = String(value).toLowerCase();
                    if (!this.wordBanks.includes(value)) {
                        value = "default"
                    }
                } else if (setting === "cmdPrefixes") {
                    if (value.join(" ") === "") {
                        value = ["!", ":", "/"]
                    } else {
                        value = value.map(x => x[0])
                    }
                } else if (setting === "liveGraph") {
                    if (value === "true" || value === true || value === 1) {
                        value = true
                    } else {
                        value = false
                    }
                }

                if (setting === "customBank" || setting === "cmdPrefixes") {
                    cookie_value = value.join(" ")
                } else {
                    cookie_value = value
                }

                this.setState(prevState => {
                    let new_data = this.deepCopyObject(prevState.settings)
                    this.changeSetting(new_data, setting, value)
                    this.setCookie(setting, cookie_value)
                    return {
                        settings: {
                            ...prevState.settings,
                            ...new_data
                        }
                    }
                })

                msg_callback(setting + " was set to " + value)
                context_callback(value)
                return
            }

            if (setting === "theme" && typeof value !== "object") {
                var id = String(value).toLowerCase()
                var theme_info = themes["_" + id]
                if (theme_info === undefined) {
                    msg_callback(setting + " \"" + id + "\" is not a valid theme ID")
                    context_callback(undefined)
                    return
                }
                value = theme_info.data
                msg_callback(setting + " was set to \"" + theme_info.name + "\"")
            } else if (setting === "theme-font" && typeof value !== "object") {
                var font_name = String(value)
                value = this.deepCopyObject(this.state.settings.theme.font)
                for (var font in value) {
                    value[font] = font_name
                }
                msg_callback(setting + " was set to \"" + font_name + "\"")
            } else if (current_setting !== undefined) {
                if (typeof value !== "object" || Array.isArray(value)) {
                    msg_callback(setting + " can not be set")
                    context_callback(undefined)
                    return
                }
            } else {
                msg_callback(setting + " is not a setting")
                context_callback(undefined)
                return
            }

            for (var key in value) {
                this.updateSettingsContext(setting + "-" + key, value[key])
            }
            context_callback(value)
        }
    }

    findSetting(settings, path) {
        var setting = settings
        for (var loc of path.split("-")) {
            try {
                setting = setting[loc]
            } catch(err) {
                return undefined
            }
        }
        return setting
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
                    <Commands updateSettings={ this.updateSettingsContext } prefixes={ this.state.settings.cmdPrefixes }/>
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
