import React from 'react'
import { withRouter } from 'react-router-dom'
import './styles.scss'
import { SettingsContext } from '../../settings-context'

class Commands extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            input: "",
            visibility: "hidden"
        }

        this.prefixes = ["!", ":", "/"]
        this.displayingMessage = false

        this.displayMessage = this.displayMessage.bind(this)

        this.textBox = React.createRef();

        document.addEventListener('keydown', (e) => {
            if ((this.prefixes.includes(e.key) && this.textBox.current !== null) && this.state.visibility !== "visible") {
                this.focused = document.activeElement
                this.setState({
                    visibility: "visible"
                })
                this.textBox.current.focus()
            } else if (this.prefixes.includes(e.key) && this.displayingMessage) {
                clearTimeout(this.timeout)
                this.displayingMessage = false;
                this.setState({
                    input: ""
                })
            } else if ((e.key === "Escape" && this.textBox.current !== null) && this.state.visibility === "visible") {
                clearTimeout(this.timeout)
                this.textBox.current.blur()
            }
        })
    }

    findSetting(settings, path) {
        var setting = settings
        for (var loc of path.split("-")) {
            try {
                setting = setting[loc]
            } catch(err) {
                return undefined
            }
        }
        return setting
    }

    handleKey(e, settings) {
        if (e.key === "Enter" && !this.displayingMessage) {
            var command = e.target.value.trim()

            if (this.prefixes.includes(command[0])) {
                command = command.slice(1, command.length).split(" ")
                command = command.filter(arg => arg !== "") // removes extra spaces

                if (command[0] === "settings") {
                    this.props.history.push("/settings")
                    this.textBox.current.blur()

                } else if (command[0] === "type") {
                    this.props.history.push("/type")
                    this.textBox.current.blur()

                } else if (command[0] === "bank") {
                    this.props.history.push("/bank")
                    this.textBox.current.blur()

                } else if (command[0] === "set") {
                    let args = command.slice(1, command.length)
                    let setting = args[0]
                    if (setting === undefined) {
                        this.displayMessage("Missing setting argument", 2000)
                    } else {
                        var value = args.slice(1, args.length).join(" ").trim()
                        var current_setting = this.findSetting(settings, setting)
                        if (value === "") {
                            this.displayMessage("Missing value argument", 2000)
                        } else {
                            if (!isNaN(value)) { value = parseInt(value, 10) }
                            if (current_setting !== undefined && typeof current_setting !== "object") {
                                this.props.updateSettings(setting, value)
                                this.textBox.current.blur()
                            } else if (Array.isArray(current_setting)) {
                                this.props.updateSettings(setting, args.slice(1, args.length))
                                this.textBox.current.blur()
                            } else {
                                this.displayMessage("\"" + args[0] + "\" is not a setting", 2000)
                            }
                        }
                    }

                } else {
                    this.displayMessage("\"" + command[0] + "\" is not a command", 2000)
                }

            } else {
                this.displayMessage("No command was entered", 2000)
            }
        }
    }

    displayMessage(msg, time) {
        this.setState({
            input: msg
        })
        this.displayingMessage = true
        this.timeout = setTimeout(() => {
            this.textBox.current.blur()
        }, time)
    }

    updateTextBox(e) {
        if (!this.displayingMessage) {
            this.setState({
                input: e.target.value
            })
        }
    }

    clearTextBox(e) {
        this.displayingMessage = false;
        this.setState({
            visibility: "hidden",
            input: ""
        })
        this.focused.focus()
    }

    render() {
        return (
            <SettingsContext.Consumer>
                {(settings) => (
                    <input 
                        type="text"
                        className="commands"
                        style={{color: settings.theme.color.command, visibility: this.state.visibility}}
                        onKeyDown={ (e) => this.handleKey.bind(this)(e, settings) }
                        onChange={ this.updateTextBox.bind(this) }
                        onBlur={ this.clearTextBox.bind(this) }
                        value={ this.state.input }
                        ref={ this.textBox }
                    />
                )}
            </SettingsContext.Consumer>
        )
    }
}

export default withRouter(Commands)
