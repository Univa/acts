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
        this.props.updateSettings(this.props.setting, this.value)
    }

    render() {
        return (
            <SettingsContext.Consumer>
                {(settings) => {
                    if (!this.state.isLoaded) {
                        this.value = this.findSetting(settings)
                        var display

                        if (this.value) {
                            display = "On"
                        } else {
                            this.value = false
                            display = "Off"
                        }

                        this.setState({
                            isLoaded: true,
                            display: display
                        })
                    }
                    return (
                        <input style={{color: settings.theme.color.notTyped}} className="Toggle" type="button" value={ this.state.display } onClick={ this.handleClick.bind(this) } size="1" />
                    )
                }}
            </SettingsContext.Consumer>
        )
    }
}