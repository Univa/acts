import React from 'react'
import { SettingsContext } from '../../../../settings-context';

export default class Char extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // nothing here yet
        }
    }

    render() {
        return (
            <SettingsContext.Consumer>
                {({theme}) => 
                    {
                        let color = "white"
                        if (this.props.type === "correct") { color = theme.color.correct }
                        else if (this.props.type === "incorrect") { color = theme.color.incorrect }
                        else if (this.props.type === "notTyped") { color = theme.color.notTyped }

                        return <span class={ this.props.type } style={{color: color}}>{ this.props.character }</span>
                    }
                }
            </SettingsContext.Consumer>
        )
    }
}