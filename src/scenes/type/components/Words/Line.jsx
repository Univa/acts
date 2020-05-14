import React from 'react'

export default class Line extends React.Component {
    render() {
        return (
            <p className="Line">{ this.props.children }</p>
        )
    }
}