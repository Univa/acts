import React from 'react'
import Word from './Word.jsx'

export default class Line extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //nothing here yet
        }
    }

    genWords() {
        var words = []
        for (var word = 0; word < this.props.words.length; word++) {
            console.log(this.props.words[word])
            words.push(<Word word={ this.props.words[word] } />)
        }
        return words
    }

    render() {
        return (
            <p class="Line">{ this.props.children }</p>
        )
    }
}