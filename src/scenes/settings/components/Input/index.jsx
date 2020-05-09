import React from 'react'
import { SettingsContext } from '../../../../settings-context.jsx'
import './styles.scss'

export class Input extends React.Component {
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

    handleChange(settings, path, event) {
        var value = event.target.value
        if (this.props.type === "number") {
            value = parseInt(event.target.value, 10)
            if (isNaN(value) || value < 0) {
                value = 0;
            }
        }
        this.changeSetting(settings, path, value)
        this.props.updateSettings(settings)
    }

    render() {
        return (
            <SettingsContext.Consumer>
                {(settings) => {
                    return (
                        <input
                            type={ this.props.type }
                            style={{color: settings.theme.color.notTyped}}
                            value={ this.findSetting(settings, this.props.settingPath) }
                            onChange={ (event) => this.handleChange.bind(this)(settings, this.props.settingPath, event) }
                        />
                    )}
                }
            </SettingsContext.Consumer>
        )
    }
}