import React from 'react';
import { Default, TenFastFingers, TypingsGG } from './word_banks';
import Line from './Line.jsx'
import Char from './Char.jsx'
import Word from './Word.jsx'
import './styles.scss'

export default class Words extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            displayingMessage: false,
            content: []
        }

        this.words = 0;
        this.lineTracker = 0
        this.wordTracker = 0
        this.correctCharacters = 0
        this.startedTyping = false;
        this.lastkeytime = new Date().getTime();

        this.handleKey = this.handleKey.bind(this);

        this.contentRaw = []

        this.wordsPerLine = 7

        if (this.props.wordBank === "10fastfingers") {
            this.wordBank = TenFastFingers
        } else if (this.props.wordBank === "typings.gg") {
            this.wordBank = TypingsGG
        } else {
            this.wordBank = Default
            this.wordsPerLine = 5
        }
    }

    componentDidMount() {
        this.setState({
            isLoaded: true
        })

        this.displayMessage(this.props.msgduration)

        for (var i = 0; i < this.props.linesAhead + this.props.linesBehind + 1; i++) {
            this.genLine(this.wordsPerLine)
        }
    }

    componentDidUpdate(prevProps) {
        if ((this.props.message !== prevProps.message) || (this.props.msgduration !== prevProps.msgduration)) {
            this.displayMessage(this.props.msgduration)
        }
    }

    renderLine(line_data, pos, active = true) {
        if (pos >= 0) {
            var words = []
            for (var word in line_data) {
                var chars = []
                var charCount = 0
                for (var correct in line_data[word].correct) {
                    chars.push(<Char key={ "char-" + charCount } type="correct" character={ line_data[word].correct.charAt(correct) } />)
                    charCount++
                }
                for (var incorrect in line_data[word].incorrect) {
                    chars.push(<Char key={ "incorrect-char-" + incorrect } type="incorrect" character={ line_data[word].incorrect.charAt(incorrect) } />)
                }
                for (var notTyped in line_data[word].notTyped) {
                    chars.push(<Char key={ "char-" + charCount } type="notTyped" character={ line_data[word].notTyped.charAt(notTyped) } />)
                    charCount++
                }
                words.push(<Word key={ "word-" + word }>{ chars }</Word>)
            }

            this.setState(prevState => {
                var new_content = prevState.content.slice()
                new_content[pos] = <Line key={ "line-" + pos } active={ active }>{ words }</Line>
                return ({
                    content: new_content
                })
            })
        }
    }

    selectRandomWords(num) {
        var words = [];
        for (var i = 0; i < num; i++) {
            words.push(this.wordBank[Math.floor(Math.random() * this.wordBank.length)] + " ")
        }
        return words;
    }

    genLine(num) {
        var words = this.selectRandomWords(num);

        var wordsToDisplay = [];
        for (var word of words) {
            wordsToDisplay.push({
                id: this.words,
                correct: "",
                incorrect: "",
                notTyped: word
            })
            this.words++
        }

        this.renderLine(wordsToDisplay, this.contentRaw.length)
        this.contentRaw.push(wordsToDisplay)
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
        var word = this.contentRaw[line].findIndex(x => x.id === this.wordTracker)

        if (e.key === "'") {
            e.preventDefault() // disable's firefox quick find from activating
        }

        if (this.state.displayingMessage) {
            //pass

        // If backspace is pressed
        } else if (e.key === "Backspace") {
            // If there are incorrect characters
            if (this.contentRaw[line][word].incorrect.length !== 0) {
                // Delete an incorrect character
                this.contentRaw[line][word].incorrect = this.contentRaw[line][word].incorrect.slice(0, this.contentRaw[line][word].incorrect.length - 1)
                this.renderLine(this.contentRaw[line], line)

            // If there are no incorrect characters, but some correct characters
            } else if (this.contentRaw[line][word].correct.length > 0) {
                // Delete a correct character
                this.correctCharacters--

                this.props.updateTypingContext({
                    correct: this.correctCharacters
                })

                this.contentRaw[line][word].notTyped = this.contentRaw[line][word].correct[this.contentRaw[line][word].correct.length - 1] + this.contentRaw[line][word].notTyped
                this.contentRaw[line][word].correct = this.contentRaw[line][word].correct.slice(0, this.contentRaw[line][word].correct.length - 1)
                this.renderLine(this.contentRaw[line], line)

            // If there are no incorrect or correct characters
            } else if (this.contentRaw[line][word].correct.length === 0) {
                // Go back a word
                this.wordTracker--

                if (this.wordTracker < 0) {
                    this.wordTracker = 0
                }

                // Go back a line if we were on the first word of the line
                if (this.wordTracker < this.contentRaw[line][0].id) {
                    this.lineTracker--
                    this.renderLine(this.contentRaw[line + this.props.linesAhead], line + this.props.linesAhead, false) 
                    this.renderLine(this.contentRaw[line - this.props.linesBehind - 1], line - this.props.linesBehind - 1)
                }

                var new_line = this.lineTracker
                var new_word = this.contentRaw[this.lineTracker].findIndex(x => x.id === this.wordTracker)

                // If there are incorrect characters on the previous word
                if (this.contentRaw[new_line][new_word].incorrect.length > 0) {
                    // Delete an incorrect character on the previous word
                    this.contentRaw[new_line][new_word].incorrect = this.contentRaw[new_line][new_word].incorrect.slice(0, this.contentRaw[new_line][new_word].incorrect.length - 1)
                    this.renderLine(this.contentRaw[new_line], new_line)

                // If there are no incorrect characters, but some correct characters on the previous word
                } else if (this.contentRaw[new_line][new_word].correct.length > 0) {
                    if (line !== 0 || word !== 0) {
                        // Delete a correct character on the previous word
                        this.correctCharacters--

                        this.props.updateTypingContext({
                            correct: this.correctCharacters
                        })

                        this.contentRaw[new_line][new_word].notTyped = this.contentRaw[new_line][new_word].correct[this.contentRaw[new_line][new_word].correct.length - 1] + this.contentRaw[new_line][new_word].notTyped
                        this.contentRaw[new_line][new_word].correct = this.contentRaw[new_line][new_word].correct.slice(0, this.contentRaw[new_line][new_word].correct.length - 1)
                        this.renderLine(this.contentRaw[new_line], new_line)
                    }
                }
            }

        // If a non-character key is pressed
        } else if (e.key.length > 1) {
            //pass

        // If space is pressed
        } else if (e.key === " ") {
            // If all characters were typed correctly
            if (this.contentRaw[line][word].incorrect.length === 0 && this.contentRaw[line][word].notTyped[0] === " ") {
                // Create a correct character
                this.contentRaw[line][word].correct = this.contentRaw[line][word].correct + e.key
                this.contentRaw[line][word].notTyped = this.contentRaw[line][word].notTyped.slice(1, this.contentRaw[line][word].notTyped.length)
                this.renderLine(this.contentRaw[line], line)

                // update time since last correct keypress
                this.lastkeytime = new Date().getTime()
                this.correctCharacters++

                this.props.updateTypingContext({
                    lastkeytime: this.lastkeytime,
                    correct: this.correctCharacters
                })

            // If there were incorrect characters, or if they press an incorrect key before the space
            } else {
                // Create an incorrect character
                this.contentRaw[line][word].incorrect = this.contentRaw[line][word].incorrect + e.key
                this.renderLine(this.contentRaw[line], line)
            }

            // Go to the next word
            this.wordTracker++

            // Go to the next line if we were on the last word of the line
            if (this.wordTracker > this.contentRaw[line][this.contentRaw[line].length - 1].id) {
                this.lineTracker++
                this.renderLine(this.contentRaw[line + this.props.linesAhead + 1], line + this.props.linesAhead + 1) 
                this.renderLine(this.contentRaw[line - this.props.linesBehind], line - this.props.linesBehind, false)
            }

            // Start the timer if it hasn't
            if (!this.startedTyping) {
                this.startedTyping = true;
                this.props.updateTypingContext({
                    running: true
                })
            }

        // If a correct key is pressed, and there are no incorrect characters
        } else if (e.key === this.contentRaw[line][word].notTyped[0] && this.contentRaw[line][word].incorrect.length === 0) {
            // Create a correct character
            this.contentRaw[line][word].correct = this.contentRaw[line][word].correct + e.key
            this.contentRaw[line][word].notTyped = this.contentRaw[line][word].notTyped.slice(1, this.contentRaw[line][word].notTyped.length)
            this.renderLine(this.contentRaw[line], line)

            // update time since last correct keypress
            this.lastkeytime = new Date().getTime()
            this.correctCharacters++

            this.props.updateTypingContext({
                lastkeytime: this.lastkeytime,
                correct: this.correctCharacters
            })

            // Start the timer if it hasn't
            if (!this.startedTyping) {
                this.startedTyping = true;
                this.props.updateTypingContext({
                    running: true
                })
            }

        // If an incorrect key is pressed, or there are incorrect characters
        } else {
            // Create an incorrect character
            this.contentRaw[line][word].incorrect = this.contentRaw[line][word].incorrect + e.key
            this.renderLine(this.contentRaw[line], line)

            // Start the timer if it hasn't
            if (!this.startedTyping) {
                this.startedTyping = true;
                this.props.updateTypingContext({
                    running: true
                })
            }
        }

        if (this.contentRaw.length < this.lineTracker + this.props.linesAhead + 1) {
            this.genLine(this.wordsPerLine)
        }
    }

    render() {
        return (
            <div className="Words">
                { this.state.displayingMessage ? this.props.message : this.state.content }
            </div>
        )
    }
}

Words.defaultProps = {
    isLoaded: false,
    linesAhead: 2,
    linesBehind: 1,
    message: null,
    msgduration: 0
}
