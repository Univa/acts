import React from 'react'
import Chart from 'chart.js'
import './styles.scss'
import { SettingsContext } from '../../../../settings-context'

export default class Graph extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false
        }

        Chart.defaults.global.defaultFontFamily = "Jost";

        var data
        if (this.props.data[0] === undefined) {
            data = []
        } else {
            var startTime = this.props.data[0].time
            data = this.props.data.map(pt => ({x: (pt.time - startTime) / 1000, y: pt.speed}))
        }

        var approximation = this.genApproximation(data)
        
        if (this.props.mode === "static") {
            this.config = {
                type: "scatter",
                data: {
                    datasets: [{
                        label: "WPM",
                        data: data,
                        fill: false,
                        pointBackgroundColor: [],
                        pointBorderColor: [],
                        pointRadius: 2.5
                    }, {
                        label: "Approximation",
                        data: approximation,
                        fill: false,
                        showLine: true,
                        borderColor: "transparent",
                        pointRadius: 0,
                        pointHitRadius: 0,
                        pointHoverRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    tooltips: {
                        displayColors: false,
                        mode: "point",
                        bodyFontSize: 16,
                        bodyFontColor: "transparent",
                        xPadding: 10,
                        yPadding: 10,
                        filter: (tooltip) => { return tooltip.datasetIndex === 0 },
                        callbacks: {
                            label: (tooltip, data) => {
                                var label = []
                                label.push("Character: " + (this.props.data[tooltip.index].key === " " ? "Space" : this.props.data[tooltip.index].key))
                                label.push("Character no. " + (tooltip.index + 1))
                                label.push("Character type: " + (this.props.data[tooltip.index].keyType.charAt(0).toUpperCase() + this.props.data[tooltip.index].keyType.slice(1)))
                                label.push("Line no. " + (this.props.data[tooltip.index].line + 1))
                                label.push("Word no. " + (this.props.data[tooltip.index].word + 1))
                                label.push(this.addOrdinalSuffix(this.props.data[tooltip.index].char + 1) + " character of the word")
                                label.push("Pressed at: " + tooltip.xLabel + "s")
                                label.push(data.datasets[tooltip.datasetIndex].label + ": " + tooltip.yLabel)
                                return label
                            }
                        }
                    },
                    hover: {
                        mode: "point",
                        onHover: (e, elements) => {
                            let hoverData
                            if (elements[0] === undefined) {
                                if (-1 !== this.prevIndex) {
                                    hoverData = {}
                                    this.props.hoverHandler(hoverData)
                                }
                                this.prevIndex = -1
                            } else {
                                if (elements[0]._index !== this.prevIndex) {
                                    hoverData = this.props.data[elements[0]._index]
                                    this.props.hoverHandler(hoverData)
                                }
                                this.prevIndex = elements[0]._index
                            }
                        }
                    },
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            afterTickToLabelConversion: (instance) => {
                                instance.ticks[0] = null;
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "Time (s)",
                                fontColor: "transparent"
                            },
                            gridLines: {
                                drawOnChartArea: false,
                                color: "transparent"
                            },
                            ticks: {
                                padding: 5,
                                fontColor: "transparent",
                                min: 0,
                                max: this.props.xScale
                            }
                        }],
                        yAxes: [{
                            display: true,
                            afterTickToLabelConversion: (instance) => {
                                instance.ticks[instance.ticks.length - 1] = null;
                                instance.ticksAsNumbers[instance.ticksAsNumbers.length - 1] = null;
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "WPM",
                                fontColor: "transparent"
                            },
                            gridLines: {
                                drawOnChartArea: false,
                                color: "transparent"
                            },
                            ticks: {
                                padding: 5,
                                fontColor: "transparent",
                                min: 0
                            }
                        }]
                    }
                }
            }
        } else {
            this.config = {
                type: "scatter",
                data: {
                    datasets: [{
                        label: "WPM",
                        data: data,
                        fill: false,
                        pointBackgroundColor: [],
                        pointBorderColor: [],
                        pointRadius: 2.5,
                        pointHitRadius: 0,
                        pointHoverRadius: 2.5
                    }, {
                        label: "Approximation",
                        data: approximation,
                        fill: false,
                        showLine: true,
                        borderColor: "transparent",
                        pointRadius: 0,
                        pointHitRadius: 0,
                        pointHoverRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    tooltips: {
                        enabled: false
                    },
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            display: false,
                            scaleLabel: {
                                display: true,
                            },
                            gridLines: {
                                drawOnChartArea: false,
                                color: "transparent"
                            },
                            ticks: {
                                padding: 5,
                                fontColor: "transparent",
                                min: 0,
                                max: this.props.xScale
                            }
                        }],
                        yAxes: [{
                            display: false,
                            afterTickToLabelConversion: (instance) => {
                                instance.ticks[instance.ticks.length - 1] = null;
                                instance.ticksAsNumbers[instance.ticksAsNumbers.length - 1] = null;
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "WPM",
                                fontColor: "transparent"
                            },
                            gridLines: {
                                drawOnChartArea: false,
                                color: "transparent"
                            },
                            ticks: {
                                padding: 5,
                                fontColor: "transparent",
                                min: 0
                            }
                        }]
                    }
                }
            }
        }
        
        this.graphRef = React.createRef()
    }

    openTooltip(index) {
        if (this.graphContent.tooltip._active === undefined) {
            this.graphContent.tooltip._active = []
        }

        var item = this.graphContent.getDatasetMeta(0).data[index]

        // don't really need this for loop but putting it here just in case
        // this just makes the function return if the tooltip is already active
        for (var i = 0; i < this.graphContent.tooltip._active.length; i++) {
            if (item._index === this.graphContent.tooltip._active[i]._index) { return }
        }

        // otherwise activate it
        this.graphContent.tooltip._active.push(item)
        this.graphContent.tooltip.update(true)
        this.graphContent.draw()
    }

    closeTooltip(index) {
        if (this.graphContent.tooltip._active === undefined || this.graphContent.tooltip._active.length === 0) {
            return
        }

        for (var i = 0; i < this.graphContent.tooltip._active.length; i++) {
            if (this.graphContent.getDatasetMeta(0).data[index]._index === this.graphContent.tooltip._active[i]._index) {
                this.graphContent.tooltip._active.splice(i, 1)
                break
            }
        }
        this.graphContent.tooltip.update(true)
        this.graphContent.draw()
    }

    addOrdinalSuffix(num) {
        var j = num % 10
        var k = num % 100
        var suffix = "th"
        if (j === 1 && k !== 11) {
            suffix = "st"
        }
        if (j === 2 && k !== 12) {
            suffix = "nd"
        }
        if (j === 3 && k !== 13) {
            suffix = "rd"
        }
        return num + suffix
    }

    genApproximation(data, resolution = 20) {
        var section_size = this.props.xScale / resolution
        var section = 1
        var sum = 0
        var item_count = 0
        var approximation_data = [{x:0,y:0}]
        for (var i = 0; i < data.length; i++) {
            if (data[i].x > section_size * section || i === data.length - 1) {
                approximation_data.push({
                    x: (section - 1) * section_size + section_size / 2,
                    y: sum / item_count
                })
                section++
                sum = 0
                item_count = 0
            }
            sum += data[i].y
            item_count++
        }
        return approximation_data
    }

    componentDidMount() {
        this.setState({
            isLoaded: true
        })

        this.graphContent = new Chart(this.graphRef.current, this.config)
    }

    componentDidUpdate(prevProps) {
        // this stringify is probably bad practice for checking object equality, but it works so ill keep it
        if (JSON.stringify(this.props.hoveredCoordinates) !== JSON.stringify(prevProps.hoveredCoordinates)) {
            let {line, word, char} = this.props.hoveredCoordinates
            this.closeTooltip(this.index)
            this.index = this.props.data.findIndex(x => x.line === line && x.word === word && x.char === char)
            if (this.index !== -1) { this.openTooltip(this.index) }
        }
        if (this.props.mode === "live" && JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data)) {
            let data = []
            if (this.props.data.length !== 0) {
                data = this.props.data.map(pt => ({x: (pt.time - this.props.data[0].time) / 1000, y: pt.speed}))
            }
            this.config.data.datasets[0].data = data
            this.config.data.datasets[1].data = this.genApproximation(data)
            this.graphContent.update()
        }
        if (this.props.mode === "live" && this.props.xScale !== prevProps.xScale) {
            this.config.options.scales.xAxes[0].ticks.max = this.props.xScale
            this.graphContent.update()
        }
    }
    
    render() {
        return (
            <SettingsContext.Consumer>
                {({theme}) => {
                    if (this.state.isLoaded) {
                        this.config.data.datasets[1].borderColor = theme.color.notTyped
                        this.config.options.scales.xAxes[0].scaleLabel.fontColor = theme.color.notTyped
                        this.config.options.scales.yAxes[0].scaleLabel.fontColor = theme.color.notTyped
                        this.config.options.scales.xAxes[0].gridLines.color = theme.color.notTyped
                        this.config.options.scales.yAxes[0].gridLines.color = theme.color.notTyped
                        this.config.options.scales.xAxes[0].ticks.fontColor = theme.color.notTyped
                        this.config.options.scales.yAxes[0].ticks.fontColor = theme.color.notTyped
                        this.config.options.tooltips.bodyFontColor = theme.color.notTyped
                        Chart.defaults.global.defaultFontFamily = theme.font.graph;
                        for (var i = 0; i < this.props.data.length; i++) {
                            this.props.data[i].keyType === "incorrect" ? this.config.data.datasets[0].pointBackgroundColor[i] = theme.color.incorrect : this.config.data.datasets[0].pointBackgroundColor[i] = theme.color.correct
                            this.props.data[i].keyType === "incorrect" ? this.config.data.datasets[0].pointBorderColor[i] = theme.color.incorrect : this.config.data.datasets[0].pointBorderColor[i] = theme.color.correct
                        }
                        this.graphContent.update()
                    }
                    return (
                        <div className="Graph" style={ this.props.style }>
                            <canvas className="graph-content" ref={ this.graphRef }></canvas>
                        </div>
                    )
                }}
            </SettingsContext.Consumer>
        )
    }
}

Graph.defaultProps = {
    xScale: 10,
    data: [],
    mode: "static",
    hoverHandler: (e) => {},
    hoveredCoordinates: {
        line: undefined,
        word: undefined,
        char: undefined
    }
}