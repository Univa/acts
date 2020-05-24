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

    componentDidMount() {
        Chart.defaults.global.defaultFontFamily = "Jost";
        if (this.props.data[0] === undefined) {
            this.props.data[0] = {
                speed: 0,
                time: 0,
                key: "None",
                keyType: "N/A",
                line: 0,
                word: 0
            }
        }
        let startTime = this.props.data[0].time
        let data = this.props.data.map(pt => ({x: (pt.time - startTime) / 1000, y: pt.speed}))
        console.log(data)
        this.config = {
            type: "scatter",
            data: {
                datasets: [{
                    label: "WPM",
                    borderColor: "white",
                    showLine: true,
                    data: data,
                    fill: false,
                    pointBackgroundColor: [],
                    pointBorderColor: []
                }]
            },
            options: {
                responsive: true,
                tooltips: {
                    displayColors: false,
                    mode: "index",
                    intersect: false,
                    bodyFontSize: 16,
                    bodyFontColor: "white",
                    xPadding: 10,
                    yPadding: 10,
                    callbacks: {
                        label: (tooltip, data) => {
                            var label = []
                            console.log(this.graphContent)
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
                    mode: "index",
                    intersect: false,
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
                            fontColor: "white"
                        },
                        gridLines: {
                            drawOnChartArea: false,
                            color: "white"
                        },
                        ticks: {
                            padding: 5,
                            fontColor: "white",
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
                            fontColor: "white"
                        },
                        gridLines: {
                            drawOnChartArea: false,
                            color: "white"
                        },
                        ticks: {
                            padding: 5,
                            fontColor: "white",
                            min: 0
                        }
                    }]
                }
            }
        }

        this.setState({
            isLoaded: true
        })

        this.graphContent = new Chart(this.graphRef.current, this.config)
    }

    componentDidUpdate(prevProps) {
        console.log(this.props.hoveredCoordinates)
        // this stringify is probably bad practice for checking object equality, but it works so ill keep it
        if (JSON.stringify(this.props.hoveredCoordinates) !== JSON.stringify(prevProps.hoveredCoordinates)) {
            let {line, word, char} = this.props.hoveredCoordinates
            this.closeTooltip(this.index)
            this.index = this.props.data.findIndex(x => x.line === line && x.word === word && x.char === char)
            if (this.index !== -1) { this.openTooltip(this.index) }
        }
    }
    
    render() {
        return (
            <SettingsContext.Consumer>
                {({theme}) => {
                    if (this.state.isLoaded) {
                        this.config.data.datasets[0].borderColor = theme.color.correct
                        this.config.options.scales.xAxes[0].scaleLabel.fontColor = theme.color.notTyped
                        this.config.options.scales.yAxes[0].scaleLabel.fontColor = theme.color.notTyped
                        this.config.options.scales.xAxes[0].gridLines.color = theme.color.notTyped
                        this.config.options.scales.yAxes[0].gridLines.color = theme.color.notTyped
                        this.config.options.scales.xAxes[0].ticks.fontColor = theme.color.notTyped
                        this.config.options.scales.yAxes[0].ticks.fontColor = theme.color.notTyped
                        this.config.options.elements.point.backgroundColor = theme.color.correct
                        this.config.options.tooltips.bodyFontColor = theme.color.notTyped
                        for (var i = 0; i < this.props.data.length; i++) {
                            this.props.data[i].keyType === "incorrect" ? this.config.data.datasets[0].pointBackgroundColor[i] = theme.color.incorrect : this.config.data.datasets[0].pointBackgroundColor[i] = theme.color.correct
                            this.props.data[i].keyType === "incorrect" ? this.config.data.datasets[0].pointBorderColor[i] = theme.color.incorrect : this.config.data.datasets[0].pointBorderColor[i] = theme.color.correct
                        }
                        this.graphContent.update()
                    }
                    return (
                        <div className="Graph">
                            <canvas className="graph-content" ref={ this.graphRef }></canvas>
                        </div>
                    )
                }}
            </SettingsContext.Consumer>
        )
    }
}
