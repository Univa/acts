import React from 'react'
import { SettingsContext } from '../../../../settings-context.jsx'
import './styles.scss'

export default class Input extends React.Component {
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

    handleChange(event) {
        var value = event.target.value
        if (this.props.type === "number") {
            if (!isNaN(value) && value !== "") {
                value = parseInt(event.target.value, 10)
                if (value < this.props.lower) {
                    value = this.props.lower;
                } else if (value > this.props.upper) {
                    value = this.props.upper
                }
            } else {
                value = " "
            }
        }

        this.setState({
            display: value
        })
        this.props.updateSettings(this.props.setting, value, {context_callback: this.updateInternalValue.bind(this)})
    }

    updateInternalValue(value) {
        this.currentValue = value
    }

    loadFromSettings(settings) {
        this.setState({
            display: this.findSetting(settings)
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
                        <input
                            className="Input"
                            type={ this.props.type }
                            style={{fontFamily: settings.theme.font.settings, color: settings.theme.color.notTyped}}
                            value={ this.state.display }
                            onChange={ this.handleChange.bind(this) }
                            size="1"
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
