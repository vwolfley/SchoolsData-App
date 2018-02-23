/**
 * Provides view-model implementation of schools enrollment totals.
 */
(function() {

    "use strict";
    define([],
        function() {

            var enrollmentChartVM = new function() {
                var self = this;

                /**
                 * [enrollmentChart] - Shows school enrollment chart.
                 * Data from [enrollmentDataQueryHandler] via [getEnrollmentData();]
                 * @return
                 */
                self.enrollmentChart = function(e) {
                    // console.log(e);
                    var enrollmentData = e;
                    var edata = e;

                    var change = [null, ];
                    var p1 = [];
                    var p2 = [];
                    for (var i = 0; i < (edata.length - 1); i++) {
                        var y1 = edata[i].total;
                        var y2 = edata[i + 1].total;
                        p1.push(y1);
                        p2.push(y2);
                        var cx = Math.round(((y2 - y1) / (y1)) * 100);
                        change.push(cx);
                    }
                    // console.log(change);

                    var xmin = Math.min.apply(Math, change);
                    var xmax = Math.max.apply(Math, change);
                    // console.log("min: " + xmin);
                    // console.log("max: " + xmax);

                    // var cc = Math.abs(xmin) + Math.abs(xmax);
                    var cc = Math.max(Math.abs(xmin), Math.abs(xmax));

                    var cmax = Math.ceil((cc) / 10) * 10;
                    var cmin = -cmax;
                    // console.log(cc);
                    // console.log(cmin, cmax);

                    if (xmin === 0) {
                        cmin = -10;
                    }
                    if (xmax === 0) {
                        cmax = 10;
                    }
                    // console.log(cmin, cmax);

                    buildChart();

                    function buildChart() {
                        $("#enrollmentChart").kendoChart({
                            title: {
                                text: "Student Enrollment"
                            },
                            theme: "Silver",
                            seriesDefaults: {},
                            dataSource: {
                                data: enrollmentData
                            },
                            series: [{
                                type: "column",
                                name: "Total Enrollment",
                                field: "total",
                                tooltip: {
                                    template: "#= series.name #: #= kendo.format('{0:N0}', value) #"
                                },
                                labels: {
                                    visible: true,
                                    background: "transparent",
                                    format: "{0:N0}"
                                }
                            }, {
                                type: "line",
                                name: "Enrollment Change",
                                data: change,
                                color: "#ff0000",
                                axis: "change",
                                tooltip: {
                                    template: "#= series.name #: #= kendo.format('{0:N0}', value) #%"
                                },
                                labels: {
                                    visible: true,
                                    background: "transparent",
                                    format: "{0:N0}%",
                                    position: "below"
                                }
                            }],
                            legend: {
                                position: "bottom",
                                visible: true
                            },
                            valueAxis: [{
                                title: {
                                    text: "Students",
                                    font: "bold 14px Arial, Helvetica, sans-serif"
                                },
                                min: 0,
                                labels: {
                                    format: "{0:N0}"
                                },
                                line: {
                                    visible: false
                                },
                                axisCrossingValue: 0
                            }, {
                                name: "change",
                                title: {
                                    text: "Percent Change %",
                                    font: "bold 14px Arial, Helvetica, sans-serif"
                                },
                                min: cmin,
                                max: cmax,
                                labels: {
                                    format: "{0:N0}%"
                                },
                            }],
                            categoryAxis: {
                                field: "fy",
                                labels: {
                                    font: "bold 12px Arial, Helvetica, sans-serif"
                                },
                                line: {
                                    visible: false
                                },
                                axisCrossingValues: [0, 10]
                            },
                            tooltip: {
                                visible: true
                            },
                            chartArea: {
                                height: 350
                            }
                        });
                    }
                };

                /**
                 * [enrollmentCohorts] - Shows school enrollment by .
                 * Data from [enrollmentDataQueryHandler] via [getEnrollmentData();]
                 * @return
                 */
                self.enrollmentCohorts = function(e) {
                    var enrollmentData = e;
                    // console.log(enrollmentData);

                    var cohorts = [];
                    $.each(enrollmentData, function(index, item) {

                        var c1 = (item.KG + item.G1 + item.G2);
                        var c2 = (item.G3 + item.G4 + item.G5);
                        var c3 = (item.G6 + item.G7 + item.G8);
                        var c4 = (item.G9 + item.G10 + item.G11 + item.G12);

                        cohorts.push({
                            fy: item.FY,
                            ck2: (c1 != 0) ? c1 : null,
                            c35: (c2 != 0) ? c2 : null,
                            c68: (c3 != 0) ? c3 : null,
                            c912: (c4 != 0) ? c4 : null,
                        });
                    });
                    // console.log(cohorts);

                    buildCohortChart();

                    function buildCohortChart() {
                        $("#enrollmentCohorts").kendoChart({
                            title: {
                                text: "Student Enrollment by Cohorts"
                            },
                            theme: "Silver",
                            seriesDefaults: {
                                type: "line",
                                style: "smooth"
                            },
                            dataSource: {
                                data: cohorts,
                                sort: {
                                    field: "fy",
                                    dir: "asc"
                                }
                            },
                            series: [{
                                field: "ck2",
                                name: "KG-2"
                            }, {
                                field: "c35",
                                name: "3-5"
                            }, {
                                field: "c68",
                                name: "6-8"
                            }, {
                                field: "c912",
                                name: "9-12"
                            }],
                            legend: {
                                position: "bottom",
                                visible: true
                            },
                            valueAxis: [{
                                title: {
                                    text: "Students",
                                    font: "bold 14px Arial, Helvetica, sans-serif"
                                },
                                labels: {
                                    format: "{0:N0}"
                                },
                                line: {
                                    visible: false
                                },
                                axisCrossingValue: 0
                            }],
                            categoryAxis: {
                                field: "fy",
                                labels: {
                                    font: "bold 12px Arial, Helvetica, sans-serif"
                                },
                                line: {
                                    visible: false
                                }
                            },
                            tooltip: {
                                visible: true,
                                template: "Cohort: #=series.name#<br />#= kendo.format('{0:N0}',value) #"
                            },
                            chartArea: {
                                height: 350
                            }
                        });
                    }
                };

            }; // end enrollmentChartVM
            return enrollmentChartVM;
        } // end function
    );
}());
