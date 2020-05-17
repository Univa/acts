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

        this.textBox = React.createRef();

        document.addEventListener('keydown', (e) => {
            if (this.prefixes.includes(e.key) && this.textBox.current !== null) {
                this.focused = document.activeElement
                this.setState({
                    visibility: "visible"
                })
                this.textBox.current.focus()
            } else if (e.key === "Escape" && this.textBox.current !== null) {
                this.textBox.current.blur()
            }
        })
    }

    handleKey(e) {
        if (e.key === "Enter") {
            var command = e.target.value.trim()

            if (this.prefixes.includes(command[0])) {
                command = command.slice(1, command.length)

                if (command === "settings") {
                    this.props.history.push("/settings")
                } else if (command === "type") {
                    this.props.history.push("/type")
                }
            }

            this.textBox.current.blur()
        }
    }

    updateTextBox(e) {
        this.setState({
            input: e.target.value
        })
    }

    clearTextBox(e) {
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
                        onKeyDown={ this.handleKey.bind(this) }
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
