import React from 'react'

export default class Line extends React.Component {
    render() {
        !this.props.active ? this.classSuffix = " inactive" : this.classSuffix = ""
        return (
            <p className={ "Line" + this.classSuffix }>{ this.props.children }</p>
        )
    }
}