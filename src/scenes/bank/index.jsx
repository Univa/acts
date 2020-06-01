import React from  'react'
import { withCookies } from 'react-cookie'
import './styles.scss'
import { SettingsContext } from '../../settings-context'
import { NavButton } from '../../components'

class Bank extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false,
            value: ""
        }
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        })
        
        this.props.updateSettings("customBank", event.target.value.trim().split(" "))
    }

    render() {
        return (
            <SettingsContext.Consumer>
                {(settings) => {
                    if (!this.state.isLoaded) {
                        let value = settings.customBank.join(" ")
                        this.setState({
                            isLoaded: true,
                            value: value
                        })
                    }
                    return (
                        <div className="Bank" style={{fontFamily: settings.theme.font.settings}}>
                            <p style={{color:settings.theme.color.notTyped}}>Custom Word Bank</p>
                            <p style={{color:settings.theme.color.notTyped}}>Enter a list of words separated by spaces</p>
                            <textarea className="word-bank" style={{fontFamily: settings.theme.font.settings, color:settings.theme.color.notTyped}} value={ this.state.value } maxLength="2000" onChange={ this.handleChange.bind(this) }></textarea>
                            <div>
                                <NavButton dest="/settings" message="Edit Settings" />
                                <NavButton dest="/type" message="Go Back to Typing" />
                            </div>
                        </div>
                    )
                }}
            </SettingsContext.Consumer>
        )
    }
}

export default withCookies(Bank)
