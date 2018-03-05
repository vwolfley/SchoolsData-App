/**
 * Provides view-model implementation of the AZ MERIT passing scores charts.
 */
(function() {

    "use strict";
    define([
            "dojo/on",
            "dojo/dom-construct",
            "dojo/dom",
            "dojo/dom-class",
            "appPackages/config"
        ],
        function(on, dc, dom, domClass, appConfig) {

            var passingChartsVM = new function() {

                var self = this;

                /**
                 * [sYear description]
                 * @param  {[type]} e [description]
                 * @return {[type]}   [description]
                 */
                self.sYear = function(e) {
                    self.selectedYear = e;
                };

                /**
                 * [score description]
                 * @param  {[type]} e1 [description]
                 * @param  {[type]} e2 [description]
                 * @return {[type]}    [description]
                 */
                self.score = function(e1, e2) {

                    if (e1.PCT_Passing > 0) {
                        dom.byId("elaScore").innerHTML = e1.PCT_Passing + "%";
                        self.createChartELA(e1);
                    } else {
                        dom.byId("elaScore").innerHTML = "N/A";
                        dom.byId("elaChart").innerHTML = "<p class='chartGone'>Chart</p><p class='pCG'>N/A</p>";
                        domClass.add("elaChart", "chartGoneNA");
                    }
                    if (e2.PCT_Passing > 0) {
                        dom.byId("mathScore").innerHTML = e2.PCT_Passing + "%";
                        self.createChartMATH(e2);
                    } else {
                        dom.byId("mathScore").innerHTML = "N/A";
                        dom.byId("mathChart").innerHTML = "<p class='chartGone'>Chart</p><p class='pCG'>N/A</p>";
                        domClass.add("mathChart", "chartGoneNA");
                    }
                };

                /**
                 * [diffScore description]
                 * @param  {[type]} v2015 [description]
                 * @param  {[type]} v2016 [description]
                 * @param  {[type]} v2017 [description]
                 * @return {[type]}       [description]
                 */
                self.diffScore = function(v2015, v2016, v2017) {
                    // console.log(v2015);
                    // console.log(v2016);
                    // console.log(v2017);

                    var ela2015 = v2015[0];
                    var ela2016 = v2016[0];
                    var ela2017 = v2017[0];

                    var math2015 = v2015[1];
                    var math2016 = v2016[1];
                    var math2017 = v2017[1];

                    if (ela2015.PCT_Passing < 0) {
                        ela2015.PCT_Passing = 0;
                    }
                    if (math2015.PCT_Passing < 0) {
                        math2015.PCT_Passing = 0;
                    }
                    if (ela2016.PCT_Passing < 0) {
                        ela2016.PCT_Passing = 0;
                    }
                    if (math2016.PCT_Passing < 0) {
                        math2016.PCT_Passing = 0;
                    }
                    if (ela2017.PCT_Passing < 0) {
                        ela2017.PCT_Passing = 0;
                    }
                    if (math2017.PCT_Passing < 0) {
                        math2017.PCT_Passing = 0;
                    }

                    var upARROW = '<img class="arrow" src="./app/images/arrowUp.png" alt="UP">';
                    var downARROW = '<img class="arrow" src="./app/images/arrowDown.png" alt="Down">';
                    var noARROW = '<img class="noarrow" src="./app/images/arrowSide.png" alt="Side">';

                    if (self.selectedYear === "2017") {
                        var elaChange = ela2017.PCT_Passing - ela2016.PCT_Passing;
                        var mathChange = math2017.PCT_Passing - math2016.PCT_Passing;

                        var ec1 = isNaN(elaChange);
                        var mc1 = isNaN(mathChange);

                        change();

                    } else if (self.selectedYear === "2016") {
                        var elaChange = ela2016.PCT_Passing - ela2015.PCT_Passing;
                        var mathChange = math2016.PCT_Passing - math2015.PCT_Passing;

                        var ec1 = isNaN(elaChange);
                        var mc1 = isNaN(mathChange);

                        change();

                    } else {
                        dc.empty("elaChange");
                        dc.empty("elaArrow");
                        dc.empty("mathChange");
                        dc.empty("mathArrow");
                    }

                    function change() {
                        if (elaChange > 0) {
                            dom.byId("elaChange").innerHTML = elaChange + "%";
                            dom.byId("elaArrow").innerHTML = upARROW;
                        } else if (elaChange === 0) {
                            dom.byId("elaChange").innerHTML = elaChange + "%";
                            dom.byId("elaArrow").innerHTML = noARROW;
                        } else if (ec1 === true) {
                            dc.empty("elaChange");
                            dc.empty("elaArrow");
                        } else {
                            dom.byId("elaChange").innerHTML = elaChange + "%";
                            dom.byId("elaArrow").innerHTML = downARROW;
                        }
                        if (mathChange > 0) {
                            dom.byId("mathChange").innerHTML = mathChange + "%";
                            dom.byId("mathArrow").innerHTML = upARROW;
                        } else if (mathChange === 0) {
                            dom.byId("mathChange").innerHTML = mathChange + "%";
                            dom.byId("mathArrow").innerHTML = noARROW;
                        } else if (mc1 === true) {
                            dc.empty("mathChange");
                            dc.empty("mathArrow");
                        } else {
                            dom.byId("mathChange").innerHTML = mathChange + "%";
                            dom.byId("mathArrow").innerHTML = downARROW;
                        }
                    }
                };

                /**
                 * [createChartELA - Pie Chart]
                 * Data from [schoolScoresQueryHandler] via [getSchoolScores();]
                 * @return {Pie Chart} [showing schools breakdown of AzMERIT scores for all students]
                 */
                self.createChartELA = function(e) {
                    // console.log(e);

                    if (e.PCT_PL1 < 0) {
                        e.PCT_PL1 = 0;
                    }
                    if (e.PCT_PL2 < 0) {
                        e.PCT_PL2 = 0;
                    }
                    if (e.PCT_PL3 < 0) {
                        e.PCT_PL3 = 0;
                    }
                    if (e.PCT_PL4 < 0) {
                        e.PCT_PL4 = 0;
                    }

                    function isBigEnough(element, index, array) {
                        return element == 0;
                    }
                    var ddCheck = [e.PCT_PL1, e.PCT_PL2, e.PCT_PL3, e.PCT_PL4].every(isBigEnough);
                    // console.log(ddCheck);

                    if (ddCheck == true) {
                        dom.byId("elaChart").innerHTML = "<p class='chartGone'>Chart</p><p class='pCG'>N/A</p>";
                        domClass.add("elaChart", "chartGoneNA");
                    } else {
                        domClass.remove("elaChart", "chartGoneNA");
                        buildChart();
                    }

                    function buildChart() {
                        var azMERITcat = [{
                            type: "Minimally Proficient",
                            value: e.PCT_PL1,
                        }, {
                            type: "Partially Proficient",
                            value: e.PCT_PL2,
                        }, {
                            type: "Proficient",
                            value: e.PCT_PL3,
                            explode: true
                        }, {
                            type: "Highly Proficient",
                            value: e.PCT_PL4,
                            explode: true
                        }];

                        $("#elaChart").kendoChart({
                            title: {
                                text: ""
                            },
                            legend: {
                                visible: false
                            },
                            dataSource: {
                                data: azMERITcat,
                            },
                            series: [{
                                type: "pie",
                                field: "value",
                                categoryField: "type",
                                explodeField: "explode"
                            }],
                            // seriesColors: ["#d62d20", "#ffa700", "#0057e7", "#028900"],
                            seriesColors: ["#910000", "#d9900a", "#2995e0", "#50be09"],
                            tooltip: {
                                visible: true,
                                template: "${ category } - ${ value }%"
                            },
                            chartArea: {
                                margin: 1,
                                height: 250
                            }
                        });
                    }
                };

                /**
                 * [createChartMATH - Pie Chart]
                 * * Data from [schoolScoresQueryHandler] via [getSchoolScores();]
                 * @return {Pie Chart} [showing schools breakdown of AzMERIT scores for all students]
                 */
                self.createChartMATH = function(e) {
                    // console.log(e);
                    if (e.PCT_PL1 < 0) {
                        e.PCT_PL1 = 0;
                    }
                    if (e.PCT_PL2 < 0) {
                        e.PCT_PL2 = 0;
                    }
                    if (e.PCT_PL3 < 0) {
                        e.PCT_PL3 = 0;
                    }
                    if (e.PCT_PL4 < 0) {
                        e.PCT_PL4 = 0;
                    }

                    function isBigEnough(element, index, array) {
                        return element == 0;
                    }
                    var ddCheck = [e.PCT_PL1, e.PCT_PL2, e.PCT_PL3, e.PCT_PL4].every(isBigEnough);
                    // console.log(ddCheck);

                    if (ddCheck == true) {
                        dom.byId("mathChart").innerHTML = "<p class='chartGone'>Chart</p><p class='pCG'>N/A</p>";
                        domClass.add("mathChart", "chartGoneNA");
                    } else {
                        domClass.remove("mathChart", "chartGoneNA");
                        buildChart();
                    }

                    function buildChart() {

                        var azMERITcat = [{
                            type: "Minimally Proficient",
                            value: e.PCT_PL1,
                        }, {
                            type: "Partially Proficient",
                            value: e.PCT_PL2,
                        }, {
                            type: "Proficient",
                            value: e.PCT_PL3,
                            explode: true
                        }, {
                            type: "Highly Proficient",
                            value: e.PCT_PL4,
                            explode: true
                        }];

                        $("#mathChart").kendoChart({
                            title: {
                                text: ""
                            },
                            legend: {
                                visible: false
                            },
                            dataSource: {
                                data: azMERITcat,
                            },
                            series: [{
                                type: "pie",
                                field: "value",
                                categoryField: "type",
                                explodeField: "explode"
                            }],
                            // seriesColors: ["#d62d20", "#ffa700", "#0057e7", "#028900"],
                            seriesColors: ["#910000", "#d9900a", "#2995e0", "#50be09"],
                            tooltip: {
                                visible: true,
                                template: "${ category } - ${ value }%"
                            },
                            chartArea: {
                                margin: 1,
                                height: 250
                            }
                        });
                    }
                };

                /**
                 * [createDistrictStateChart - bar charts]
                 * Data from countyQueryHandler via [getCountyData();]
                 * @return {[type]} [Bar Chart] self.districtELA
                 */
                self.createComparisonChart = function(e) {
                    var info = e;
                    // console.log(info);

                    var districtScores = [];
                    $.each(info, function(index, item) {
                        var data = {
                            fy: item.FY,
                            content: item.ContentAreaDef,
                            PL1: item.PCT_PL1,
                            PL2: item.PCT_PL2,
                            PL3: item.PCT_PL3,
                            PL4: item.PCT_PL4,
                            Passing: item.PCT_Passing
                        }
                        districtScores.push(data);
                    });
                    // console.log(districtScores);

                    var ela, math, state;
                    switch (self.selectedYear) {
                        case "2015":
                            ela = appConfig.stateAzMERIT2015ela;
                            math = appConfig.stateAzMERIT2015math;
                            state = [ela,math];
                            break;
                        case "2016":
                            ela = appConfig.stateAzMERIT2016ela;
                            math =appConfig.stateAzMERIT2016math;
                            state = [ela,math];
                            break;
                        case "2017":
                            ela = appConfig.stateAzMERIT2017ela;
                            math =appConfig.stateAzMERIT2017math;
                            state = [ela,math];
                            break;
                    }
                    // console.log(state);

                    buildDistPieChart();
                    function buildDistPieChart() {
                        var e = districtScores;

                        var elaScores;
                        var mathScores;
                        $.each(e, function(index, item) {
                            var azMERITcat = [{
                                type: "Minimally Proficient",
                                value: item.PL1,
                            }, {
                                type: "Partially Proficient",
                                value: item.PL2,
                            }, {
                                type: "Proficient",
                                value: item.PL3,
                                explode: true
                            }, {
                                type: "Highly Proficient",
                                value: item.PL4,
                                explode: true
                            }];
                            if (item.content === "ELA") {
                                elaScores = azMERITcat;
                            }
                            if (item.content === "MATH") {
                                mathScores = azMERITcat;
                            }
                        });
                        // console.log(elaScores);

                        elaPieChart();
                        mathPieChart();

                        function elaPieChart() {
                            $("#distELAChart").kendoChart({
                                title: {
                                    text: "ELA",
                                    font: "bold 11px Arial, Helvetica, sans-serif",
                                    margin: 1,
                                    padding: 1,
                                    position: "bottom",
                                    visible: true
                                },
                                legend: {
                                    visible: false
                                },
                                dataSource: {
                                    data: elaScores,
                                },
                                series: [{
                                    type: "pie",
                                    field: "value",
                                    categoryField: "type",
                                    explodeField: "explode"
                                }],
                                // seriesColors: ["#d62d20", "#ffa700", "#0057e7", "#028900"],
                                seriesColors: ["#910000", "#d9900a", "#2995e0", "#50be09"],
                                tooltip: {
                                    visible: true,
                                    template: "${ category } - ${ value }%"
                                },
                                chartArea: {
                                    margin: 1,
                                    height: 125,
                                    width: 125
                                }
                            });
                        }

                        function mathPieChart() {
                            $("#distMATHChart").kendoChart({
                                title: {
                                    text: "MATH",
                                    font: "bold 11px Arial, Helvetica, sans-serif",
                                    margin: 1,
                                    padding: 1,
                                    position: "bottom",
                                    visible: true
                                },
                                legend: {
                                    visible: false
                                },
                                dataSource: {
                                    data: mathScores,
                                },
                                series: [{
                                    type: "pie",
                                    field: "value",
                                    categoryField: "type",
                                    explodeField: "explode"
                                }],
                                // seriesColors: ["#d62d20", "#ffa700", "#0057e7", "#028900"],
                                seriesColors: ["#910000", "#d9900a", "#2995e0", "#50be09"],
                                tooltip: {
                                    visible: true,
                                    template: "${ category } - ${ value }%"
                                },
                                chartArea: {
                                    margin: 1,
                                    height: 125,
                                    width: 125
                                }
                            });
                        }
                    }
                    // end buildDistPieChart

                    buildStatePieChart();
                    function buildStatePieChart() {
                        var e = state;

                        var elaScores;
                        var mathScores;
                        $.each(e, function(index, item) {
                            var azMERITcat = [{
                                type: "Minimally Proficient",
                                value: item[1],
                            }, {
                                type: "Partially Proficient",
                                value: item[2],
                            }, {
                                type: "Proficient",
                                value: item[3],
                                explode: true
                            }, {
                                type: "Highly Proficient",
                                value: item[4],
                                explode: true
                            }];
                            if (index === 0) {
                                elaScores = azMERITcat;
                            }
                            if (index === 1) {
                                mathScores = azMERITcat;
                            }
                        });
                        // console.log(elaScores);

                        elaPieChart();
                        mathPieChart();

                        function elaPieChart() {
                            $("#stateELAChart").kendoChart({
                                title: {
                                    text: "ELA",
                                    font: "bold 11px Arial, Helvetica, sans-serif",
                                    margin: 1,
                                    padding: 1,
                                    position: "bottom",
                                    visible: true
                                },
                                legend: {
                                    visible: false
                                },
                                dataSource: {
                                    data: elaScores,
                                },
                                series: [{
                                    type: "pie",
                                    field: "value",
                                    categoryField: "type",
                                    explodeField: "explode"
                                }],
                                // seriesColors: ["#d62d20", "#ffa700", "#0057e7", "#028900"],
                                seriesColors: ["#910000", "#d9900a", "#2995e0", "#50be09"],
                                tooltip: {
                                    visible: true,
                                    template: "${ category } - ${ value }%"
                                },
                                chartArea: {
                                    margin: 1,
                                    height: 125,
                                    width: 125
                                }
                            });
                        }

                        function mathPieChart() {
                            $("#stateMATHChart").kendoChart({
                                title: {
                                    text: "MATH",
                                    font: "bold 11px Arial, Helvetica, sans-serif",
                                    margin: 1,
                                    padding: 1,
                                    position: "bottom",
                                    visible: true
                                },
                                legend: {
                                    visible: false
                                },
                                dataSource: {
                                    data: mathScores,
                                },
                                series: [{
                                    type: "pie",
                                    field: "value",
                                    categoryField: "type",
                                    explodeField: "explode"
                                }],
                                // seriesColors: ["#d62d20", "#ffa700", "#0057e7", "#028900"],
                                seriesColors: ["#910000", "#d9900a", "#2995e0", "#50be09"],
                                tooltip: {
                                    visible: true,
                                    template: "${ category } - ${ value }%"
                                },
                                chartArea: {
                                    margin: 1,
                                    height: 125,
                                    width: 125
                                }
                            });
                        }


                    }




                    // buildChart();
                    function buildChart() {
                        $("#compChart").kendoChart({
                            title: {
                                visible: false,
                                text: "Sample"
                            },
                            legend: {
                                visible: false,
                                position: "bottom"
                            },
                            dataSource: {
                                data: districtScores
                            },
                            series: [{
                                field: "Passing",
                                categoryField: "content",
                                name: "content"
                            }],
                            seriesDefaults: {
                                type: "column",
                                labels: {
                                    visible: true,
                                    background: "transparent",
                                    format: "{0}%",
                                    font: "bold italic 12px Open Sans Condensed,Verdana,sans-serif",
                                    padding: -25
                                },
                                gap: 0.10,
                                spacing: 0.10
                            },
                            valueAxis: {
                                visible: true,
                                max: 100,
                                min: 0,
                                majorGridLines: {
                                    visible: false
                                },
                                line: {
                                    visible: true
                                }
                            },
                            categoryAxis: {
                                categories: ["District"],
                                majorGridLines: {
                                    visible: false
                                },
                                line: {
                                    visible: true
                                }
                            },
                            tooltip: {
                                visible: true,
                                template: "District <br/>${ category }<br/>${ value }%"
                            }
                        });
                    }
                };


            }; // end passingChartsVM

            return passingChartsVM;
        } // end function
    );
}());
