import React from 'react'
import { SettingsContext } from '../../../../settings-context'

export default class Word extends React.Component {
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
                {({theme}) => {
                    var bgColor = "transparent"
                    if (this.props.highlighted || (this.state.hovered && this.props.highlightOnHover)) { bgColor = theme.color.wordHighlight }
                    return (
                        <span className="Word" style={{backgroundColor: bgColor}} onMouseEnter={ this.onMouseEnter.bind(this) } onMouseLeave={ this.onMouseLeave.bind(this) }>{ this.props.children }</span>
                    )
                }}
            </SettingsContext.Consumer>
        )
    }
}