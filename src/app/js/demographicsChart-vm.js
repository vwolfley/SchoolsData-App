/**
 * Provides view-model implementation of the student demographics.
 */
(function() {

    "use strict";
    define([],
        function() {

            var demographicsChartVM = new function() {
                var self = this;

                /**
                 * [azMERITAllSchoolsChart] - Shows all schools and their AzMERIT score in scatter chart.
                 * Data from [azSchoolsQueryHandler] via [getSchoolsData();]
                 * @return
                 */
                self.studentDemoChart = function(e) {
                    var info = e;
                    // console.log(info);

                    var raceValues = ["White", "Hispanic", "Black", "Asian", "Native American", "Pacific Islander", "Two or More"];
                    var raceColors = ["#007bc3", "#76b800", "#ffae00", "#ef4c00", "#a419b7", "#430B62", "#2A620B"];

                    var raceEnrollment = [];
                    $.each(info, function(index, item) {
                        if (item.Subgroup === 0) {
                            raceEnrollment.push({
                                fy: item.FY,
                                white: item.White,
                                hispanic: item.Hispanic,
                                black: item.Black,
                                asian: item.Asian,
                                native: item.NativeAmerican,
                                islander: item.PacificIslander,
                                more: item.TwoOrMore,
                                total: item.Total
                            });
                        }
                    });
                    // console.log(raceEnrollment);

                    var raceInfo = raceEnrollment[0];
                    // console.log(raceInfo);

                    var raceCat = [{
                        type: "White",
                        value: raceInfo.white,
                        explode: false,
                        percent: (raceInfo.white / raceInfo.total),
                        color: "#007bc3"
                    }, {
                        type: "Hispanic",
                        value: raceInfo.hispanic,
                        explode: false,
                        percent: (raceInfo.hispanic / raceInfo.total),
                        color: "#76b800"
                    }, {
                        type: "Black",
                        value: raceInfo.black,
                        explode: false,
                        percent: (raceInfo.black / raceInfo.total),
                        color: "#ffae00"
                    }, {
                        type: "Asian",
                        value: raceInfo.asian,
                        explode: false,
                        percent: (raceInfo.asian / raceInfo.total),
                        color: "#ef4c00"
                    }, {
                        type: "Native American",
                        value: raceInfo.native,
                        explode: false,
                        percent: (raceInfo.native / raceInfo.total),
                        color: "#a419b7"
                    }, {
                        type: "Pacific Islander",
                        value: raceInfo.islander,
                        explode: false,
                        percent: (raceInfo.islander / raceInfo.total),
                        color: "#430B62"
                    }, {
                        type: "Two or More",
                        value: raceInfo.more,
                        explode: false,
                        percent: (raceInfo.more / raceInfo.total),
                        color: "#2A620B"
                    }];
                    // console.log(raceCat);

                    var data = [];
                    for (var i = 0; i < raceCat.length; i++) {
                        if (raceCat[i].value !== null) {
                            data.push(raceCat[i]);
                        }
                    }
                    // console.log(data);

                    buildChart();

                    function buildChart() {

                        $("#enrollmentRaceSchool").kendoChart({
                            title: {
                                text: "School Student Demographics"
                            },
                            theme: "Silver",
                            dataSource: {
                                data: data,
                            },
                            legend: {
                                position: "right"
                            },
                            chartArea: {
                                background: "",
                                margin: 1,
                                height: 350
                            },
                            seriesDefaults: {
                                labels: {
                                    visible: true,
                                    align: "circle",
                                    distance: 25,
                                    background: "transparent",
                                    template: "#= category #"
                                }
                            },
                            series: [{
                                type: "pie",
                                startAngle: 90,
                                field: "value",
                                categoryField: "type",
                                explodeField: "explode",
                                color: "color"
                            }],
                            // seriesColors: ["#007bc3", "#76b800", "#ffae00", "#ef4c00", "#a419b7", "#430B62", "#2A620B"],
                            tooltip: {
                                visible: true,
                                template: "#= category #<br />#= kendo.format('{0:N0}', value) #<br />#= kendo.format('{0:P1}',dataItem.percent) #"
                            }
                        });
                    }

                };

                self.districtDemoChart = function(e) {
                    var info = e;
                    // console.log(info);

                    var raceValues = ["White", "Hispanic", "Black", "Asian", "Native American", "Pacific Islander", "Two or More"];
                    var raceColors = ["#007bc3", "#76b800", "#ffae00", "#ef4c00", "#a419b7", "#430B62", "#2A620B"];

                    var raceEnrollment = [];
                    var test = [];
                    $.each(info, function(index, item) {
                        if (item.Subgroup === 0) {
                            raceEnrollment.push({
                                fy: item.FY,
                                white: item.White,
                                hispanic: item.Hispanic,
                                black: item.Black,
                                asian: item.Asian,
                                native: item.NativeAmerican,
                                islander: item.PacificIslander,
                                more: item.TwoOrMore,
                                total: item.Total
                            });
                        }
                    });
                    // console.log(raceEnrollment);
                    //
                    var raceInfo = raceEnrollment[0];
                    // console.log(raceInfo);

                    var raceCat = [{
                        type: "White",
                        value: raceInfo.white,
                        explode: false,
                        percent: (raceInfo.white / raceInfo.total),
                        color: "#007bc3"
                    }, {
                        type: "Hispanic",
                        value: raceInfo.hispanic,
                        explode: false,
                        percent: (raceInfo.hispanic / raceInfo.total),
                        color: "#76b800"
                    }, {
                        type: "Black",
                        value: raceInfo.black,
                        explode: false,
                        percent: (raceInfo.black / raceInfo.total),
                        color: "#ffae00"
                    }, {
                        type: "Asian",
                        value: raceInfo.asian,
                        explode: false,
                        percent: (raceInfo.asian / raceInfo.total),
                        color: "#ef4c00"
                    }, {
                        type: "Native American",
                        value: raceInfo.native,
                        explode: false,
                        percent: (raceInfo.native / raceInfo.total),
                        color: "#a419b7"
                    }, {
                        type: "Pacific Islander",
                        value: raceInfo.islander,
                        explode: false,
                        percent: (raceInfo.islander / raceInfo.total),
                        color: "#430B62"
                    }, {
                        type: "Two or More",
                        value: raceInfo.more,
                        explode: false,
                        percent: (raceInfo.more / raceInfo.total),
                        color: "#2A620B"
                    }];
                    // console.log(raceCat);

                    var data = [];
                    for (var i = 0; i < raceCat.length; i++) {
                        if (raceCat[i].value !== null) {
                            data.push(raceCat[i]);
                        }
                    }
                    // console.log(data);


                    buildChart();

                    function buildChart() {

                        $("#enrollmentRaceDistrict").kendoChart({
                            title: {
                                text: "District Student Demographics"
                            },
                            theme: "Silver",
                            dataSource: {
                                data: data,
                            },
                            legend: {
                                position: "right"
                            },
                            chartArea: {
                                background: "",
                                margin: 1,
                                height: 350
                            },
                            seriesDefaults: {
                                labels: {
                                    visible: true,
                                    align: "circle",
                                    distance: 25,
                                    background: "transparent",
                                    template: "#= category #"
                                }
                            },
                            series: [{
                                type: "pie",
                                startAngle: 90,
                                field: "value",
                                categoryField: "type",
                                explodeField: "explode",
                                color: "color"
                            }],
                            tooltip: {
                                visible: true,
                                template: "#= category #<br />#= kendo.format('{0:N0}', value) #<br />#= kendo.format('{0:P1}',dataItem.percent) #"
                            }
                        });
                    }
                };

            }; // end demographicsChartVM
            return demographicsChartVM;
        } // end function
    );
}());
