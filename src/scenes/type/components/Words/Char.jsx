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
                {(settings) => 
                    {
                        let color = "white"
                        if (this.props.type === "correct") { color = settings.theme.color.correct }
                        else if (this.props.type === "incorrect") { color = settings.theme.color.incorrect }
                        else if (this.props.type === "notTyped") { color = settings.theme.color.notTyped }

                        let bgColor = "transparent"
                        if (this.props.highlighted || (this.state.hovered && this.props.highlightOnHover)) { bgColor = settings.theme.color.charHighlight }

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
                                display: "inline-flex",
                                animation: anim
                            }
                        }

                        let content
                        if (this.props.character === " ") {
                            content = [<span key="char" className={ "Char " + this.props.type } style={style}>&nbsp;</span>]
                        } else {
                            content = [<span key="char" className={ "Char " + this.props.type } style={style}>{ this.props.character }</span>]
                        }

                        if (this.props.highlighted || (this.state.hovered && this.props.highlightOnHover)) {
                            let caret = <span key="caret" style={{backgroundColor: settings.theme.color.caret, width: "2px", position: "absolute"}}>&nbsp;</span>
                            if (this.props.type === "incorrect") {
                                content.push(caret)
                            } else {
                                content.unshift(caret)
                            }
                        }
                        return <span onMouseEnter={ this.onMouseEnter.bind(this) } onMouseLeave={ this.onMouseLeave.bind(this) }>{ content }</span>
                    }
                }
            </SettingsContext.Consumer>
        )
    }
}