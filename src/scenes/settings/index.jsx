import React from 'react'
import { SettingsContext } from '../../settings-context'
import { Input } from './components'
import './styles.scss'

export default class Settings extends React.Component {
    render() {
        return (
            <SettingsContext.Consumer>
                {(settings) => (
                    <div class="container" style={{backgroundColor: settings.theme.color.bg}}>
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
                                    <Input settingPath={ ["theme", "color", "bg"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div class="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Correct</p>
                                    <Input settingPath={ ["theme", "color", "correct"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div class="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Incorrect</p>
                                    <Input settingPath={ ["theme", "color", "incorrect"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div class="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Default</p>
                                    <Input settingPath={ ["theme", "color", "notTyped"] } updateSettings={ this.props.updateSettings } />
                                </div>
                                <div class="setting">
                                    <p style={{color: settings.theme.color.notTyped}}>Commands</p>
                                    <Input settingPath={ ["theme", "color", "command"] } updateSettings={ this.props.updateSettings } />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </SettingsContext.Consumer>
        )
    }
}