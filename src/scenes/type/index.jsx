import React from 'react';
import {
    Display,
    Graph,
    Timer,
    Words,
    Speed
} from './components'
import { TypingContext } from './typing-context.jsx'
import './styles.scss';
import { SettingsContext } from '../../settings-context';

export default class Type extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            message: (
                <SettingsContext.Consumer>
                    {({theme}) => (
                        [
                            <p><span style={{color: theme.color.notTyped}}>Welcome.</span></p>,
                            <p><span style={{color: theme.color.notTyped}}>Start typing when you're </span><span style={{color: theme.color.correct}}>ready.</span></p>,
                            <p><span style={{color: theme.color.notTyped}}>Type </span><span style={{color: theme.color.command}}>!help</span><span style={{color: theme.color.notTyped}}> to learn how to use commands.</span></p>
                        ]
                    )}
                </SettingsContext.Consumer>
            ),
            duration: 3000,
            mode: "type",
            hoveredCoordinates: {
                line: undefined,
                word: undefined,
                char: undefined
            },
            tooltipData: {},
            typedata: {
                speed: 0,
                speeds: [],
                lastCorrectKeyTime: 0,
                lastKeyTime: 0,
                lastKey: "",
                lastKeyType: "correct",
                running: false,
                correct: 0,
                total: 0,
                startTime: 0,
                endTime: 0,
                wordsLeft: this.wordsToType,
                currentWord: 0,
                currentLine: 0,
                currentChar: 0
            }
        }

        this.wordsToType = 0
        this.onTimerStop = this.onTimerStop.bind(this)
        this.onWordsFinish = this.onWordsFinish.bind(this)
        this.onTimerFinish = this.onTimerFinish.bind(this)
        this.onHoverCoordChange = this.onHoverCoordChange.bind(this)
        this.onGraphHover = this.onGraphHover.bind(this)
        this.onReset = this.onReset.bind(this)
        this.onMessageEnable = this.onMessageEnable.bind(this)
        this.onMessageDisable = this.onMessageDisable.bind(this)
        this.updateTypingContext = (new_data) => {
            this.setState(prevState => {
                if (new_data.total > prevState.typedata.total) {
                    new_data.speeds = prevState.typedata.speeds.concat({speed: this.state.typedata.speed, time: new_data.lastKeyTime, key: new_data.lastKey, keyType: new_data.lastKeyType, char: prevState.typedata.currentChar, word: prevState.typedata.currentWord, line: prevState.typedata.currentLine})
                } else if (new_data.total < prevState.typedata.total) {
                    new_data.speeds = prevState.typedata.speeds.slice(0, prevState.typedata.speeds.length - 1)
                }
                return {
                    typedata: {
                        ...prevState.typedata,
                        ...new_data
                    }
                }
            })
        }

        this.timerRef = React.createRef()
        this.wordsRef = React.createRef()
        this.speedRef = React.createRef()
        this.containerRef = React.createRef()
    }

    componentDidMount() {
        // this pattern for setting an event on a parent component that calls a child method doesn't seem to be the best design
        // maybe i can come up with something better later, but this will do for now
        // the problem is the parent ref isn't set when the child component mounts, so i can't set this event there
        this.containerRef.current.addEventListener('keydown', this.wordsRef.current.handleKey)
        this.containerRef.current.focus()
        this.updateTypingContext({
            wordsLeft: this.wordsToType
        })
    }

    componentWillUnmount() {
        this.containerRef.current.removeEventListener('keydown', this.wordsRef.current.handleKey)
    }

    calcStdDev() {
        // calculate the mean
        let sum = 0
        let correct_count = 0
        for (var data of this.state.typedata.speeds) {
            if (data.keyType === "correct") {
                sum += data.speed
                correct_count++
            }
        }
        let mean = sum / correct_count

        // calculate deviations
        let deviation_sum = 0
        for (var data2 of this.state.typedata.speeds) {
            if (data2.keyType === "correct") {
                deviation_sum += Math.pow(mean - data2.speed, 2)
            }
        }

        return Math.sqrt(deviation_sum / correct_count).toFixed(1)
    }

    onTimerFinish() {
        this.setState(prevState => ({
            mode: "result",
            message: (
                <SettingsContext.Consumer>
                    {(settings) => (
                        [
                            <p><span style={{color: settings.theme.color.notTyped}}>Time's up.</span></p>,
                            <p><span style={{color: settings.theme.color.notTyped}}>WPM: </span><span style={{color: settings.theme.color.correct}}>{ (this.state.typedata.correct / 5 * (60 / settings.startTime)).toFixed(1) }</span></p>
                        ]
                    )}
                </SettingsContext.Consumer>
            )
        }))
    }

    onWordsFinish() {
        this.setState(prevState => ({
            mode: "result",
            message: (
                <SettingsContext.Consumer>
                    {(settings) => (
                        [
                            <p><span style={{color: settings.theme.color.notTyped}}>All words typed.</span></p>,
                            <p><span style={{color: settings.theme.color.notTyped}}>WPM: </span><span style={{color: settings.theme.color.correct}}>{ (this.state.typedata.correct / 5 * (60 / ((this.state.typedata.endTime - this.state.typedata.startTime) / 1000))).toFixed(1) }</span></p>
                        ]
                    )}
                </SettingsContext.Consumer>
            )
        }))
    }

    onMessageDisable() {
        this.setState({
            displayingMessage: false
        })
    }

    onMessageEnable() {
        this.setState({
            displayingMessage: true
        })
    }

    onTimerStop() {
        this.setState(prevState => ({
            typedata: {
                ...prevState.typedata,
                running: false
            }
        }))
    }

    onReset() {
        this.setState({
            mode: "type",
            typedata: {
                speed: 0,
                speeds: [],
                lastCorrectKeyTime: 0,
                lastKeyTime: 0,
                lastKey: "",
                lastKeyType: "correct",
                correct: 0,
                total: 0,
                startTime: 0,
                endTime: 0,
                wordsLeft: this.wordsToType,
                currentWord: 0,
                currentLine: 0,
                currentChar: 0
            }
        })
        if (this.timerRef.current !== null) {
            this.timerRef.current.reset()
        }
        this.wordsRef.current.reset()
        this.speedRef.current.reset()
    }

    onHoverCoordChange(line, word, char) {
        this.setState({
            hoveredCoordinates: {line: line, word: word, char: char}
        })
    }

    onGraphHover(data) {
        this.setState({
            tooltipData: data
        })
    }

    render() { 
        return (
            <TypingContext.Provider value={ this.state.typedata }>
                <SettingsContext.Consumer>
                    {(settings) => {
                        this.wordsToType = settings.wordsToType
                        return (
                            <div className="Type" tabIndex="0" ref={ this.containerRef } style={{fontFamily: settings.theme.font.words}}>
                                { (settings.liveGraph && settings.endCondition === "time") && 
                                <Graph mode="live" data={ this.state.typedata.speeds } xScale={ settings.startTime } style={{position: "absolute", opacity: 0.1, width: "100vw", height: "100vh"}}/>
                                }
                                { (settings.liveGraph && settings.endCondition === "words") && 
                                <Graph mode="live" data={ this.state.typedata.speeds } xScale={ this.state.typedata.wordsLeft > 0 ? (new Date().getTime() - this.state.typedata.startTime) / 1000 : (this.state.typedata.endTime - this.state.typedata.startTime) / 1000 } style={{position: "absolute", opacity: 0.1, width: "100vw", height: "100vh"}}/>
                                }
                                <div className="info">
                                    { (settings.endCondition === "time") &&
                                    <Timer
                                        startTime={ settings.startTime }
                                        running={ this.state.typedata.running }
                                        stopHandler={ this.onTimerStop }
                                        finishHandler={ this.onTimerFinish }
                                        resetHandler={ this.onReset }
                                        ref={ this.timerRef }
                                    />
                                    }
                                    { (settings.endCondition === "words") &&
                                    <Display value={ this.state.typedata.wordsLeft } />
                                    }
                                    <Display value={ this.state.typedata.correct } />
                                    <Speed updateTypingContext={ this.updateTypingContext } ref={ this.speedRef }/>
                                </div>
                                <div className="main">
                                    <Words
                                        linesAhead={ settings.linesAhead }
                                        linesBehind={ settings.linesBehind }
                                        mode={ this.state.mode }
                                        punctuation={ settings.punctuation }
                                        endCondition={ settings.endCondition }
                                        wordsToType={ settings.wordsToType }
                                        message={ this.state.message }
                                        msgduration={ this.state.duration }
                                        updateTypingContext={ this.updateTypingContext }
                                        wordBank={ settings.wordBank }
                                        customBank={ settings.customBank }
                                        tooltipData={ this.state.tooltipData }
                                        resetHandler={ this.onReset }
                                        hoverHandler={ this.onHoverCoordChange }
                                        messageEnableHandler={ this.onMessageEnable }
                                        messageDisableHandler={ this.onMessageDisable }
                                        charBlacklist={ settings.cmdPrefixes }
                                        finishHandler={ this.onWordsFinish }
                                        ref={ this.wordsRef }
                                    />
                                    { (this.state.mode === "result" && this.state.displayingMessage === false) &&
                                    <div className="results">
                                        { (settings.endCondition === "time") &&
                                        <>
                                        <Graph mode="static" data={ this.state.typedata.speeds } xScale={ settings.startTime } hoveredCoordinates={ this.state.hoveredCoordinates } hoverHandler={ this.onGraphHover }/>
                                        <p><span style={{color: settings.theme.color.notTyped}}>WPM: </span><span style={{color: settings.theme.color.correct}}>{ (this.state.typedata.correct / 5 * (60 / settings.startTime)).toFixed(1) }</span></p>
                                        </>
                                        }
                                        { (settings.endCondition === "words") &&
                                        <>
                                        <Graph mode="static" data={ this.state.typedata.speeds } xScale={ (this.state.typedata.endTime - this.state.typedata.startTime) / 1000 } hoveredCoordinates={ this.state.hoveredCoordinates } hoverHandler={ this.onGraphHover }/>
                                        <p><span style={{color: settings.theme.color.notTyped}}>WPM: </span><span style={{color: settings.theme.color.correct}}>{ (this.state.typedata.correct / 5 * (60 / ((this.state.typedata.endTime - this.state.typedata.startTime) / 1000))).toFixed(1) }</span></p>
                                        </>
                                        }
                                        <p><span style={{color: settings.theme.color.notTyped}}>Accuracy: </span><span style={{color: settings.theme.color.correct}}>{ this.state.typedata.correct + "/" + this.state.typedata.total + " (" + (this.state.typedata.correct / this.state.typedata.total * 100).toFixed(1) + "%)" }</span></p>
                                        <p><span style={{color: settings.theme.color.notTyped}}>Standard Deviation: </span><span style={{color: settings.theme.color.correct}}>{ this.calcStdDev() }</span></p>
                                        <p><span style={{color: settings.theme.color.correct}}>F5</span><span style={{color: settings.theme.color.notTyped}}> to reset</span></p>
                                    </div>
                                    }
                                </div>
                            </div>
                        )
                    }}
                </SettingsContext.Consumer>
            </TypingContext.Provider>
        )
    }
}


