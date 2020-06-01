import React from 'react'
import './styles.scss'
import { SettingsContext } from '../../../../settings-context'

export default class Button extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false
        }
    }

    handleClick(e) {
        this.props.updateSettings(this.props.setting, this.props.value)
    }

    render() {
        return (
            <SettingsContext.Consumer>
                {(settings) => {
                    if (!this.state.isLoaded) {
                        this.setState({
                            isLoaded: true
                        })
                    }
                    return (
                        <button className="Button" style={{fontFamily: settings.theme.font.settings, color: settings.theme.color.notTyped}} onClick={ this.handleClick.bind(this) }>{ this.props.display }</button>
                    )
                }}
            </SettingsContext.Consumer>
        )
    }
}

Button.defaultProps = {
    setting: "",
    value: "",
    display: "Button"
}
