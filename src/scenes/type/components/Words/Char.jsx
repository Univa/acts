import React from 'react'
import { SettingsContext } from '../../../../settings-context';

export default class Char extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hovered: false
        }
    }

    onMouseEnter() {
        this.props.mouseEnterHandler(this.props.alt_key)
        this.setState({
            hovered: true
        })
    }

    onMouseLeave() {
        this.props.mouseLeaveHandler(this.props.alt_key)
        this.setState({
            hovered: false
        })
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

                        let bgColor = "transparent"
                        if (this.props.highlighted || (this.state.hovered && this.props.highlightOnHover)) { bgColor = theme.color.charHighlight }

                        let anim = "none"
                        if (this.props.character !== " " && this.props.type === "incorrect") {
                            anim = "grow-width 0.2s"
                        }

                        let style
                        if (this.props.type === "incorrect") {
                            style = {
                                color: color,
                                backgroundColor: bgColor,
                                display: "inline-flex",
                                maxWidth: "20px",
                                animation: anim
                            }
                        } else {
                            style = {
                                color: color,
                                backgroundColor: bgColor,
                                animation: anim
                            }
                        }

                        if (this.props.character === " ") {
                            return <span className={ "Char " + this.props.type } style={style} onMouseEnter={ this.onMouseEnter.bind(this) } onMouseLeave={ this.onMouseLeave.bind(this) }>&nbsp;</span>
                        } else {
                            return <span className={ "Char " + this.props.type } style={style} onMouseEnter={ this.onMouseEnter.bind(this) } onMouseLeave={ this.onMouseLeave.bind(this) }>{ this.props.character }</span>
                        }
                    }
                }
            </SettingsContext.Consumer>
        )
    }
}