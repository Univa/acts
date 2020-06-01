import React from 'react'
import './styles.scss'
import { SettingsContext } from '../../../../settings-context'

export default class Toggle extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            display: ""
        }
        this.currentValue = ""
    }

    findSetting(settings) {
        var setting = settings
        for (var loc of this.props.setting.split("-")) {
            try {
                setting = setting[loc]
            } catch(err) {
                return undefined
            }
        }
        return setting
    }

    handleClick(event) {
        this.currentValue = !this.currentValue
        var display = "Off"
        if (this.currentValue) {
            display = "On"
        }
        this.setState({
            display: display
        })
        this.props.updateSettings(this.props.setting, this.currentValue, {context_callback: this.updateInternalValue.bind(this)})
    }

    updateInternalValue(value) {
        this.currentValue = value
    }

    loadFromSettings(settings) {
        var value = this.findSetting(settings)
        var display

        if (value) {
            display = "On"
        } else {
            display = "Off"
        }
        this.setState({
            display: display
        })
    }

    render() {
        return (
            <SettingsContext.Consumer>
                {(settings) => {
                    if (this.currentValue !== this.findSetting(settings)) {
                        this.loadFromSettings(settings)
                        this.updateInternalValue(this.findSetting(settings))
                    }
                    return (
                        <input style={{fontFamily: settings.theme.font.settings, color: settings.theme.color.notTyped}} className="Toggle" type="button" value={ this.state.display } onClick={ this.handleClick.bind(this) } size="1" />
                    )
                }}
            </SettingsContext.Consumer>
        )
    }
}