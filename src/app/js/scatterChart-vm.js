/**
 * Provides view-model implementation of the AZ MERIT scores.
 */
(function() {

    "use strict";
    define([],
        function() {

            var scatterChartVM = new function() {
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
                self.azMERITscatterChart = function(e, selectedYear) {
                    var info = e;
                    // console.log(info);

                    $.each(info, function(index, item) {

                        if (item.ELAp < 0) {
                            item.ELAp = 0;
                        }
                        if (item.MATHp < 0) {
                            item.MATHp = 0
                        }
                    });

                    $("#azMERITchartSchools").kendoChart({
                        theme: "Silver",
                        title: {
                            text: "AzMERIT Schools Percent Passing" + " " + selectedYear
                        },
                        dataSource: {
                            data: info,
                            filter: {
                                field: "rankSort",
                                operator: "gte",
                                value: 0
                            },
                            sort: {
                                field: "rankSort",
                                dir: "asc"
                            },
                            group: {
                                field: "rankSort"
                            }
                        },
                        legend: {
                            position: "bottom"
                        },
                        seriesDefaults: {
                            type: "scatter"
                        },
                        series: [{
                            xField: "ELAp",
                            yField: "MATHp",
                            name: "#= group.items[0].rank #",
                            tooltip: {
                                visible: true,
                                template: "${ dataItem.sName } <br>ELA: ${ dataItem.ELAp }% <br>MATH: ${ dataItem.MATHp }% "
                            }
                        }, {
                            name: self.schoolData.sName,
                            data: [
                                [self.schoolData.ELAp, self.schoolData.MATHp],
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
                                template: "${series.name}  <br>ELA: ${value.x}% <br>MATH: ${value.y}% "
                            }
                        }],
                        seriesColors: ["#028900", "#0057e7", "#9e379f", "#ffa700", "#d62d20", "#777777"],
                        xAxis: {
                            max: 100,
                            title: {
                                text: "ELA Percent Passing",
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
                                text: "Math Percent Passing",
                                font: "bold 14px Arial, Helvetica, sans-serif"
                            },
                            labels: {
                                template: "${ value }%"
                            }
                        },

                    });
                };

                $(window).resize(function() {
                    $("#azMERITchartSchools").data("kendoChart").refresh();
                });

            }; // end scatterChartVM
            return scatterChartVM;
        } // end function
    );
}());
