import React from 'react'
import './styles.scss'

export class Display extends React.Component {
    render() {
        return (
            <p class="Display">{ this.props.value }</p>
        )
    }
}