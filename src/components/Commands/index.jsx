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

        this.displayingMessage = false

        this.displayMessage = this.displayMessage.bind(this)

        this.textBox = React.createRef();

        document.addEventListener('keydown', (e) => {
            if ((this.props.prefixes.includes(e.key) && this.textBox.current !== null) && this.state.visibility !== "visible") {
                this.focused = document.activeElement
                this.setState({
                    visibility: "visible"
                })
                this.textBox.current.focus()
            } else if (this.props.prefixes.includes(e.key) && this.displayingMessage) {
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

            if (this.props.prefixes.includes(command[0])) {
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
                        this.displayMessage("Missing setting argument")
                    } else {
                        var value = args.slice(1, args.length).join(" ").trim()
                        var current_setting = this.findSetting(settings, setting)
                        if (value === "") {
                            this.displayMessage("Missing value argument")
                        } else {
                            if (!isNaN(value)) { value = parseInt(value, 10) }
                            if (Array.isArray(current_setting)) {
                                this.props.updateSettings(setting, args.slice(1, args.length), {msg_callback: this.displayMessage})
                            } else {
                                this.props.updateSettings(setting, value, {msg_callback: this.displayMessage})
                            }
                        }
                    }

                } else {
                    if (command[0] === undefined) {
                        this.displayMessage("No command was entered")
                    } else {
                        this.displayMessage("\"" + command[0] + "\" is not a command")
                    }
                }

            } else {
                this.displayMessage("No command was entered")
            }
        }
    }

    displayMessage(msg, time = 2000) {
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
            if (e.target.value === "") {
                this.textBox.current.blur()
            }
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
                        style={{fontFamily: settings.theme.font.command, color: settings.theme.color.command, visibility: this.state.visibility}}
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
