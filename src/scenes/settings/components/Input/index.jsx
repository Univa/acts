import React from 'react'
import { withCookies, Cookies } from 'react-cookie'
import { instanceOf } from 'prop-types'
import { SettingsContext } from '../../../../settings-context.jsx'
import './styles.scss'

class Input extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
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

    handleChange(settings, path, event) {
        var value = event.target.value
        if (this.props.type === "number") {
            value = parseInt(event.target.value, 10)
            if (isNaN(value) || value < this.props.lower) {
                value = this.props.lower;
            } else if (value > this.props.upper) {
                value = this.props.upper
            }
        }
        this.changeSetting(settings, path, value)
        this.setCookie(path, value)
        this.props.updateSettings(settings)
    }

    render() {
        return (
            <SettingsContext.Consumer>
                {(settings) => {
                    return (
                        <input
                            className="Input"
                            type={ this.props.type }
                            style={{color: settings.theme.color.notTyped}}
                            value={ this.findSetting(settings, this.props.settingPath) }
                            onChange={ (event) => this.handleChange.bind(this)(this.deepCopyObject(settings), this.props.settingPath, event) }
                        />
                    )}
                }
            </SettingsContext.Consumer>
        )
    }
}

Input.defaultProps = {
    lower: 0,
    upper: undefined 
}

export default withCookies(Input)
