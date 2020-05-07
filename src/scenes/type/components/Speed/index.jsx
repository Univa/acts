import React from 'react'
import './styles.scss'
import { TypingContext } from '../../typing-context'

export class Speed extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            speed: 0
        }

        this.speedDepth = 1000
        this.charsInDepth = 0;
        this.contextData = {
            lastkeytime: 0
        }
    }

    componentDidMount() {
        if (this.props.updateMethod === "type") {
            document.addEventListener('keydown', () => this.setState({
                speed: this.calcSpeed()
            }));
        } else {
            this.interval = setInterval(() => this.setState({
                speed: this.calcSpeed()
            }), this.props.interval)
        }
    }

    updateKeyTimes(data) {
        if (data.lastkeytime !== this.contextData.lastkeytime) {
            this.charsInDepth++
            setTimeout(() => this.charsInDepth--, this.speedDepth)
        }
    }

    calcSpeed() {
        let bullshit = 0
        if (Math.abs(new Date().getTime() - this.contextData.lastkeytime) > this.speedDepth) {
            bullshit = this.charsInDepth
        } else {
            bullshit = this.charsInDepth - ((this.props.interval / this.speedDepth) * ((new Date().getTime() - this.contextData.lastkeytime) / 1000 / (this.props.interval / this.speedDepth)))
        }
        var speed = Math.round(bullshit * (60 / (this.speedDepth / 1000)) / 5)
        this.updateContext({
            speed: speed
        })
        return speed
    }

    render() {
        return (
            <p class="Speed">
                { this.state.speed }
                <TypingContext.Consumer>
                    {(value) => {
                        this.updateContext = value.updateContext
                        this.updateKeyTimes(value.data)
                        this.contextData = value.data
                    }}
                </TypingContext.Consumer>
            </p>
        )
    }
}

Speed.defaultProps = {
    units: "WPM",
    updateMethod: "time",
    interval: 100
}