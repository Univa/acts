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
        this.totalCharacters = 0
        this.startedTyping = false;
        this.lastCorrectKeyTime = new Date().getTime();
        this.lastKeyTime = new Date().getTime();
        this.lineRefs = []
        this.lastKey = ""
        this.lastKeyType = "correct"

        this.punctuationChars = ["-", "?", ".", ",", "\"", ";", ":"]
        this.punctuationChance = 0.2
        this.insideQuote = false

        this.startTime = new Date().getTime()
        this.endTime = new Date().getTime()

        this.handleKey = this.handleKey.bind(this);
        this.reset = this.reset.bind(this);

        this.onCharMouseEnter = this.onCharMouseEnter.bind(this)
        this.onCharMouseLeave = this.onCharMouseLeave.bind(this)
        this.onWordMouseEnter = this.onWordMouseEnter.bind(this)
        this.onWordMouseLeave = this.onWordMouseLeave.bind(this)
        this.onLineMouseEnter = this.onLineMouseEnter.bind(this)
        this.onLineMouseLeave = this.onLineMouseLeave.bind(this)

        this.contentRaw = []

        this.wordsPerLine = 7

        if (this.props.wordBank === "custom") {
            this.wordBank = this.props.customBank
        } else if (this.props.wordBank === "10fastfingers") {
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

        for (var i = 0; i < this.props.linesAhead + 1; i++) {
            this.genLine(this.wordsPerLine)
            this.renderLine(this.contentRaw[i], i, i === 0 ? true : undefined, true, i === 0 ? 0 : undefined, i === 0 ? 0 : undefined)
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.mode !== prevProps.mode && this.props.mode === "result") {
            this.displayResults()
        }

        if ((this.props.message !== prevProps.message) || (this.props.msgduration !== prevProps.msgduration)) {
            this.displayMessage(this.props.msgduration)
        }

        if (this.props.linesAhead > prevProps.linesAhead) {
            for (var i = 0; i < this.props.linesAhead - prevProps.linesAhead; i++) {
                if (this.contentRaw.length <= this.lineTracker + this.props.linesAhead) { this.genLine(this.wordsPerLine) }
                this.renderLine(this.contentRaw[this.lineTracker + prevProps.linesAhead + i + 1], this.lineTracker + prevProps.linesAhead + i + 1, false, true)
            }
        } else if (this.props.linesAhead < prevProps.linesAhead) {
            for (var j = 0; j < prevProps.linesAhead - this.props.linesAhead; j++) {
                this.renderLine(this.contentRaw[this.contentRaw.length - j - 1], this.contentRaw.length - j - 1, false, false)
            }
        }

        if (this.props.linesBehind > prevProps.linesBehind) {
            for (var k = 0; k < this.props.linesBehind - prevProps.linesBehind; k++) {
                this.renderLine(this.contentRaw[this.lineTracker - prevProps.linesBehind - k - 1], this.lineTracker - prevProps.linesBehind - k - 1, false, true)
            }
        } else if (this.props.linesBehind < prevProps.linesBehind) {
            for (var l = 0; l < prevProps.linesBehind - this.props.linesBehind; l++) {
                this.renderLine(this.contentRaw[this.lineTracker - prevProps.linesBehind + l], this.lineTracker - prevProps.linesBehind + l, false, false)
            }
        }

        if (this.props.wordBank !== prevProps.wordBank) {
            this.wordsPerLine = 7

            if (this.props.wordBank === "custom") {
                this.wordBank = this.props.customBank
            } else if (this.props.wordBank === "10fastfingers") {
                this.wordBank = TenFastFingers
            } else if (this.props.wordBank === "typings.gg") {
                this.wordBank = TypingsGG
            } else {
                this.wordBank = Default
                this.wordsPerLine = 5
            }
            this.props.resetHandler()
        }

        if (this.props.customBank.join(" ") !== prevProps.customBank.join(" ") && this.props.wordBank === "custom") {
            this.wordBank = this.props.customBank
            this.props.resetHandler()
        }
        
        if ((this.props.tooltipData.line !== prevProps.tooltipData.line || this.props.tooltipData.word !== prevProps.tooltipData.word || this.props.tooltipData.char !== prevProps.tooltipData.char) && this.props.mode === "result") {
            let line = this.props.tooltipData.line
            let prevLine = prevProps.tooltipData.line
            let word = this.props.tooltipData.word
            let char = this.props.tooltipData.char
            this.renderLine(this.contentRaw[prevLine], prevLine, false, true)
            this.renderLine(this.contentRaw[line], line, true, true, word, char)
            if (line !== undefined) { this.lineRefs[line].current.scrollIntoView({behavior: "smooth", block: "nearest"}) }
        }

        if (this.props.punctuation !== prevProps.punctuation) {
            this.props.resetHandler()
        }

        if (this.props.endCondition !== prevProps.endCondition) {
            this.props.resetHandler()
        }
        
        if (this.props.wordsToType !== prevProps.wordsToType) {
            this.props.resetHandler()
        }
    }

    componentWillUnmount() {
        clearTimeout(this.msg_timeout)
    }

    setLineRef(ref, index) {
        this.lineRefs[index] = ref
    }

    reset() {
        this.words = 0;
        this.wordsLeft = this.props.wordsToType
        this.lineTracker = 0
        this.wordTracker = 0
        this.correctCharacters = 0
        this.totalCharacters = 0
        this.startedTyping = false;
        this.contentRaw = []
        this.insideQuote = false;
        this.setState({
            content: [],
            displayingMessage: false
        })
        clearTimeout(this.msg_timeout)
        for (var i = 0; i < this.props.linesAhead + 1; i++) {
            this.genLine(this.wordsPerLine)
            this.renderLine(this.contentRaw[i], i, i === 0 ? true : undefined, true, i === 0 ? 0 : undefined, i === 0 ? 0 : undefined)
        }
    }

    displayResults() {
        this.setState({
            content: []
        })

        // cut only the lines that were typed on
        this.contentRaw = this.contentRaw.slice(0, this.lineTracker + 1)
        for (var line = 0; line < this.contentRaw.length; line++) {
            this.renderLine(this.contentRaw[line], line)
        }
    }

    // reminder: remove the setStates becuase they're only here for debugging
    onCharMouseEnter(key) {
        this.hoveredChar = parseInt(key.split("-")[1], 10)
        this.updateHoverCoordinates()
    }

    onCharMouseLeave(key) {
        this.hoveredChar = undefined
        this.updateHoverCoordinates()
    }

    onWordMouseEnter(key) {
        this.hoveredWord = parseInt(key.split("-")[1], 10)
        this.updateHoverCoordinates()
    }

    onWordMouseLeave(key) {
        this.hoveredWord = undefined
        this.updateHoverCoordinates()
    }

    onLineMouseEnter(key) {
        this.hoveredLine = parseInt(key.split("-")[1], 10)
        this.updateHoverCoordinates()
    }

    onLineMouseLeave(key) {
        this.hoveredLine = undefined
        this.updateHoverCoordinates()
    }

    updateHoverCoordinates() {
        this.props.hoverHandler(this.hoveredLine, this.hoveredWord, this.hoveredChar)
    }

    renderLine(line_data, pos, highlight = false, active = true, cur_word = -1, cur_char = -1) {
        if (pos >= 0) {
            var words = []
            for (var word in line_data) {
                var highlighted = false
                var chars = []
                var charCount = 0
                var charCountTotal = 0
                var bad_space_pos = -1
                for (var correct in line_data[word].correct) {
                    if (cur_char === charCountTotal && cur_word === parseInt(word, 10)) {
                       highlighted = true 
                    } else {
                        highlighted = false
                    }
                    chars.push(<Char key={ "char-" + charCount } alt_key={ "char-" + charCountTotal } highlightOnHover={ this.props.mode === "result" ? true : false } type="correct" highlighted={ highlighted } character={ line_data[word].correct.charAt(correct) } mouseEnterHandler={ this.onCharMouseEnter } mouseLeaveHandler={ this.onCharMouseLeave }/>)
                    charCount++
                    charCountTotal++
                }
                for (var incorrect in line_data[word].incorrect) {
                    if (line_data[word].incorrect.charAt(incorrect) !== " ") {
                        if (cur_char === charCountTotal && cur_word === parseInt(word, 10)) {
                        highlighted = true 
                        } else {
                            highlighted = false
                        }
                        chars.push(<Char key={ "incorrect-char-" + incorrect } alt_key={ "char-" + charCountTotal } highlightOnHover={ this.props.mode === "result" ? true : false } type="incorrect" highlighted={ highlighted } character={ line_data[word].incorrect.charAt(incorrect) } mouseEnterHandler={ this.onCharMouseEnter } mouseLeaveHandler={ this.onCharMouseLeave }/>)
                        charCountTotal++
                    } else {
                        bad_space_pos = charCountTotal
                        charCountTotal++
                    }
                }
                for (var notTyped in line_data[word].notTyped) {
                    if (line_data[word].notTyped.charAt(notTyped) !== " " || bad_space_pos === -1) {
                        if (cur_char === charCountTotal && cur_word === parseInt(word, 10)) {
                        highlighted = true 
                        } else {
                            highlighted = false
                        }
                        chars.push(<Char key={ "char-" + charCount } alt_key={ "char-" + charCountTotal } highlightOnHover={ this.props.mode === "result" ? true : false } type="notTyped" highlighted={ highlighted } character={ line_data[word].notTyped.charAt(notTyped) } mouseEnterHandler={ this.onCharMouseEnter } mouseLeaveHandler={ this.onCharMouseLeave }/>)
                        charCount++
                        charCountTotal++
                    } else {
                        if (cur_char === bad_space_pos && cur_word === parseInt(word, 10)) {
                            highlighted = true
                        } else {
                            highlighted = false
                        }
                        // the key for this incorrect space is not prefixed with incorrect-char to prevent React from misidentifying this element as a new element
                        // this really just changes the space character's type to incorrect when the user enters a bad space
                        chars.push(<Char key={ "char-" + charCount } alt_key={ "char-" + bad_space_pos } highlightOnHover={ this.props.mode === "result" ? true : false } type="incorrect" highlighted={ highlighted } character={ line_data[word].incorrect.charAt(incorrect) } mouseEnterHandler={ this.onCharMouseEnter } mouseLeaveHandler={ this.onCharMouseLeave }/>)
                    }
                }
                if (parseInt(word, 10) === cur_word) {
                    highlighted = true
                } else {
                    highlighted = false
                }
                words.push(<Word key={ "word-" + word } alt_key={ "word-" + word } highlighted={ highlighted } highlightOnHover={ this.props.mode === "result" ? true : false } mouseEnterHandler={ this.onWordMouseEnter } mouseLeaveHandler={ this.onWordMouseLeave }>{ chars }</Word>)
            }

            this.setState(prevState => {
                var new_content = prevState.content.slice()
                new_content[pos] = <Line highlighted={ highlight } key={ "line-" + pos } alt_key={ "line-" + pos } refSet={ this.setLineRef.bind(this) } active={ active } highlightOnHover={ this.props.mode === "result" ? true : false } mouseEnterHandler={ this.onLineMouseEnter } mouseLeaveHandler={ this.onLineMouseLeave }>{ words }</Line>
                return ({
                    content: new_content
                })
            })
        }
    }

    selectRandomWords(num, punctuation = false) {
        var words = [];
        for (var i = 0; i < num; i++) {
            var beginning = ""
            var ending = ""

            if (punctuation === true) {
                var chance = Math.random() / this.punctuationChance
                var char = ""
                if (chance < 1) {
                    char = this.punctuationChars[Math.floor(Math.random() * this.punctuationChars.length)]
                }

                if (char === "-") {
                    ending = char + this.wordBank[Math.floor(Math.random() * this.wordBank.length)]
                } else if (char === "\"" && !this.insideQuote) {
                    beginning = "\""
                    this.insideQuote = !this.insideQuote
                } else if (char === "\"" && this.insideQuote) {
                    ending = "\""
                    this.insideQuote = !this.insideQuote
                } else {
                    ending = char
                }
            }

            words.push(beginning + this.wordBank[Math.floor(Math.random() * this.wordBank.length)] + ending + " ")
        }
        return words;
    }

    genLine(num) {
        var words
        if (!this.props.punctuation) {
            words = this.selectRandomWords(num);
        } else if (this.props.punctuation) {
            words = this.selectRandomWords(num, true)
        }

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

        this.contentRaw.push(wordsToDisplay)
    }

    displayMessage(dur) {
        this.setState({
            displayingMessage: true
        })

        this.props.messageEnableHandler()

        this.msg_timeout = setTimeout(() => {
            this.setState({
                displayingMessage: false 
            })
            this.props.messageDisableHandler()
        }, dur)
    }

    handleKey(e) {
        var line = this.lineTracker
        var word = this.contentRaw[line].findIndex(x => x.id === this.wordTracker)

        if (e.key === "'") {
            e.preventDefault() // disable's firefox quick find from activating
        }

        if (this.props.charBlacklist.includes(e.key)) {
            //pass

        } else if (e.key === "F5") {
            e.preventDefault()
            this.props.resetHandler()

        } else if (this.state.displayingMessage) {
            //pass

        } else if (this.props.mode === "result") {
            //pass

        // If backspace is pressed
        } else if (e.key === "Backspace") {
            // If there are incorrect characters
            if (this.contentRaw[line][word].incorrect.length !== 0) {
                // Delete an incorrect character
                this.contentRaw[line][word].incorrect = this.contentRaw[line][word].incorrect.slice(0, this.contentRaw[line][word].incorrect.length - 1)
                let char = 0
                let cur_char = 0
                if (this.contentRaw[line][word].incorrect.length > 0) {
                    char = this.contentRaw[line][word].correct.length + this.contentRaw[line][word].incorrect.length - 1
                    cur_char = char + 1
                } else {
                    char = this.contentRaw[line][word].correct.length
                    cur_char = char
                }
                this.renderLine(this.contentRaw[line], line, true, true, word, char)

                this.totalCharacters--

                this.props.updateTypingContext({
                    total: this.totalCharacters,
                    currentChar: cur_char
                })

            // If there are no incorrect characters, but some correct characters
            } else if (this.contentRaw[line][word].correct.length > 0) {
                // Delete a correct character
                this.correctCharacters--
                this.totalCharacters--

                this.props.updateTypingContext({
                    correct: this.correctCharacters,
                    total: this.totalCharacters,
                    currentChar: this.contentRaw[line][word].correct.length - 1
                })

                this.contentRaw[line][word].notTyped = this.contentRaw[line][word].correct[this.contentRaw[line][word].correct.length - 1] + this.contentRaw[line][word].notTyped
                this.contentRaw[line][word].correct = this.contentRaw[line][word].correct.slice(0, this.contentRaw[line][word].correct.length - 1)
                let char = this.contentRaw[line][word].correct.length
                this.renderLine(this.contentRaw[line], line, true, true, word, char)

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
                    this.renderLine(this.contentRaw[line], line)
                    this.renderLine(this.contentRaw[line + this.props.linesAhead], line + this.props.linesAhead, false, false) 
                    this.renderLine(this.contentRaw[line - this.props.linesBehind - 1], line - this.props.linesBehind - 1)
                }

                var new_line = this.lineTracker
                var new_word = this.contentRaw[this.lineTracker].findIndex(x => x.id === this.wordTracker)

                // If there are incorrect characters on the previous word
                if (this.contentRaw[new_line][new_word].incorrect.length > 0) {
                    // Delete an incorrect character on the previous word
                    this.contentRaw[new_line][new_word].incorrect = this.contentRaw[new_line][new_word].incorrect.slice(0, this.contentRaw[new_line][new_word].incorrect.length - 1)
                    let char = 0
                    let cur_char = 0
                    if (this.contentRaw[new_line][new_word].incorrect.length > 0) {
                        char = this.contentRaw[new_line][new_word].correct.length + this.contentRaw[new_line][new_word].incorrect.length - 1
                        cur_char = char + 1
                    } else {
                        char = this.contentRaw[new_line][new_word].correct.length
                        cur_char = char
                    }
                    this.renderLine(this.contentRaw[new_line], new_line, true, true, new_word, char)

                    this.totalCharacters--

                    this.props.updateTypingContext({
                        total: this.totalCharacters,
                        currentWord: new_word,
                        currentLine: new_line,
                        currentChar: cur_char
                    })

                // If there are no incorrect characters, then there must be correct characters on the previous word
                } else if (line !== 0 || word !== 0) {
                    // Delete a correct character on the previous word
                    this.correctCharacters--
                    this.totalCharacters--

                    this.props.updateTypingContext({
                        correct: this.correctCharacters,
                        total: this.totalCharacters,
                        currentWord: new_word,
                        currentLine: new_line,
                        currentChar: this.contentRaw[new_line][new_word].correct.length - 1
                    })

                    this.contentRaw[new_line][new_word].notTyped = this.contentRaw[new_line][new_word].correct[this.contentRaw[new_line][new_word].correct.length - 1] + this.contentRaw[new_line][new_word].notTyped
                    this.contentRaw[new_line][new_word].correct = this.contentRaw[new_line][new_word].correct.slice(0, this.contentRaw[new_line][new_word].correct.length - 1)
                    let char = this.contentRaw[new_line][new_word].correct.length
                    this.renderLine(this.contentRaw[new_line], new_line, true, true, new_word, char)
                }
            }

        // If a non-character key is pressed
        } else if (e.key.length > 1) {
            //pass

        // If space is pressed
        } else if (e.key === " ") {
            e.preventDefault() // prevents page from scrolling on smaller screens
            // If all characters were typed correctly
            if (this.contentRaw[line][word].incorrect.length === 0 && this.contentRaw[line][word].notTyped[0] === " ") {
                // Create a correct character
                this.contentRaw[line][word].correct = this.contentRaw[line][word].correct + e.key
                this.contentRaw[line][word].notTyped = this.contentRaw[line][word].notTyped.slice(1, this.contentRaw[line][word].notTyped.length)

                // update time since last correct keypress
                this.lastCorrectKeyTime = new Date().getTime()
                this.lastKeyTime = this.lastCorrectKeyTime
                this.lastKeyType = "correct"
                this.correctCharacters++

                this.props.updateTypingContext({
                    lastCorrectKeyTime: this.lastCorrectKeyTime,
                    correct: this.correctCharacters
                })

            // If there were incorrect characters, or if they press an incorrect key before the space
            } else {
                // Create an incorrect character
                this.contentRaw[line][word].incorrect = this.contentRaw[line][word].incorrect + e.key
                this.lastKeyTime = new Date().getTime()
                this.lastKeyType = "incorrect"
            }

            this.totalCharacters++
            this.lastKey = e.key
            this.props.updateTypingContext({
                lastKeyTime: this.lastKeyTime,
                lastKeyType: this.lastKeyType,
                lastKey: this.lastKey,
                total: this.totalCharacters,
                currentChar: 0
            })

            // Go to the next word
            this.wordTracker++

            // Go to the next line if we were on the last word of the line
            if (this.wordTracker > this.contentRaw[line][this.contentRaw[line].length - 1].id) {
                this.renderLine(this.contentRaw[line], line, false, true, word + 1, 0)

                this.lineTracker++

                if (this.contentRaw.length < this.lineTracker + this.props.linesAhead + 1) {
                    this.genLine(this.wordsPerLine)
                }

                this.renderLine(this.contentRaw[line + this.props.linesAhead + 1], line + this.props.linesAhead + 1) 
                this.renderLine(this.contentRaw[this.lineTracker], this.lineTracker, true, true, 0, 0)
                this.renderLine(this.contentRaw[line - this.props.linesBehind], line - this.props.linesBehind, false, false)
            } else {
                this.renderLine(this.contentRaw[line], line, true, true, word + 1, 0)
            }

            this.props.updateTypingContext({
                currentWord: this.contentRaw[this.lineTracker].findIndex(x => x.id === this.wordTracker),
                currentLine: this.lineTracker
            })

            if (this.props.endCondition === "words") {
                this.props.updateTypingContext({
                    wordsLeft: this.props.wordsToType - this.wordTracker
                })
            }

            if (this.props.endCondition === "words" && this.props.wordsToType - this.wordTracker === 0) {
                this.endTime = new Date().getTime()
                this.props.updateTypingContext({
                    endTime: this.endTime
                })
                this.props.finishHandler()
            }

            // Start the timer if it hasn't
            if (!this.startedTyping) {
                this.startedTyping = true;
                this.startTime = new Date().getTime()
                this.props.updateTypingContext({
                    running: true,
                    startTime: this.startTime
                })
            }

        // If a correct key is pressed, and there are no incorrect characters
        } else if (e.key === this.contentRaw[line][word].notTyped[0] && this.contentRaw[line][word].incorrect.length === 0) {
            // Create a correct character
            this.contentRaw[line][word].correct = this.contentRaw[line][word].correct + e.key
            this.contentRaw[line][word].notTyped = this.contentRaw[line][word].notTyped.slice(1, this.contentRaw[line][word].notTyped.length)
            let char = this.contentRaw[line][word].correct.length
            this.renderLine(this.contentRaw[line], line, true, true, word, char)

            // update time since last correct keypress
            this.lastCorrectKeyTime = new Date().getTime()
            this.lastKeyTime = this.lastCorrectKeyTime
            this.lastKey = e.key
            this.lastKeyType = "correct"
            this.correctCharacters++
            this.totalCharacters++

            this.props.updateTypingContext({
                lastCorrectKeyTime: this.lastCorrectKeyTime,
                lastKeyTime: this.lastKeyTime,
                lastKey: this.lastKey,
                lastKeyType: this.lastKeyType,
                correct: this.correctCharacters,
                total: this.totalCharacters,
                currentChar: char
            })

            // Start the timer if it hasn't
            if (!this.startedTyping) {
                this.startedTyping = true;
                this.startTime = new Date().getTime()
                this.props.updateTypingContext({
                    running: true,
                    startTime: this.startTime
                })
            }

        // If an incorrect key is pressed, or there are incorrect characters
        } else {
            // Create an incorrect character
            this.contentRaw[line][word].incorrect = this.contentRaw[line][word].incorrect + e.key
            let char = this.contentRaw[line][word].correct.length + this.contentRaw[line][word].incorrect.length - 1
            this.renderLine(this.contentRaw[line], line, true, true, word, char)

            this.totalCharacters++
            this.lastKeyTime = new Date().getTime()
            this.lastKey = e.key
            this.lastKeyType = "incorrect"
            this.props.updateTypingContext({
                lastKeyTime: this.lastKeyTime,
                lastKey: this.lastKey,
                lastKeyType: this.lastKeyType,
                currentChar: char + 1,
                total: this.totalCharacters
            })

            // Start the timer if it hasn't
            if (!this.startedTyping) {
                this.startedTyping = true;
                this.startTime = new Date().getTime()
                this.props.updateTypingContext({
                    running: true,
                    startTime: this.startTime
                })
            }
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
