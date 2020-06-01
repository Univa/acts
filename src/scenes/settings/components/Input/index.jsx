import React from 'react'
import { SettingsContext } from '../../../../settings-context.jsx'
import './styles.scss'

export default class Input extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false,
            value: ""
        }
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
            value: value
        })
        this.props.updateSettings(this.props.setting, value)
    }

    render() {
        return (
            <SettingsContext.Consumer>
                {(settings) => {
                    if (!this.state.isLoaded) {
                        this.setState({
                            isLoaded: true,
                            value: this.findSetting(settings, this.props.settingPath)
                        })
                    }
                    return (
                        <input
                            className="Input"
                            type={ this.props.type }
                            style={{fontFamily: settings.theme.font.settings, color: settings.theme.color.notTyped}}
                            value={ this.state.value }
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
