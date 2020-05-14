import React from 'react'

export default class Word extends React.Component {
    render() {
        return (
            <span className="Word">{ this.props.children } </span>
        )
    }
}