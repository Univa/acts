import React from 'react'
import { withRouter } from 'react-router-dom'
import { SettingsContext } from '../../settings-context'
import './styles.scss'

class NavButton extends React.Component {
    render() {
        return (
            <SettingsContext.Consumer>
                {({theme}) => (
                    <button className="NavButton" style={{color: theme.color.notTyped}} onClick={ (e) => this.props.history.push(this.props.dest) }>{ this.props.message }</button>
                )}
            </SettingsContext.Consumer>
        )
    }
}

export default withRouter(NavButton)
