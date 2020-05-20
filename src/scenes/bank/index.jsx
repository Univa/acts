import React from  'react'
import { withCookies } from 'react-cookie'
import './styles.scss'
import { SettingsContext } from '../../settings-context'
import { NavButton } from '../../components'

class Bank extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ""
        }
    }

    componentWillUnmount() {

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

    findSetting(settings, path) {
        var setting = settings
        for (var loc of path) {
            setting = setting[loc]
        }
        return setting
    }

    changeSetting(settings, path, value) {
        var setting = settings
        for (var loc of path.slice(0, path.length - 1)) {
            setting = setting[loc]
        }
        setting[path[path.length - 1]] = value
    }

    setCookie(path, value) {
        var key = path[0]
        for (var loc of path.slice(1, path.length)) {
            key += "-" + loc
        }
        this.props.cookies.set(key, value, { path: "/acts" })
    }

    handleChange(settings, setting_path, event) {
        var value = event.target.value.trimStart()
        if (value !== ""){
            this.changeSetting(settings, setting_path, value.split(" "))
            this.setCookie(setting_path, value)
            this.props.updateSettings(settings)
        }
    }

    render() {
        return (
            <SettingsContext.Consumer>
                {(settings) => {
                    let value = this.findSetting(settings, ["customBank"])
                    if (value === undefined) {
                        value = ""
                    } else {
                        value = value.join(" ")
                    }
                    return (
                        <div className="Bank">
                            <p style={{color:settings.theme.color.notTyped}}>Custom Word Bank</p>
                            <p style={{color:settings.theme.color.notTyped}}>Enter a list of words separated by spaces</p>
                            <textarea className="word-bank" style={{color:settings.theme.color.notTyped}} maxLength="1000" value={ value } onChange={ (e) => this.handleChange.bind(this)(this.deepCopyObject(settings), ["customBank"], e) }></textarea>
                            <div>
                                <NavButton dest="/settings" message="Edit Settings" />
                                <NavButton dest="/type" message="Go Back to Typing" />
                            </div>
                        </div>
                    )
                }}
            </SettingsContext.Consumer>
        )
    }
}

export default withCookies(Bank)
