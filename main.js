const color = Chart.helpers.color;
const chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

// Systematically add padding below the Chart.js legends.
Chart.plugins.register({
    id: 'paddingBelowLegends',
    beforeInit: function(chart, options) {
        chart.legend.afterFit = function() {
            this.height = this.height + 30;
        };
    }
});

/**
 * Plots a multi-colored doughnut chart.
 * 
 * @param {string} element  The DOM element to plot the chart onto.
 * @param {string} path     The path to the JSON file containing the chart data.
 * @param {string} label    The label of the chart.
 * @param {string} dataKey  The key of the data inside the JSON file.
 * @param {string} labelKey The key of the labels inside the JSON file.
 * @param {string} colorKey The key of the colors inside the JSON file.
 */
function doughnutChart(element, path, label, dataKey, labelKey, colorKey) {
    $.getJSON(path, data => {        
        const config = {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: data.map(r => r[dataKey]),
                    backgroundColor: data.map(r => color(chartColors[r[colorKey]]).alpha(0.5).rgbString()),
                    borderColor: data.map(r => chartColors[r[colorKey]]),
                    label: label,
                }],
                labels: data.map(r => r[labelKey]),
            },
            options: {
                responsive: true,
                tooltips: {
                    callbacks: {
                        label: item => {
                            const label = data[item.index][labelKey];
                            const prop = data[item.index][dataKey];
                            return `${label}: ${Math.floor(prop * 100)}%`;
                        }
                    }
                }
            }
        };

        const context = document.getElementById(element).getContext('2d');
        const chart = new Chart(context, config);
    });
}

/**
 * Plots a horizontal bar chart.
 *
 * @param {string} element  The DOM element to plot the chart onto.
 * @param {string} path     The path to the JSON file containing the chart data.
 * @param {string} label    The label of the chart.
 * @param {string} barColor The color to use for the bars.
 * @param {string} dataKey  The key of the data inside the JSON file.
 * @param {string} labelKey The key of the labels inside the JSON file.
 */
function horizontalBarChart(element, path, label, barColor, dataKey, labelKey) {
    $.getJSON(path, data => {        
        const config = {
            type: 'horizontalBar',
            data: {
                labels: data.map(r => r[labelKey]),
                datasets: [{
                    label: label,
                    backgroundColor: color(chartColors[barColor]).alpha(0.5).rgbString(),
                    borderColor: chartColors[barColor],
                    data: data.map(r => r[dataKey]),
                    borderWidth: 2,
                }]
            },
            options: {
                legend: {
                    display: false,
                },
            }
        };
      
        const context = document.getElementById(element).getContext('2d');
        const chart = new Chart(context, config);
    });
}

/**
 * Plots a multi-dataset bar chart.
 *
 * @param {string} element   The DOM element to plot the chart onto.
 * @param {array}  paths     The paths to the JSON files containing the chart data.
 * @param {array}  labels    The label of each dataset.
 * @param {array}  barColors The color to use for the bars of each dataset.
 * @param {string} dataKey   The key of the data inside the JSON file.
 * @param {string} labelKey  The key of the labels inside the JSON file.
 * @param {string} scale     The type of the Y scale, logarithmic by default.
 */
function multiBarChart(element, paths, labels, barColors, dataKey, labelKey, scale) {
    scale = scale || 'logarithmic';

    $.when(...paths.map(path => $.getJSON(path)))
     .done((...responses) => {
        const data = responses.map(r => r[0]);
        const config = {
            type: 'bar',
            data: {
                labels: data[0].map(r => r[labelKey]),
                datasets: data.map((d, i) => ({
                    label: labels[i],
                    backgroundColor: color(chartColors[barColors[i]]).alpha(0.5).rgbString(),
                    borderColor: chartColors[barColors[i]],
                    data: d.map(r => r[dataKey]),
                    borderWidth: 2,
                })),
            },
            options: {
                scales: {
                    yAxes: [{
                        type: scale,
                    }]
                }
            }
        };
      
        const context = document.getElementById(element).getContext('2d');
        const chart = new Chart(context, config);
    });
}

/**
 * Plots a logarithmic bar chart.
 *
 * @param {string} element  The DOM element to plot the chart onto.
 * @param {string} path     The path to the JSON file containing the chart data.
 * @param {string} label    The label of the chart.
 * @param {string} barColor The color to use for the bars.
 * @param {string} dataKey  The key of the data inside the JSON file.
 * @param {string} labelKey The key of the labels inside the JSON file.
 * @param {object} xAxis    Configuration options for the X axis.
 */
function barChart(element, path, label, barColor, dataKey, labelKey, xAxis) {
    $.getJSON(path, data => {        
        const config = {
            type: 'bar',
            data: {
                labels: data.map(r => r[labelKey]),
                datasets: [{
                    label: label,
                    backgroundColor: color(chartColors[barColor]).alpha(0.5).rgbString(),
                    borderColor: chartColors[barColor],
                    data: data.map(r => r[dataKey]),
                    borderWidth: 2,
                }]
            },
            options: {
                legend: {
                    display: false,
                },
                scales: {
                    xAxes: [xAxis],
                    yAxes: [{
                        type: 'logarithmic',
                        scaleLabel: {
                            display: true,
                            labelString: label,
                        }
                    }]
                }
            }
        };
      
        const context = document.getElementById(element).getContext('2d');
        const chart = new Chart(context, config);
    });
}

/**
 * Plots a Bokeh visualization.
 *
 * @param {string} element The DOM element to plot the visualization onto.
 * @param {string} path    The path to the JSON file containing the chart data.
 */
function bokehPlot(element, path) {
    $.getJSON(path, data => {
        Bokeh.embed.embed_item(data, element);
    });
}

$(function() {
    doughnutChart(
        'hashtag-alphabets',
        'data/hashtag-alphabets.json',
        'Proportion of use of the alphabet',
        'prop', 'alphabet', 'color',
    );

    horizontalBarChart(
        '10-most-used',
        'data/10-most-used.json',
        'Number of uses of the hashtag',
        'blue', 'count', 'tag'
    );

    horizontalBarChart(
        '10-most-expptwt',
        'data/10-most-expptwt.json',
        'Exposure per tweet of the hashtag',
        'blue', 'exposure_per_tweet', 'tag'
    );

    multiBarChart(
        'bbma-per-day',
        ['data/bts-day.json', 'data/btsbbmas-day.json'],
        ['Number of uses of #BTS per day', 'Number of uses of #BTSBBMAs per day'],
        ['orange', 'purple'], 'count', 'date'
    );

    multiBarChart(
        'cooccuring-per-day',
        ['data/miss-day.json', 'data/thailand-day.json', 'data/philippines-day.json'],
        [
            'Number of uses of #MissUniverse per day',
            'Number of uses of #Thailand per day',
            'Number of uses of #Philippines per day'
        ],
        ['orange', 'purple', 'blue'], 'count', 'date',
        'linear'
    );
    
    barChart(
        'nmp-per-month',
        'data/nmp-month.json',
        'Number of uses of #NotMyPresident',
        'blue', 'count', 'month', {},
    );

    barChart(
        'nmp-zoom',
        'data/nmp-zoom.json',
        'Number of uses of #NotMyPresident',
        'orange', 'count', 'date',
        {
            type: 'time',
            time: {
                unit: 'hour',
                displayFormats: {
                    hour: 'MMM DD, hA'
                }
            }
        }
    );

    bokehPlot('nmp-pagerank', 'data/nmp-pagerank.json');
    bokehPlot('btp-pagerank', 'data/btp-pagerank.json');
});