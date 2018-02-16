/**
 * Provides view-model implementation of the AZ MERIT scores.
 */
(function() {

    "use strict";
    define([],
        function() {

            var frlScatterChartVM = new function() {
                var self = this;

                /**
                 * [azMERITAllSchoolsChart] - Shows all schools and their AzMERIT score in scatter chart.
                 * Data from [azSchoolsQueryHandler] via [getSchoolsData();]
                 * @return
                 */
                self.frlScatterChart = function(e, selectedYear) {
                    var info = e;
                    // console.log(info);

                    $.each(info, function(index, item) {
                        if (item.score < 0) {
                            item.score = null;
                        }
                        if (item.frl < 0) {
                            item.frl = null;
                        }
                    });

                    buildChart();
                    function buildChart() {
                        $("#frlScatterChart").kendoChart({
                            theme: "Silver",
                            title: {
                                text: "AzMERIT Schools Percent Passing" + " " + selectedYear
                            },
                            dataSource: {
                                data: info,
                            },
                            legend: {
                                position: "bottom"
                            },
                            seriesDefaults: {
                                type: "scatter"
                            },
                            series: [{
                                xField: "frl",
                                yField: "score",
                            }],
                            xAxis: {
                                min: 0,
                                max: 100,
                                title: {
                                    text: "Free & Reduced Lunch Percentage",
                                    font: "bold 14px Arial, Helvetica, sans-serif"
                                },
                                labels: {
                                    template: "${ value }%"
                                }
                            },
                            yAxis: {
                                min: 0,
                                max: 100,
                                title: {
                                    text: "Average AzMERIT Percent Passing Score",
                                    font: "bold 14px Arial, Helvetica, sans-serif"
                                },
                                labels: {
                                    template: "${ value }%"
                                }
                            },
                            tooltip: {
                                visible: true,
                                template: "${ dataItem.sName } <br>FRL: ${ dataItem.frl }% <br>AzMERIT: ${ dataItem.score }% "
                            }
                        });
                    }

                };
            }; // end frlScatterChartVM
            return frlScatterChartVM;
        } // end function
    );
}());
