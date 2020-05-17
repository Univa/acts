import React from 'react'
import { SettingsContext } from '../../settings-context'
import { Input, Menu } from './components'
import './styles.scss'

export default class Settings extends React.Component {
    render() {
        return (
            <SettingsContext.Consumer>
                {(settings) => (
                    <div className="Settings">
                        <div className="color-settings">
                            <p style={{color: settings.theme.color.notTyped}}>Colors</p>
                            <p>
                                <span style={{color: settings.theme.color.correct}}>Here is some s</span>
                                <span style={{color: settings.theme.color.incorrect}}>imple</span>
                                <span style={{color: settings.theme.color.notTyped}}>ample text</span>
                            </p>
                            <div className="setting-container">
                                <div className="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Background</p>
                                    <Input type="text" settingPath={ ["theme", "color", "bg"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div className="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Correct</p>
                                    <Input type="text" settingPath={ ["theme", "color", "correct"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div className="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Incorrect</p>
                                    <Input type="text" settingPath={ ["theme", "color", "incorrect"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div className="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Default</p>
                                    <Input type="text" settingPath={ ["theme", "color", "notTyped"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div className="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Commands</p>
                                    <Input type="text" settingPath={ ["theme", "color", "command"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div className="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Timer</p>
                                    <Input type="text" settingPath={ ["theme", "color", "timer"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div className="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Correct Counter</p>
                                    <Input type="text" settingPath={ ["theme", "color", "counter"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div className="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Speed</p>
                                    <Input type="text" settingPath={ ["theme", "color", "speed"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div className="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Character Highlight</p>
                                    <Input type="text" settingPath={ ["theme", "color", "charHighlight"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div className="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Word Highlight</p>
                                    <Input type="text" settingPath={ ["theme", "color", "wordHighlight"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div className="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Line Highlight</p>
                                    <Input type="text" settingPath={ ["theme", "color", "lineHighlight"] } updateSettings={ this.props.updateSettings } />
                                </div>
                            </div>
                        </div>

                        <div className="type-settings">
                            <p style={{color: settings.theme.color.notTyped}}>Typing</p>
                            <div className="setting-container">
                                <div className="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Starting Time</p>
                                    <Input type="number" settingPath={ ["starttime"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div className="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Lines Ahead</p>
                                    <Input type="number" settingPath={ ["linesAhead"] } upper={5} updateSettings={ this.props.updateSettings } />
                                </div>
                                <div className="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Lines Behind</p>
                                    <Input type="number" settingPath={ ["linesBehind"] } upper={5} updateSettings={ this.props.updateSettings } />
                                </div>
                                <div className="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Word Bank</p>
                                    <Menu options={ ["Default", "10fastfingers", "typings.gg"] } settingPath={ ["wordBank"] } updateSettings={ this.props.updateSettings }/>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </SettingsContext.Consumer>
        )
    }
}