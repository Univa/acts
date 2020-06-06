import React from 'react'
import { SettingsContext } from '../../settings-context'
import { Button, Input, Menu, Toggle } from './components'
import { NavButton } from '../../components'
import './styles.scss'
import * as themes from '../../themes'

export default class Settings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showThemePresets: false
        }

        this.themes = []
        console.log(themes)
        for (var theme in themes) {
            this.themes.push(
                <Button setting="theme" value={ theme.substring(1) } display={ themes[theme].name } updateSettings={ this.props.updateSettings } />
            )
        }
    }

    toggleThemePresets() {
        this.setState(prevState => ({
            showThemePresets: !prevState.showThemePresets
        }))
    }

    render() {
        return (
            <SettingsContext.Consumer>
                {(settings) => (
                    <div className="Settings" style={{fontFamily: settings.theme.font.settings}}>
                        <div className="theme-settings">
                            <p style={{color: settings.theme.color.correct}}>Theme</p>
                            { (!this.state.showThemePresets) &&
                            <button className="toggle-button" style={{fontFamily: settings.theme.font.settings, color: settings.theme.color.notTyped}} onClick={ this.toggleThemePresets.bind(this) }>Show Theme Presets</button>
                            }
                            { (this.state.showThemePresets) &&
                            <button className="toggle-button" style={{fontFamily: settings.theme.font.settings, color: settings.theme.color.notTyped}} onClick={ this.toggleThemePresets.bind(this) }>Hide Theme Presets</button>
                            }
                            { (this.state.showThemePresets) &&
                            <div className="theme-preset-container">
                                { this.themes }
                            </div>
                            }

                            <div className="subsection" id="color-settings">
                                <p style={{color: settings.theme.color.notTyped}}>Colors</p>
                                <p style={{fontFamily: settings.theme.font.words, backgroundColor: settings.theme.color.lineHighlight, borderRadius: "3px"}}>
                                    <span style={{color: settings.theme.color.correct}}>Here is some </span>
                                    <span style={{backgroundColor: settings.theme.color.wordHighlight, borderRadius: "3px"}}>
                                        <span style={{color: settings.theme.color.correct}}>s</span>
                                        <span style={{color: settings.theme.color.incorrect}}>impl</span>
                                        <span style={{color: settings.theme.color.incorrect, backgroundColor: settings.theme.color.charHighlight, borderRadius: "3px"}}>e</span>
                                        <span key="caret" style={{backgroundColor: settings.theme.color.caret, width: "2px", position: "absolute"}}>&nbsp;</span>
                                        <span style={{color: settings.theme.color.notTyped}}>ample </span>
                                    </span>
                                    <span style={{color: settings.theme.color.notTyped}}>text</span>
                                </p>
                                <div className="setting-container">
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Background</p>
                                        <Input type="text" setting="theme-color-bg" updateSettings={ this.props.updateSettings } />
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Correct</p>
                                        <Input type="text" setting="theme-color-correct" updateSettings={ this.props.updateSettings } />
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Incorrect</p>
                                        <Input type="text" setting="theme-color-incorrect" updateSettings={ this.props.updateSettings } />
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Default</p>
                                        <Input type="text" setting="theme-color-notTyped" updateSettings={ this.props.updateSettings } />
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Commands</p>
                                        <Input type="text" setting="theme-color-command" updateSettings={ this.props.updateSettings } />
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Timer</p>
                                        <Input type="text" setting="theme-color-timer" updateSettings={ this.props.updateSettings } />
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Correct Counter</p>
                                        <Input type="text" setting="theme-color-counter" updateSettings={ this.props.updateSettings } />
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Speed</p>
                                        <Input type="text" setting="theme-color-speed" updateSettings={ this.props.updateSettings } />
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Caret</p>
                                        <Input type="text" setting="theme-color-caret" updateSettings={ this.props.updateSettings } />
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Character Highlight</p>
                                        <Input type="text" setting="theme-color-charHighlight" updateSettings={ this.props.updateSettings } />
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Word Highlight</p>
                                        <Input type="text" setting="theme-color-wordHighlight" updateSettings={ this.props.updateSettings } />
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Line Highlight</p>
                                        <Input type="text" setting="theme-color-lineHighlight" updateSettings={ this.props.updateSettings } />
                                    </div>
                                </div>
                            </div>

                            <div className="subsection" id="font-settings">
                                <p style={{color: settings.theme.color.notTyped}}>Fonts</p>
                                <div className="setting-container">
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Words</p>
                                        <Input type="text" setting="theme-font-words" updateSettings={ this.props.updateSettings } />
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Settings</p>
                                        <Input type="text" setting="theme-font-settings" updateSettings={ this.props.updateSettings } />
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Timer</p>
                                        <Input type="text" setting="theme-font-timer" updateSettings={ this.props.updateSettings } />
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Counter</p>
                                        <Input type="text" setting="theme-font-counter" updateSettings={ this.props.updateSettings } />
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Speed</p>
                                        <Input type="text" setting="theme-font-speed" updateSettings={ this.props.updateSettings } />
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Commands</p>
                                        <Input type="text" setting="theme-font-command" updateSettings={ this.props.updateSettings } />
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Graph</p>
                                        <Input type="text" setting="theme-font-graph" updateSettings={ this.props.updateSettings } />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="type-settings">
                            <p style={{color: settings.theme.color.correct}}>Typing</p>
                            <div className="subsection">
                                <div className="setting-container">
                                    { (settings.endCondition === "time") &&
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Starting Time</p>
                                        <Input type="number" setting="startTime" updateSettings={ this.props.updateSettings } />
                                    </div>
                                    }
                                    { (settings.endCondition === "words") &&
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Words to Type</p>
                                        <Input type="number" setting="wordsToType" updateSettings={ this.props.updateSettings } />
                                    </div>
                                    }
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>End Condition</p>
                                        <Menu options={ ["Time", "Words"] } setting="endCondition" updateSettings={ this.props.updateSettings } />
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Lines Ahead</p>
                                        <Input type="number" setting="linesAhead" upper={5} updateSettings={ this.props.updateSettings } />
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Lines Behind</p>
                                        <Input type="number" setting="linesBehind" upper={5} updateSettings={ this.props.updateSettings } />
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Word Bank</p>
                                        <Menu options={ ["Default", "Custom", "10fastfingers", "typings.gg"] } setting="wordBank" updateSettings={ this.props.updateSettings }/>
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Live WPM Graph</p>
                                        <Toggle setting="liveGraph" updateSettings={ this.props.updateSettings }/>
                                    </div>
                                    <div className="setting">
                                        <p style={{color: settings.theme.color.notTyped}}>Punctuation</p>
                                        <Toggle setting="punctuation" updateSettings={ this.props.updateSettings }/>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <NavButton dest="/bank" message="Edit Custom Word Bank" />
                                <NavButton dest="/type" message="Go Back to Typing" />
                            </div>
                        </div>
                    </div>
                )}
            </SettingsContext.Consumer>
        )
    }
}
