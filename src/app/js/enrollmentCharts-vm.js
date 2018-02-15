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
                self.enrollmentChart = function(e, year) {
                    // console.log(e);
                    var enrollmentData = e;
                    var edata = e;
                    var selectedYear = year;

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

                    // var enrollmentTotals = [];
                    // $.each(enrollmentData, function(index, item) {
                    //     enrollmentTotals.push({
                    //         FY: item.fy,
                    //         Total: item.total
                    //     });
                    // });
                    // console.log(enrollmentTotals);

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
                                    // format: "{0:N0}%"
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
                            }
                        });
                    }
                };


            }; // end enrollmentChartVM
            return enrollmentChartVM;
        } // end function
    );
}());
