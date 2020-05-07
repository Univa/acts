import React from 'react'
import './styles.scss'

export class Timer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            time: props.starttime,
            running: false
        }
    }

    start() {
        console.log("start")
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
        this.interval = setInterval(() => this.setState((prevState) => ({
            time: this.props.mode === "countdown" ? prevState.time - 1 : prevState.time + 1
        })), interval)
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
            <p class="Timer">{ this.state.time }</p>
        )
    }
}

Timer.defaultProps = {
    starttime: 60,
    mode: "countdown",
    units: "s",
    interval: 1
}
