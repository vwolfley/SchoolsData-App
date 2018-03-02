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
                 * [schoolSelected description]
                 * @param  {[type]} e [description]
                 * @return {[type]}   [description]
                 */
                self.schoolSelected = function(e) {
                    self.schoolData = e;
                    // console.log(self.schoolData);
                };

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
                                tooltip: {
                                    visible: true,
                                    template: "${ dataItem.sName } <br>FRL: ${ dataItem.frl }% <br>AzMERIT: ${ dataItem.score }% "
                                }
                            }, {
                                name: self.schoolData.sName,
                                data: [
                                    [self.schoolData.frlp, self.schoolData.score],
                                ],
                                markers: {
                                    visible: true,
                                    size: 15,
                                    background: "",
                                    border: {
                                        width: 3,
                                        color: "#00FF99"
                                    }
                                },
                                tooltip: {
                                    visible: true,
                                    background: "#00FF99",
                                    template: "${series.name}  <br>FRL: ${value.x}% <br>AzMERIT: ${value.y}% "
                                }
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
                            }
                        });
                    }
                };
                $(window).resize(function() {
                    $("#frlScatterChart").data("kendoChart").refresh();
                });

            }; // end frlScatterChartVM
            return frlScatterChartVM;
        } // end function
    );
}());
