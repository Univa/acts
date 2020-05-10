import React from 'react'
import './styles.scss'
import { SettingsContext } from '../../../../settings-context'

export default class Timer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            time: props.starttime,
            running: false
        }

        this.updateTimer = this.updateTimer.bind(this)
    }

    updateTimer() {
        this.setState((prevState) => ({
            time: this.props.mode === "countdown" ? prevState.time - 1 : prevState.time + 1
        }))
    }

    start() {
        var interval = 0;
        // calculate the interval in ms
        if (this.props.units === "s") {
            interval = this.props.interval * 1000
        } else if (this.props.units === "ms") {
            interval = this.props.interval;
        }
        this.setState({
            running: true
        })
        this.interval = setInterval(this.updateTimer, interval)
    }

    stop() {
        this.setState({
            running: false
        })
        clearInterval(this.interval)
        this.props.stopHandler()
    }    

    componentDidMount() {
        if (this.props.running === true) {
            this.start()
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    componentDidUpdate(prevProps) {
        // start or end the timer
        if ((this.props.running && !this.state.running) && !prevProps.running) {
            this.start()
        } else if ((!this.props.running && this.state.running) && prevProps.running) {
            this.stop()
        } else if (this.state.time === 0 && this.state.running) {
            this.stop()
        }
    }

    render() {
        return (
            <SettingsContext.Consumer>
                {({theme}) => (
                    <p class="Timer" style={{color: theme.color.timer}}>{ this.state.time }</p>
                )}
            </SettingsContext.Consumer>
        )
    }
}

Timer.defaultProps = {
    starttime: 60,
    mode: "countdown",
    units: "s",
    interval: 1
}
