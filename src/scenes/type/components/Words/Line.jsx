import React from 'react'
import { SettingsContext } from '../../../../settings-context'

export default class Line extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hovered: false
        }
        this.ref = React.createRef()
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

    componentDidMount() {
        this.setState({
            isLoaded: true
        })
    }

    render() {
        !this.props.active ? this.classSuffix = " inactive" : this.classSuffix = ""
        return (
            <SettingsContext.Consumer>
                {({theme}) => {
                    if (this.state.isLoaded) {
                        this.props.refSet(this.ref, parseInt(this.props.alt_key.split("-")[1], 10))
                    }
                    var bgColor = "transparent"
                    if (this.props.highlighted || (this.state.hovered && this.props.highlightOnHover)) { bgColor = theme.color.lineHighlight}
                    return (
                        <p className={ "Line" + this.classSuffix } ref={ this.ref } style={{backgroundColor: bgColor}} onMouseEnter={ this.onMouseEnter.bind(this) } onMouseLeave={ this.onMouseLeave.bind(this) }>{ this.props.children }</p>
                    )
                }}
            </SettingsContext.Consumer>
        )
    }
}