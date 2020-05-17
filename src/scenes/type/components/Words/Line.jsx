import React from 'react'
import { SettingsContext } from '../../../../settings-context'

export default class Line extends React.Component {
    render() {
        !this.props.active ? this.classSuffix = " inactive" : this.classSuffix = ""
        return (
            <SettingsContext.Consumer>
                {({theme}) => {
                    var bgColor = "transparent"
                    if (this.props.highlighted) { bgColor = theme.color.lineHighlight}
                    return (
                        <p className={ "Line" + this.classSuffix } style={{backgroundColor: bgColor}}>{ this.props.children }</p>
                    )
                }}
            </SettingsContext.Consumer>
        )
    }
}