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
    }

    onTimerStop() {
        this.setState(prevState => ({
            mode: "result",
            message: (
                <SettingsContext.Consumer>
                    {({theme}) => (
                        [
                            <p><span style={{color: theme.color.notTyped}}>Time's up.</span></p>,
                            <p><span style={{color: theme.color.notTyped}}>WPM: </span><span style={{color: theme.color.correct}}>{ this.state.typedata.correct / 5 }</span></p>
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
                        <div class="Type" style={{backgroundColor: settings.theme.color.bg}}>
                            <div class="info">
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
                            />
                        </div>
                    )}
                </SettingsContext.Consumer>
            </TypingContext.Provider>
        )
    }
}


