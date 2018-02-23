/**
 * Provides view-model implementation of the AZ MERIT Trend scores.
 */
(function() {

    "use strict";
    define([],
        function() {

            var azMeritTrendsVM = new function() {
                var self = this;

                /**
                 * [azMeritTrendsQueryFault]
                 * @param  getAzMERITBreakDown()
                 * @return {error}
                 */
                self.azMeritTrendsQueryFault = function(error) {
                    console.log(error.messaege);
                };

                /**
                 * [azMeritTrendsQueryHandler]
                 * @param  getAzMERITBreakDown()
                 * @return {}
                 */
                self.azMeritTrendsQueryHandler = function(results) {
                    var features = results.features;
                    // console.log(features);

                    var trendData = [];
                    $.each(features, function(index, item) {
                        var x = item.attributes;
                        var tInfo;
                        if (x.Subgroup === 0) {
                            tInfo = {
                                fy: x.FY,
                                content: x.ContentAreaDef,
                                Pl3: x.PCT_PL3,
                                Pl4: x.PCT_PL4,
                                Pass: x.PCT_Passing
                            }
                            trendData.push(tInfo);
                        }
                    });
                    // console.log(trendData);
                    self.azMERITtrendChart(trendData);
                };

                /**
                 * [azMERITAllSchoolsChart] - Shows all schools and their AzMERIT score in scatter chart.
                 * Data from [azSchoolsQueryHandler] via [getSchoolsData();]
                 * @return
                 */
                self.azMERITtrendChart = function(e) {
                    var info = e;
                    // console.log(info);

                    var elaInfo = [];
                    var mathInfo = [];
                    $.each(info, function(index, item) {
                        if (item.content === "ELA") {
                            elaInfo.push(item);
                        }
                        if (item.content === "MATH") {
                            mathInfo.push(item);
                        }
                    });
                    buildChartELA();
                    buildChartMATH();

                    function buildChartELA() {
                        $("#azMeritTrendsELA").kendoChart({
                            title: {
                                text: "AzMERIT ELA Student Score Trends"
                            },
                            theme: "Silver",
                            dataSource: {
                                data: elaInfo,
                                sort: {
                                    field: "fy",
                                    dir: "asc"
                                }
                            },
                            series: [{
                                type: "line",
                                width: 3,
                                style: "smooth",
                                name: "ELA",
                                field: "Pass",
                                categoryField: "fy",
                                color: "#007bc3"
                            }, {
                                type: "area",
                                style: "smooth",
                                data: [34, 38, 39],
                                name: "State Average ELA",
                                color: "#76b800"
                            }],
                            legend: {
                                position: "bottom",
                                visible: true
                            },
                            valueAxis: [{
                                title: {
                                    text: "AzMERIT ELA Score",
                                    font: "bold 14px Arial, Helvetica, sans-serif"
                                },
                                labels: {
                                    format: "{0:N0}%"
                                },
                                line: {
                                    visible: false
                                },
                                axisCrossingValue: 0
                            }],
                            categoryAxis: {
                                labels: {
                                    font: "bold 12px Arial, Helvetica, sans-serif"
                                },
                                line: {
                                    visible: false
                                }
                            },
                            tooltip: {
                                visible: true,
                                template: "#=series.name#<br />#= kendo.format('{0:N0}',value) #%"
                            },
                            chartArea: {
                                height: 275
                            }
                        });
                    }

                    function buildChartMATH() {
                        $("#azMeritTrendsMATH").kendoChart({
                            title: {
                                text: "AzMERIT MATH Student Score Trends"
                            },
                            theme: "Silver",
                            dataSource: {
                                data: mathInfo,
                                sort: {
                                    field: "fy",
                                    dir: "asc"
                                }
                            },
                            series: [{
                                type: "line",
                                width: 3,
                                style: "smooth",
                                name: "MATH",
                                field: "Pass",
                                categoryField: "fy",
                                color: "#76b800"
                            }, {
                                type: "area",
                                style: "smooth",
                                data: [35, 38, 40],
                                name: "State Average MATH",
                                color: "#007bc3"
                            }],
                            legend: {
                                position: "bottom",
                                visible: true
                            },
                            valueAxis: [{
                                title: {
                                    text: "AzMERIT MATH Score",
                                    font: "bold 14px Arial, Helvetica, sans-serif"
                                },
                                labels: {
                                    format: "{0:N0}%"
                                },
                                line: {
                                    visible: false
                                },
                                axisCrossingValue: 0
                            }],
                            categoryAxis: {
                                labels: {
                                    font: "bold 12px Arial, Helvetica, sans-serif"
                                },
                                line: {
                                    visible: false
                                }
                            },
                            tooltip: {
                                visible: true,
                                template: "#=series.name#<br />#= kendo.format('{0:N0}',value) #%"
                            },
                            chartArea: {
                                height: 275
                            }
                        });
                    }

                };
            }; // end azMeritTrendsVM
            return azMeritTrendsVM;
        } // end function
    );
}());
