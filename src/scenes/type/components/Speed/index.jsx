import React from 'react'
import './styles.scss'
import { TypingContext } from '../../typing-context'
import { SettingsContext } from '../../../../settings-context'

export default class Speed extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            speed: 0
        }

        this.speed = 0
        this.speedDepth = 1000
        this.charsInDepth = 0;
        this.contextData = {
            lastCorrectKeyTime: 0
        }

        this.updateSpeed = this.updateSpeed.bind(this)
        this.timeouts = []
    }

    updateSpeed() {
        this.speed = this.calcSpeed()
        if (this.speed !== this.state.speed) {
            this.props.updateTypingContext({
                speed: this.speed 
            })
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.updateSpeed()
            this.setState({
                speed: parseInt(this.speed)
            })
        }, this.props.interval)
    }

    updateKeyTimes(data) {
        if (data.lastCorrectKeyTime !== this.contextData.lastCorrectKeyTime) {
            this.charsInDepth++
            this.timeouts.push(setTimeout(() => {
                this.charsInDepth--
                if (this.charsInDepth < 0) {
                    this.charsInDepth = 0
                }
            }, this.speedDepth))
        }
        if (data.lastKeyTime !== this.contextData.lastKeyTime) {
            this.updateSpeed()
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval)
        document.removeEventListener('keydown', this.updateSpeed)
    }

    calcSpeed() {
        var speed = this.charsInDepth * (60 / (this.speedDepth / 1000)) / 5
        return parseFloat(speed.toFixed(1))
    }

    reset() {
        this.speed = 0
        this.setState({
            speed: 0
        })
        this.charsInDepth = 0
        for (var i = 0; i < this.timeouts.length; i++) {
            clearTimeout(this.timeouts[i])
            this.timeouts = []
        }
    }

    render() {
        return (
            <SettingsContext.Consumer>
                {({theme}) => (
                    <TypingContext.Consumer>
                        {(value) => {
                            this.updateKeyTimes(value)
                            this.contextData = value
                            return (
                                <p className="Speed" style={{color: theme.color.speed}}>
                                    { this.state.speed }
                                </p>
                            )
                        }}
                    </TypingContext.Consumer>
                )}
            </SettingsContext.Consumer>
        )
    }
}

Speed.defaultProps = {
    units: "WPM",
    interval: 100
}