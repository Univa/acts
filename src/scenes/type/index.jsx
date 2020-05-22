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
                            <p><span style={{color: theme.color.notTyped}}>Start typing when you're </span><span style={{color: theme.color.correct}}>ready.</span></p>
                        ]
                    )}
                </SettingsContext.Consumer>
            ),
            duration: 3000,
            mode: "type",
            typedata: {
                speed: 0,
                lastkeytime: 0,
                lastkeydelay: 0,
                running: false,
                correct: 0,
                total: 0
            }
        }

        this.onTimerStop = this.onTimerStop.bind(this)
        this.onTimerFinish = this.onTimerFinish.bind(this)
        this.onReset = this.onReset.bind(this)
        this.onMessageEnable = this.onMessageEnable.bind(this)
        this.onMessageDisable = this.onMessageDisable.bind(this)
        this.updateTypingContext = (new_data) => {
            // don't touch this ever again or you'll get fucked again
            this.setState(prevState => ({
                typedata: {
                    ...prevState.typedata,
                    ...new_data
                }
            }))
        }

        this.timerRef = React.createRef()
        this.wordsRef = React.createRef()
        this.containerRef = React.createRef()
    }

    componentDidMount() {
        // this pattern for setting an event on a parent component that calls a child method doesn't seem to be the best design
        // maybe i can come up with something better later, but this will do for now
        // the problem is the parent ref isn't set when the child component mounts, so i can't set this event there
        this.containerRef.current.addEventListener('keydown', this.wordsRef.current.handleKey)
        this.containerRef.current.focus()
    }

    componentWillUnmount() {
        this.containerRef.current.removeEventListener('keydown', this.wordsRef.current.handleKey)
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
        this.results = (
            <SettingsContext.Consumer>
                {(settings) => (
                    <div className="results">
                        <p><span style={{color: settings.theme.color.notTyped}}>WPM: </span><span style={{color: settings.theme.color.correct}}>{ (this.state.typedata.correct / 5 * (60 / settings.startTime)).toFixed(1) }</span></p>
                        <p><span style={{color: settings.theme.color.notTyped}}>Accuracy: </span><span style={{color: settings.theme.color.correct}}>{ this.state.typedata.correct + "/" + this.state.typedata.total + " (" + (this.state.typedata.correct / this.state.typedata.total * 100).toFixed(1) + "%)" }</span></p>
                        <p><span style={{color: settings.theme.color.correct}}>F5</span><span style={{color: settings.theme.color.notTyped}}> to reset</span></p>
                    </div>
                )}
            </SettingsContext.Consumer>
        )
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
                lastkeytime: 0,
                lastkeydelay: 0,
                correct: 0,
                total: 0
            }
        })
        this.timerRef.current.reset()
        this.wordsRef.current.reset()
    }

    render() { 
        return (
            <TypingContext.Provider value={ this.state.typedata }>
                <SettingsContext.Consumer>
                    {(settings) => (
                        <div className="Type" tabIndex="0" ref={ this.containerRef }>
                            <div className="info">
                                <Timer
                                    startTime={ settings.startTime }
                                    running={ this.state.typedata.running }
                                    stopHandler={ this.onTimerStop }
                                    finishHandler={ this.onTimerFinish }
                                    resetHandler={ this.onReset }
                                    ref={ this.timerRef }
                                />
                                <Display value={ this.state.typedata.correct } />
                                <Speed updateTypingContext={ this.updateTypingContext }/>
                            </div>
                            <div className="main">
                                <Words
                                    linesAhead={ settings.linesAhead }
                                    linesBehind={ settings.linesBehind }
                                    mode={ this.state.mode }
                                    message={ this.state.message }
                                    msgduration={ this.state.duration }
                                    updateTypingContext={ this.updateTypingContext }
                                    wordBank={ settings.wordBank }
                                    customBank={ settings.customBank }
                                    resetHandler={ this.onReset }
                                    messageEnableHandler={ this.onMessageEnable }
                                    messageDisableHandler={ this.onMessageDisable }
                                    charBlacklist={ settings.cmdPrefixes }
                                    ref={ this.wordsRef }
                                />
                                { this.state.mode === "result" && this.state.displayingMessage === false ? this.results : null }
                            </div>
                        </div>
                    )}
                </SettingsContext.Consumer>
            </TypingContext.Provider>
        )
    }
}


