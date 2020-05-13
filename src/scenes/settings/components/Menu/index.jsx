import React from 'react'
import { withCookies, Cookies } from 'react-cookie'
import { instanceOf } from 'prop-types'
import './styles.scss'
import { SettingsContext } from '../../../../settings-context'

class Menu extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            value: ""
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

    handleChange(settings, path, e) {
        this.changeSetting(settings, path, e.target.value)
        this.setCookie(path, e.target.value)
        this.props.updateSettings(settings)
    }

    render() {
        return (
            <SettingsContext.Consumer>
                {(settings) => {
                    var options = []
                    var current = this.findSetting(settings, this.props.settingPath)
                    for (var item of this.props.options) {
                        options.push(<option
                                style={{color: settings.theme.color.notTyped}}
                                className="menu-option"
                                key={ item }
                                value={ item }
                                onClick={
                                    (event) => this.handleChange.bind(this)(this.deepCopyObject(settings), this.props.settingPath, event)
                                }
                            >{ item }</option>)
                    }
                    return (
                        <div className="Menu">
                            <input disabled style={{color: settings.theme.color.notTyped}} className="menu-button" type="text" value={ current } />
                            <div className="menu-options">
                                { options }
                            </div>
                        </div>
                    )
                }}
            </SettingsContext.Consumer>
        )
    }
}

export default withCookies(Menu)