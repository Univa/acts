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
        this.speedDepth = 2500
        this.contextData = {
            lastCorrectKeyTime: 0
        }

        this.updateSpeed = this.updateSpeed.bind(this)
        this.timeouts = []
        this.keyTimes = []
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
            this.keyTimes.push(data.lastCorrectKeyTime)
            this.timeouts.push(setTimeout(() => {
                this.keyTimes = this.keyTimes.slice(1, this.keyTimes.length)
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
        var speed = this.keyTimes.length * (60 / (this.speedDepth / 1000)) / 5
        var speed2 = 1 / ((new Date().getTime() - this.keyTimes[0]) / 1000) * (this.keyTimes.length - 1) * 60 / 5
        if (isNaN(speed2)) {
            speed2 = speed
        }
        return parseFloat(((speed + speed2) / 2).toFixed(1))
    }

    reset() {
        this.speed = 0
        this.setState({
            speed: 0
        })
        this.keyTimes = []
        for (var i = 0; i < this.timeouts.length; i++) {
            clearTimeout(this.timeouts[i])
        }
        this.timeouts = []
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
                                <p className="Speed" style={{fontFamily: theme.font.speed, color: theme.color.speed}}>
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
    interval: 50
}