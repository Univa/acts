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
import { ThemeContext } from '../../theme-context';

export default class Type extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            message: (
                <ThemeContext.Consumer>
                    {(theme) => (
                        [
                            <p><span style={{color: theme.color.notTyped}}>Welcome.</span></p>,
                            <p><span style={{color: theme.color.notTyped}}>Start typing when you're </span><span style={{color: theme.color.correct}}>ready.</span></p>
                        ]
                    )}
                </ThemeContext.Consumer>
            ),
            duration: 3000,
            mode: "type",
            typedata: {
                data: {
                    speed: 0,
                    lastkeytime: 0,
                    lastkeydelay: 0,
                    running: false,
                    correct: 0
                },
            }
        }

        this.onTimerStop = this.onTimerStop.bind(this)
        this.updateContextData = (new_data) => {
            // don't touch this ever again or you'll get fucked again
            this.setState(prevState => ({
                typedata: {
                    ...prevState.typedata,
                    data: {
                        ...prevState.typedata.data,
                        ...new_data
                    }
                }
            }))
        }
    }

    componentDidMount() {
        this.setState(prevState => ({
            typedata: {
                data: {
                    ...prevState.typedata.data
                },
                updateContext: this.updateContextData
            }
        }))
    }

    onTimerStop() {
        this.setState(prevState => ({
            mode: "result",
            message: (
                <ThemeContext.Consumer>
                    {(theme) => (
                        [
                            <p><span style={{color: theme.color.notTyped}}>Time's up.</span></p>,
                            <p><span style={{color: theme.color.notTyped}}>WPM: </span><span style={{color: theme.color.correct}}>{ this.state.typedata.data.correct / 5 }</span></p>
                        ]
                    )}
                </ThemeContext.Consumer>
            ),
            typedata: {
                ...prevState.typedata,
                data: {
                    ...prevState.typedata.data,
                    running: false
                }
            }
        }))
    }

    render() { 
        return (
            <TypingContext.Provider value={ this.state.typedata }>
                <ThemeContext.Consumer>
                    {(theme) => (
                        <div class="container" style={{backgroundColor: theme.color.bg}}>
                            <div class="info">
                                <Timer
                                    running={ this.state.typedata.data.running }
                                    stopHandler={ this.onTimerStop }
                                />
                                <Display value={ this.state.typedata.data.correct } />
                                <Speed />
                            </div>
                            <Words
                                keyHandler={ this.handleKey }
                                message={ this.state.message }
                                msgduration={ this.state.duration }
                            />
                        </div>
                    )}
                </ThemeContext.Consumer>
            </TypingContext.Provider>
        )
    }
}


