import React from 'react'
import './styles.scss'
import { SettingsContext } from '../../../../settings-context'

export default class Toggle extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false,
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
        this.value = !this.value
        console.log(this.value)
        var display = "Off"
        if (this.value) {
            display = "On"
        }
        this.setState({
            display: display
        })
        this.props.updateSettings(this.props.setting, this.value, {context_callback: this.updateInternalValue.bind(this)})
    }

    updateInternalValue(value) {
        this.currentValue = value
    }

    loadFromSettings(settings) {
        this.value = this.findSetting(settings)
        var display

        if (this.value) {
            display = "On"
        } else {
            this.value = false
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

                    if (!this.state.isLoaded) {
                        this.setState({
                            isLoaded: true,
                        })
                    }
                    return (
                        <input style={{fontFamily: settings.theme.font.settings, color: settings.theme.color.notTyped}} className="Toggle" type="button" value={ this.state.display } onClick={ this.handleClick.bind(this) } size="1" />
                    )
                }}
            </SettingsContext.Consumer>
        )
    }
}