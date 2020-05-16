import React from 'react'
import { SettingsContext } from '../../../../settings-context';

export default class Char extends React.Component {
    render() {
        return (
            <SettingsContext.Consumer>
                {({theme}) => 
                    {
                        let color = "white"
                        if (this.props.type === "correct") { color = theme.color.correct }
                        else if (this.props.type === "incorrect") { color = theme.color.incorrect }
                        else if (this.props.type === "notTyped") { color = theme.color.notTyped }

                        let bgColor = "transparent"
                        if (this.props.highlighted) { bgColor = theme.color.charHighlight }

                        if (this.props.character === " ") {
                            return <span className={ "Char " + this.props.type } style={{color: color, backgroundColor: bgColor}}>&nbsp;</span>
                        } else {
                            return <span className={ "Char " + this.props.type } style={{color: color, backgroundColor: bgColor}}>{ this.props.character }</span>
                        }
                    }
                }
            </SettingsContext.Consumer>
        )
    }
}