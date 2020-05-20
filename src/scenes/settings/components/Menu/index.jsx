import React from 'react'
import './styles.scss'
import { SettingsContext } from '../../../../settings-context'

export default class Menu extends React.Component {
    findSetting(settings) {
        var setting = settings
        for (var loc of this.props.setting.split("-")) {
            try {
                setting = setting[loc]
            } catch(err) {
                return undefined
            }
        }
        return setting
    }

    handleChange(event) {
        this.props.updateSettings(this.props.setting, event.target.value)
    }

    render() {
        return (
            <SettingsContext.Consumer>
                {(settings) => {
                    var options = []
                    var current = this.findSetting(settings)
                    for (var item of this.props.options) {
                        options.push(<option
                                style={{color: settings.theme.color.notTyped}}
                                className="menu-option"
                                key={ item }
                                value={ item }
                                onClick={ this.handleChange.bind(this) }
                            >{ item }</option>)
                    }
                    return (
                        <div className="Menu">
                            <input disabled style={{color: settings.theme.color.notTyped}} className="menu-button" type="text" value={ current } />
                            <div className="menu-options">
                                { options }
                            </div>
                        </div>
                    )
                }}
            </SettingsContext.Consumer>
        )
    }
}
