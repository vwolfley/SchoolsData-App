/**
 * Provides view-model implementation of the Enrollment Subgroups.
 */
(function() {

    "use strict";
    define([],
        function() {

            var enrollmentSubgroupsVM = new function() {
                var self = this;

                /**
                 * [enrollmentSubgroupChart] - Shows all subgroups in the school.
                 * Data from [enrollmentRaceQueryHandler] via [getEnrollmentData();]
                 * @return
                 */
                self.enrollmentSubgroupChart = function(e) {
                    var info = e;
                    console.log(info);

                    buildChart();

                    function buildChart() {
                        $("#enrollmentSubgroup").kendoChart({
                            title: {
                                text: "Enrollment Subgroup Breakdown"
                            },
                            theme: "Silver",
                            dataSource: {
                                data: info,
                            },
                            seriesDefaults: {
                                type: "bar",
                                labels: {
                                    visible: true,
                                    background: "transparent"
                                }
                            },
                            series: [{
                                field: "total",
                                categoryField: "subgroup",
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
                $(window).resize(function() {
                    $("#enrollmentSubgroup").data("kendoChart").refresh();
                });

            }; // end enrollmentSubgroupsVM
            return enrollmentSubgroupsVM;
        } // end function
    );
}());
