import React from 'react'
import { SettingsContext } from '../../../../settings-context'

export default class Word extends React.Component {
    render() {
        return (
            <SettingsContext.Consumer>
                {({theme}) => {
                    var bgColor = "transparent"
                    if (this.props.highlighted) { bgColor = theme.color.wordHighlight }
                    return (
                        <span className="Word" style={{backgroundColor: bgColor}}>{ this.props.children }</span>
                    )
                }}
            </SettingsContext.Consumer>
        )
    }
}