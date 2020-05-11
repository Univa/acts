import React from 'react'
import './styles.scss'
import { SettingsContext } from '../../../../settings-context'

export default class Display extends React.Component {
    render() {
        return (
            <SettingsContext.Consumer>
                {({theme}) => (
                    <p className="Display" style={{color: theme.color.counter}}>{ this.props.value }</p>
                )}
            </SettingsContext.Consumer>
        )
    }
}