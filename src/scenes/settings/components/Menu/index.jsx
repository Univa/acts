import React from 'react'
import './styles.scss'
import { SettingsContext } from '../../../../settings-context'

export default class Menu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false,
            options: [],
            value: ""
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
        this.setState({
            value: event.target.value
        })
        this.props.updateSettings(this.props.setting, event.target.value, {context_callback: this.updateInternalValue.bind(this)})
    }

    updateInternalValue(value) {
        this.currentValue = value
    }

    loadFromSettings(settings) {
        var value = this.props.options[0]
        for (var item of this.props.options) {
            if (item.toLowerCase() === this.findSetting(settings)) {
                value = item
                break
            }
        }
        this.setState({
            value: value
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
                        var options = []
                        for (var item of this.props.options) {
                            options.push(<option
                                    style={{color: settings.theme.color.notTyped}}
                                    className="menu-option"
                                    key={ item }
                                    value={ item }
                                    onClick={ this.handleChange.bind(this) }
                                >{ item }</option>)
                        }
                        this.setState({
                            isLoaded: true,
                            options: options
                        })
                    }
                    return (
                        <div className="Menu" style={{fontFamily: settings.theme.font.settings}}>
                            <input disabled style={{fontFamily: settings.theme.font.settings, color: settings.theme.color.notTyped}} className="menu-button" type="text" value={ this.state.value } size="1" />
                            <div className="menu-options">
                                { this.state.options }
                            </div>
                        </div>
                    )
                }}
            </SettingsContext.Consumer>
        )
    }
}
