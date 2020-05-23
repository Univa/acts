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

    componentDidMount() {
        Chart.defaults.global.defaultFontFamily = "Jost";
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
                    fill: false
                }]
            },
            options: {
                responsive: true,
                elements: {
                    point: {
                        backgroundColor: "white",
                        borderColor: "transparent"
                    }
                },
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
                            label.push("Character: " + (this.props.data[tooltip.index].key === " " ? "Space" : this.props.data[tooltip.index].key))
                            label.push("Character no. " + (tooltip.index + 1))
                            label.push("Character type: " + (this.props.data[tooltip.index].keyType.charAt(0).toUpperCase() + this.props.data[tooltip.index].keyType.slice(1)))
                            label.push("Line no. " + (this.props.data[tooltip.index].line + 1))
                            label.push("Word no. " + (this.props.data[tooltip.index].word + 1))
                            label.push("Pressed at: " + tooltip.xLabel + "s")
                            label.push(data.datasets[tooltip.datasetIndex].label + ": " + tooltip.yLabel)
                            return label
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
