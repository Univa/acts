import React from 'react';
import { wordBank } from './WordBank.js';
import Line from './Line.jsx'
import Char from './Char.jsx'
import Word from './Word.jsx'
import './styles.scss'

export class Words extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            contentDisplayed: [],
            displayingMessage: false
        }

        this.lines = 0;
        this.words = 0;
        this.wordBank = wordBank;
        this.lineTracker = 0
        this.wordTracker = 0
        this.correctCharacters = 0
        this.startedTyping = false;
        this.lastkeytime = new Date().getTime();
    }

    componentDidMount() {
        this.setState({
            isLoaded: true
        })

        document.addEventListener('keydown', this.handleKey.bind(this));

        this.displayMessage(this.props.msgduration)

        for (var i = 0; i < this.props.linesAtATime; i++) {
            this.genLine(8)
        }
    }

    componentDidUpdate(prevProps) {
        if ((this.props.message !== prevProps.message) || (this.props.msgduration !== prevProps.msgduration)) {
            this.displayMessage(this.props.msgduration)
        }
    }

    selectRandomWords(num) {
        var words = [];
        for (var i = 0; i < num; i++) {
            words.push(this.wordBank[Math.floor(Math.random() * (this.wordBank.length + 1))] + " ")
        }
        return words;
    }

    genLine(num) {
        var words = this.selectRandomWords(num);

        var wordsToDisplay = [];
        this.lines++;
        for (var word of words) {
            wordsToDisplay.push({
                id: this.words,
                correct: "",
                incorrect: "",
                notTyped: word
            })
            this.words++
        }

        this.setState(prevState => ({
            contentDisplayed: prevState.contentDisplayed.concat([wordsToDisplay])
        }));
    }

    displayMessage(dur) {
        this.setState({
            displayingMessage: true
        })

        setTimeout(() => {
            this.setState({
                displayingMessage: false 
            })
        }, dur)
    }

    handleKey(e) {
        var line = this.lineTracker
        var word = this.state.contentDisplayed[line].findIndex(x => x.id === this.wordTracker)


        if (e.key === "Shift") {
            // pass
        } else if (e.key === "Backspace" && this.state.contentDisplayed[line][word].incorrect.length !== 0) {
            this.setState(prevState => ({
                    contentDisplayed: prevState.contentDisplayed.map(line => {
                        return line.map(word => {
                            return word.id === this.wordTracker ? { ...word, incorrect: word.incorrect.slice(0, word.incorrect.length - 1) } : word
                        })
                    }),
                })
            )
        } else if ((e.key === "Backspace" && this.state.contentDisplayed[line][word].incorrect.length === 0) && (this.state.contentDisplayed[line][word].correct.length > 0)) {
            this.correctCharacters--

            // update time since last correct keypress
            this.props.updateTypingContext({
                correct: this.correctCharacters
            })
            this.setState(prevState => ({
                    contentDisplayed: prevState.contentDisplayed.map(line => {
                        return line.map(word => {
                            return word.id === this.wordTracker ? { ...word, correct: word.correct.slice(0, word.correct.length - 1), notTyped: word.correct[word.correct.length - 1] + word.notTyped } : word
                        })
                    }),
                })
            )
        } else if (e.key === "Backspace" && this.state.contentDisplayed[line][word].correct.length === 0) {
            this.wordTracker--

            if (this.wordTracker < 0) {
                this.wordTracker = 0
            }

            if (this.wordTracker < this.state.contentDisplayed[line][0].id) {
                this.lineTracker--
            }

            console.log(this.lineTracker)
            console.log(this.wordTracker)

            if (this.state.contentDisplayed[this.lineTracker][this.state.contentDisplayed[this.lineTracker].findIndex(x => x.id === this.wordTracker)].incorrect.length === 0) {
                if (line !== 0 || word !== 0) {
                    this.correctCharacters--

                    // update time since last correct keypress
                    this.props.updateTypingContext({
                        correct: this.correctCharacters
                    })
                    this.setState(prevState => ({
                            contentDisplayed: prevState.contentDisplayed.map(line => {
                                return line.map(word => {
                                    return word.id === this.wordTracker ? { ...word, correct: word.correct.slice(0, word.correct.length - 1), notTyped: word.correct[word.correct.length - 1] + word.notTyped } : word
                                })
                            }),
                        })
                    )
                }
            } else {
                this.setState(prevState => ({
                        contentDisplayed: prevState.contentDisplayed.map(line => {
                            return line.map(word => {
                                return word.id === this.wordTracker ? { ...word, incorrect: word.incorrect.slice(0, word.incorrect.length - 1) } : word
                            })
                        }),
                    })
                )
            }
        } else if (e.key === " ") {
            if (this.state.contentDisplayed[line][word].incorrect.length === 0 && this.state.contentDisplayed[line][word].notTyped[0] === " ") {
                this.lastkeytime = new Date().getTime()
                this.correctCharacters++
                this.props.updateTypingContext({
                    lastkeytime: this.lastkeytime,
                    correct: this.correctCharacters
                })
                this.setState(prevState => ({
                        contentDisplayed: prevState.contentDisplayed.map(line => {
                            return line.map(word => {
                                return word.id === this.wordTracker ? { ...word, correct: word.correct + e.key, notTyped: word.notTyped.slice(1, word.notTyped.length) } : word
                            })
                        }),
                    })
                )
            } else {
                this.setState(prevState => ({
                        contentDisplayed: prevState.contentDisplayed.map(line => {
                            return line.map(word => {
                                return word.id === this.wordTracker ? { ...word, incorrect: word.incorrect + e.key } : word
                            })
                        }),
                    })
                )
            }

            this.wordTracker++

            if (this.wordTracker > this.state.contentDisplayed[line][this.state.contentDisplayed[line].length - 1].id) {
                this.lineTracker++
            }
            if (!this.startedTyping) {
                this.startedTyping = true;
                this.props.updateTypingContext({
                    running: true
                })
            }
        } else if (e.key === this.state.contentDisplayed[line][word].notTyped[0] && this.state.contentDisplayed[line][word].incorrect.length === 0) {
            this.setState(prevState => ({
                    contentDisplayed: prevState.contentDisplayed.map(line => {
                        return line.map(word => {
                            return word.id === this.wordTracker ? { ...word, correct: word.correct + e.key, notTyped: word.notTyped.slice(1, word.notTyped.length) } : word
                        })
                    }),
                })
            )

            this.lastkeytime = new Date().getTime()
            this.correctCharacters++

            // update time since last correct keypress
            this.props.updateTypingContext({
                lastkeytime: this.lastkeytime,
                correct: this.correctCharacters
            })
            if (!this.startedTyping) {
                this.startedTyping = true;
                this.props.updateTypingContext({
                    running: true
                })
            }
        } else if ((e.key !== this.state.contentDisplayed[line][word].notTyped[0] && this.state.contentDisplayed[line][word].incorrect.length === 0) || ((e.key !== " " && e.key !== "Backspace") && this.state.contentDisplayed[line][word].incorrect.length !== 0)) {
            this.setState(prevState => ({
                    contentDisplayed: prevState.contentDisplayed.map(line => {
                        return line.map(word => {
                            return word.id === this.wordTracker ? { ...word, incorrect: word.incorrect + e.key } : word
                        })
                    }),
                })
            )
            if (!this.startedTyping) {
                this.startedTyping = true;
                this.props.updateTypingContext({
                    running: true
                })
            }
        }

        if (this.lines < this.lineTracker + this.props.linesAtATime) {
            this.genLine(8)
        }

    }

    render() {
        if (!this.state.displayingMessage) {
            var lines = []
            for (var line of this.state.contentDisplayed) {
                var words = []
                for (var word of line) {
                    var chars = []
                    for (var correct = 0; correct < word.correct.length; correct++) {
                        chars.push(<Char type="correct" character={ word.correct.charAt(correct) } />)
                    }
                    for (var incorrect = 0; incorrect < word.incorrect.length; incorrect++) {
                        chars.push(<Char type="incorrect" character={ word.incorrect.charAt(incorrect) } />)
                    }
                    for (var notTyped = 0; notTyped < word.notTyped.length; notTyped++) {
                        chars.push(<Char type="notTyped" character={ word.notTyped.charAt(notTyped) } />)
                    }
                    words.push(<Word>{ chars }</Word>)
                }
                lines.push(<Line>{ words }</Line>)
            }
        }

        return (
            <div class="Words">
                { this.state.displayingMessage ? this.props.message : lines }
            </div>
        )
    }
}

Words.defaultProps = {
    isLoaded: false,
    linesAtATime: 2,
    message: null,
    msgduration: 0
}
