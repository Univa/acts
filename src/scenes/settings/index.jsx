import React from 'react'
import { SettingsContext } from '../../settings-context'
import { Input } from './components'
import './styles.scss'

export default class Settings extends React.Component {
    render() {
        return (
            <SettingsContext.Consumer>
                {(settings) => (
                    <div class="Settings" style={{backgroundColor: settings.theme.color.bg}}>
                        <div class="color-settings">
                            <p style={{color: settings.theme.color.notTyped}}>Colors</p>
                            <p>
                                <span style={{color: settings.theme.color.correct}}>Here is some s</span>
                                <span style={{color: settings.theme.color.incorrect}}>imple</span>
                                <span style={{color: settings.theme.color.notTyped}}>ample text</span>
                            </p>
                            <div class="setting-container">
                                <div class="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Background</p>
                                    <Input type="text" settingPath={ ["theme", "color", "bg"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div class="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Correct</p>
                                    <Input type="text" settingPath={ ["theme", "color", "correct"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div class="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Incorrect</p>
                                    <Input type="text" settingPath={ ["theme", "color", "incorrect"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div class="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Default</p>
                                    <Input type="text" settingPath={ ["theme", "color", "notTyped"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div class="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Commands</p>
                                    <Input type="text" settingPath={ ["theme", "color", "command"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div class="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Timer</p>
                                    <Input type="text" settingPath={ ["theme", "color", "timer"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div class="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Correct Counter</p>
                                    <Input type="text" settingPath={ ["theme", "color", "counter"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div class="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Speed</p>
                                    <Input type="text" settingPath={ ["theme", "color", "speed"] } updateSettings={ this.props.updateSettings } />
                                </div>
                            </div>
                        </div>

                        <div class="type-settings">
                            <p style={{color: settings.theme.color.notTyped}}>Typing</p>
                            <div class="setting-container">
                                <div class="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Starting Time</p>
                                    <Input type="number" settingPath={ ["starttime"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div class="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Lines Ahead</p>
                                    <Input type="number" settingPath={ ["linesAtATime"] } updateSettings={ this.props.updateSettings } />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </SettingsContext.Consumer>
        )
    }
}