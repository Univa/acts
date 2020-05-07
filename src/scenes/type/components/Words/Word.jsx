import React from 'react'
import Char from './Char.jsx'

export default class Word extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // nothing here yet
        }
    }

    genCorrect() {
        var spans = [];
        console.log(this.props.word.correct)
        for (var char = 0; char < this.props.word.correct.length; char++) {
            spans.push(<Char character={ this.props.word.correct.charAt(char) } type="correct" />);
        }
        return spans
    }

    genWrong() {
        var spans = [];
        console.log(this.props.word.incorrect)
        for (var char = 0; char < this.props.word.incorrect.length; char++) {
            spans.push(<Char character={ this.props.word.incorrect.charAt(char) } type="incorrect" />);
        }
        return spans
    }

    genNotTyped() {
        var spans = [];
        console.log(this.props.word.notTyped)
        for (var char = 0; char < this.props.word.notTyped.length; char++) {
            spans.push(<Char character={ this.props.word.notTyped.charAt(char) } type="notTyped" />);
        }
        return spans
    }

    render() {
        return (
            <span class="Word">{ this.props.children } </span>
        )
    }
}