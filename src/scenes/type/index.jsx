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
                correct: 0
            }
        }

        this.onTimerStop = this.onTimerStop.bind(this)
        this.updateTypingContext = (new_data) => {
            // don't touch this ever again or you'll get fucked again
            this.setState(prevState => ({
                typedata: {
                    ...prevState.typedata,
                    ...new_data
                }
            }))
        }

        this.wordsRef = React.createRef()
        this.containerRef = React.createRef()
    }

    componentDidMount() {
        // this pattern for setting an event on a parent component that calls a child method doesn't seem to be the best design
        // maybe i can come up with something better later, but this will do for now
        // the problem is the parent ref isn't set when the child component mounts, so i can't set this event there
        this.containerRef.addEventListener('keydown', this.wordsRef.handleKey)
        this.containerRef.focus()
    }

    componentWillUnmount() {
        this.containerRef.removeEventListener('keydown', this.wordsRef.handleKey)
    }

    onTimerStop() {
        this.setState(prevState => ({
            mode: "result",
            message: (
                <SettingsContext.Consumer>
                    {(settings) => (
                        [
                            <p><span style={{color: settings.theme.color.notTyped}}>Time's up.</span></p>,
                            <p><span style={{color: settings.theme.color.notTyped}}>WPM: </span><span style={{color: settings.theme.color.correct}}>{ (this.state.typedata.correct / 5 * (60 / settings.starttime)).toFixed(1) }</span></p>
                        ]
                    )}
                </SettingsContext.Consumer>
            ),
            typedata: {
                ...prevState.typedata,
                running: false
            }
        }))
    }

    render() { 
        return (
            <TypingContext.Provider value={ this.state.typedata }>
                <SettingsContext.Consumer>
                    {(settings) => (
                        <div className="Type" tabIndex="0" ref={ (elem) => { this.containerRef = elem } }>
                            <div className="info">
                                <Timer
                                    starttime={ settings.starttime }
                                    running={ this.state.typedata.running }
                                    stopHandler={ this.onTimerStop }
                                />
                                <Display value={ this.state.typedata.correct } />
                                <Speed updateTypingContext={ this.updateTypingContext }/>
                            </div>
                            <Words
                                linesAtATime={ settings.linesAtATime }
                                keyHandler={ this.handleKey }
                                message={ this.state.message }
                                msgduration={ this.state.duration }
                                updateTypingContext={ this.updateTypingContext }
                                wordBank={ settings.wordBank }
                                ref={ (elem) => { this.wordsRef = elem } }
                            />
                        </div>
                    )}
                </SettingsContext.Consumer>
            </TypingContext.Provider>
        )
    }
}


