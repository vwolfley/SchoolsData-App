/**
 * Provides view-model implementation of the AZ MERIT scores.
 */
(function() {

    "use strict";
    define(["dojo/dom-construct",
            "appPackages/config"
        ],
        function(dc, appConfig) {

            var chronicChartsVM = new function() {
                var self = this;

                /**
                 * [subgroupChart description]
                 * @param  {[type]} chronicDataSub [description]
                 * @return {[type]}                [description]
                 */
                self.chronicAbsenceChart = function(e, year) {
                    var subGroupData = e;
                    var selectedYear = year;
                    // console.log(subGroupData);

                    var chronicSubInfo = [];
                    $.each(subGroupData, function(index, item) {
                        if (item.gradeLevel === 100) {
                            if (item.PCT_Absences < 0) {
                                item.PCT_Absences = 0;
                            }
                            chronicSubInfo.push(item);
                        }
                    });
                    // console.log(chronicSubInfo);

                    var chronicGradeInfo = [];
                    $.each(subGroupData, function(index, item) {
                        if (item.subGroup === 0) {
                            if (item.PCT_Absences < 0) {
                                item.PCT_Absences = 0;
                            }
                            if (item.gradeLevel === 100) {
                                item.gradeLevelDef = "All Students";
                            }
                            chronicGradeInfo.push(item);
                        }
                    });
                    // console.log(chronicGradeInfo);

                    var plotBand;
                    if (selectedYear === "2015") {
                        plotBand = appConfig.stateChronicRate2015;
                    }
                    if (selectedYear === "2016") {
                        plotBand = appConfig.stateChronicRate2016;
                    }
                    if (selectedYear === "2017") {
                        plotBand = appConfig.stateChronicRate2017;
                    }

                    var id;
                    var divName;
                    if (chronicSubInfo.length > 0) {
                        dc.destroy("replaceChronicChart1");
                        $("#chronicAbsenceChart1").show();
                        buildSubgroupChart(chronicSubInfo);
                    } else {
                        id = "replaceChronicChart1";
                        divName = "chronicAbsenceChart1";
                        $("#chronicAbsenceChart1").hide();
                        dc.destroy(id);
                        replaceDiv();
                    }
                    if (chronicGradeInfo.length > 0) {
                        dc.destroy("replaceChronicChart2");
                        $("#chronicAbsenceChart2").show();
                        buildGradeChart(chronicGradeInfo);
                    } else {
                        id = "replaceChronicChart2";
                        divName = "chronicAbsenceChart2";
                        $("#chronicAbsenceChart2").hide();
                        dc.destroy(id);
                        replaceDiv();
                    }

                    function replaceDiv() {
                        dc.create("span", {
                            id: id,
                            className: "replaceDiv",
                            innerHTML: "<p class='replace'>Currently no data available.</p>"
                        }, divName, "after");
                    }

                    function buildSubgroupChart(chronicSubInfo) {
                        $("#chronicSubChart").kendoChart({
                            title: {
                                text: "Student Chronic Absence Rates by Subgroup"
                            },
                            theme: "Silver",
                            legend: {
                                position: "bottom",
                                visible: false
                            },
                            seriesDefaults: {
                                type: "column",
                                gap: 0.1,
                                spacing: 0.1,
                                width: 25,
                                labels: {
                                    visible: true,
                                    background: "transparent",
                                    format: "{0}%"
                                },
                            },
                            dataSource: {
                                data: chronicSubInfo,
                                sort: {
                                    field: "subGroup",
                                    dir: "asc"
                                }
                            },
                            series: [{
                                name: "% Absence",
                                field: "PCT_Absences"
                            }],
                            valueAxis: {
                                title: {
                                    text: "% Chronic Absences",
                                    font: "bold 14px Arial, Helvetica, sans-serif"
                                },
                                max: 100,
                                min: 0,
                                majorUnit: 10,
                                plotBands: [{
                                    from: plotBand - 1,
                                    to: plotBand,
                                    color: "#c00",
                                    opacity: 0.8
                                }],
                                labels: {
                                    format: "{0}%"
                                },
                                line: {
                                    visible: false
                                },
                                axisCrossingValue: 0
                            },
                            categoryAxis: {
                                field: "subGroupDef",
                                title: {
                                    text: "Subgroups",
                                    font: "bold 14px Arial, Helvetica, sans-serif"
                                },
                                labels: {
                                    font: "bold 12px Arial, Helvetica, sans-serif"
                                },
                                line: {
                                    visible: false
                                },
                            },
                            tooltip: {
                                visible: true,
                                format: "{0}%",
                                template: "#= series.name # - #= value #%"
                            }
                        });
                    }
                    //end buildSubgroupChart

                    function buildGradeChart(chronicGradeInfo) {
                        $("#chronicGradeChart").kendoChart({
                            title: {
                                text: "Student Chronic Absence Rates by Grade"
                            },
                            theme: "Silver",
                            legend: {
                                position: "bottom",
                                visible: false
                            },
                            seriesDefaults: {
                                type: "column",
                                gap: 0.1,
                                spacing: 0.1,
                                width: 25,
                                labels: {
                                    visible: true,
                                    background: "transparent",
                                    format: "{0}%"
                                },
                            },
                            dataSource: {
                                data: chronicGradeInfo,
                                sort: {
                                    field: "gradeLevel",
                                    dir: "asc"
                                }
                            },
                            series: [{
                                name: "% Absence",
                                field: "PCT_Absences"
                            }],
                            valueAxis: {
                                title: {
                                    text: "% Chronic Absences",
                                    font: "bold 14px Arial, Helvetica, sans-serif"
                                },
                                max: 100,
                                min: 0,
                                plotBands: [{
                                    from: plotBand - 1,
                                    to: plotBand,
                                    color: "#c00",
                                    opacity: 0.8
                                }],
                                labels: {
                                    format: "{0}%"
                                },
                                line: {
                                    visible: false
                                },
                                axisCrossingValue: 0
                            },
                            categoryAxis: {
                                title: {
                                    text: "Grade Levels",
                                    font: "bold 14px Arial, Helvetica, sans-serif"
                                },
                                field: "gradeLevelDef",
                                labels: {
                                    font: "bold 12px Arial, Helvetica, sans-serif"
                                },
                                line: {
                                    visible: false
                                },
                            },
                            tooltip: {
                                visible: true,
                                format: "{0}%",
                                template: "#= series.name # - #= value #%"
                            }
                        });
                    }
                    // end chronicGradeChart

                };
                // end self.chronicAbsenceChart


            }; // end chronicChartsVM
            return chronicChartsVM;
        } // end function
    );
}());
