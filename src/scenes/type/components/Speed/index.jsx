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

        this.speedDepth = 1000
        this.charsInDepth = 0;
        this.contextData = {
            lastkeytime: 0
        }

        this.updateSpeed = this.updateSpeed.bind(this)
    }

    updateSpeed() {
        var new_speed = this.calcSpeed()
        if (new_speed !== this.state.speed) {
            this.setState({
                speed: new_speed
            })
            this.props.updateTypingContext({
                speed: new_speed 
            })
        }
    }

    componentDidMount() {
        if (this.props.updateMethod === "type") {
            document.addEventListener('keydown', this.updateSpeed);
        } else {
            this.interval = setInterval(this.updateSpeed, this.props.interval)
        }
    }

    updateKeyTimes(data) {
        if (data.lastkeytime !== this.contextData.lastkeytime) {
            this.charsInDepth++
            setTimeout(() => this.charsInDepth--, this.speedDepth)
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval)
        document.removeEventListener('keydown', this.updateSpeed)
    }

    calcSpeed() {
        let bullshit = 0
        if (Math.abs(new Date().getTime() - this.contextData.lastkeytime) > this.speedDepth) {
            bullshit = this.charsInDepth
        } else {
            bullshit = this.charsInDepth - ((this.props.interval / this.speedDepth) * ((new Date().getTime() - this.contextData.lastkeytime) / 1000 / (this.props.interval / this.speedDepth)))
        }
        var speed = Math.round(bullshit * (60 / (this.speedDepth / 1000)) / 5)
        return speed
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
                                <p class="Speed" style={{color: theme.color.speed}}>
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
    updateMethod: "time",
    interval: 100
}