/**
 * Provides view-model implementation of the AZ MERIT scores breakdown.
 */
(function() {

    "use strict";
    define([
            "dojo/on",
            "dojo/dom-construct",
            "dojo/dom",
            "appPackages/config"
        ],
        function(on, dc, dom, appConfig) {

            var azBreakdownVM = new function() {

                var self = this;

                self.sYear = function(e) {
                    self.selectedYear = e;
                };

                self.schoolBreakdownQueryFault = function(error) {
                    console.log(error.messaege);
                };

                self.schoolBreakdownQueryHandler = function(results) {
                    var features = results.features;
                    // console.log(features);

                    self.breakdownELA = [];
                    self.breakdownMATH = [];
                    $.each(features, function(index, item) {
                        if (item.attributes.ContentArea === 675) {
                            self.breakdownELA.push({
                                entityID: item.attributes.EntityID,
                                distID: item.attributes.DistrictEntityID,
                                countyID: item.attributes.CountyEntityID,
                                schoolID: item.attributes.SchoolEntityID,
                                FY: item.attributes.FY,
                                area: item.attributes.ContentAreaDef,
                                group: item.attributes.SubgroupDef,
                                level: item.attributes.TestLevelName,
                                ELA1: item.attributes.PCT_PL1,
                                ELA2: item.attributes.PCT_PL2,
                                ELA3: item.attributes.PCT_PL3,
                                ELA4: item.attributes.PCT_PL4,
                                ELAP: item.attributes.PCT_Passing,
                                REDACT: item.attributes.PCT_Redacted,
                            });
                        }
                        if (item.attributes.ContentArea === 677) {
                            self.breakdownMATH.push({
                                entityID: item.attributes.EntityID,
                                distID: item.attributes.DistrictEntityID,
                                countyID: item.attributes.CountyEntityID,
                                schoolID: item.attributes.SchoolEntityID,
                                FY: item.attributes.FY,
                                area: item.attributes.ContentAreaDef,
                                group: item.attributes.SubgroupDef,
                                level: item.attributes.TestLevelName,
                                MATH1: item.attributes.PCT_PL1,
                                MATH2: item.attributes.PCT_PL2,
                                MATH3: item.attributes.PCT_PL3,
                                MATH4: item.attributes.PCT_PL4,
                                MATHP: item.attributes.PCT_Passing,
                                REDACT: item.attributes.PCT_Redacted,
                            });
                        }

                    });
                    // console.log(self.breakdownELA);
                    // console.log(self.breakdownMATH);

                    self.elaLevels = [];
                    self.mathLevels = [];
                    $.each(features, function(index, item) {
                        if (item.attributes.ContentArea === 675) {
                            self.elaLevels.push({
                                level: item.attributes.TestLevelName,
                                sort: item.attributes.TestOrder
                            });
                        }
                        if (item.attributes.ContentArea === 677) {
                            self.mathLevels.push({
                                level: item.attributes.TestLevelName,
                                sort: item.attributes.TestOrder
                            });
                        }
                    });
                    // console.log(self.elaLevels);
                    // console.log(self.mathLevels);

                    var unique0 = {};
                    self.distinctELA = [];
                    for (var i in self.elaLevels) {
                        if (typeof(unique0[self.elaLevels[i].level]) == "undefined") {
                            self.distinctELA.push({
                                level: self.elaLevels[i].level,
                                sort: self.elaLevels[i].sort
                            });
                        }
                        unique0[self.elaLevels[i].level] = 0;
                    }
                    // console.log(unique0);
                    // console.log(self.distinctELA);

                    // used to sort attributes and put into array.
                    function compare(a, b) {
                        if (a.sort < b.sort) {
                            return -1;
                        }
                        if (a.sort > b.sort) {
                            return 1;
                        }
                        return 0;
                    }
                    self.distinctELA.sort(compare);
                    // console.log(self.distinctELA);

                    var unique1 = {};
                    self.distinctMATH = [];
                    for (var i in self.mathLevels) {
                        if (typeof(unique1[self.mathLevels[i].level]) == "undefined") {
                            self.distinctMATH.push({
                                level: self.mathLevels[i].level,
                                sort: self.mathLevels[i].sort
                            });
                        }
                        unique1[self.mathLevels[i].level] = 0;
                    }
                    // console.log(unique1);
                    // console.log(self.distinctMATH);

                    self.distinctMATH.sort(compare);
                    // console.log(self.distinctMATH);

                    self.typeA = "ELA";
                    self.tLevel = "All Students";

                    self.testLevel();
                    self.createAllMERITChart();
                };
                //end schoolBreakdownQueryHandler


                self.districtBreakdownQueryFault = function(error) {
                    console.log(error.messaege);
                };

                /**
                 * [districtBreakdownQueryHandler description]
                 * @param  {[type]} results [description]
                 * @return {[type]}         [description]
                 */
                self.districtBreakdownQueryHandler = function(results) {
                    var features = results.features;
                    // console.log(features);

                    var districtELA = [];
                    var districtMATH = [];
                    $.each(features, function(index, item) {
                        if (item.attributes.ContentArea === 675 && item.attributes.TestLevel === 0) {
                            districtELA.push({
                                entityID: item.attributes.EntityID,
                                FY: item.attributes.FY,
                                area: item.attributes.ContentAreaDef,
                                group: item.attributes.SubgroupDef,
                                level: item.attributes.TestLevelName,
                                ELA1: item.attributes.PCT_PL1,
                                ELA2: item.attributes.PCT_PL2,
                                ELA3: item.attributes.PCT_PL3,
                                ELA4: item.attributes.PCT_PL4,
                                ELAP: item.attributes.PCT_Passing,
                                ELARDT: item.attributes.PCT_Redacted
                            });
                        }
                        if (item.attributes.ContentArea === 677 && item.attributes.TestLevel === 0) {
                            districtMATH.push({
                                entityID: item.attributes.EntityID,
                                FY: item.attributes.FY,
                                area: item.attributes.ContentAreaDef,
                                group: item.attributes.SubgroupDef,
                                level: item.attributes.TestLevelName,
                                MATH1: item.attributes.PCT_PL1,
                                MATH2: item.attributes.PCT_PL2,
                                MATH3: item.attributes.PCT_PL3,
                                MATH4: item.attributes.PCT_PL4,
                                MATHP: item.attributes.PCT_Passing,
                                MATHRDT: item.attributes.PCT_Redacted
                            });
                        }
                    });
                    // console.log(districtELA);
                    // console.log(districtMATH);

                    return districtELA, districtMATH;
                };


                self.stateBreakdownQueryFault = function(error) {
                    console.log(error.messaege);
                };

                self.stateBreakdownQueryHandler = function(results) {
                    var features = results.features;
                    // console.log(features);

                    var stateELA = [];
                    var stateMATH = [];
                    $.each(features, function(index, item) {
                        if (item.attributes.ContentArea === 675 && item.attributes.TestLevel === 0) {
                            stateELA.push({
                                entityID: item.attributes.EntityID,
                                FY: item.attributes.FY,
                                area: item.attributes.ContentAreaDef,
                                group: item.attributes.SubgroupDef,
                                level: item.attributes.TestLevelName,
                                ELA1: item.attributes.PCT_PL1,
                                ELA2: item.attributes.PCT_PL2,
                                ELA3: item.attributes.PCT_PL3,
                                ELA4: item.attributes.PCT_PL4,
                                ELAP: item.attributes.PCT_Passing,
                                ELARDT: item.attributes.PCT_Redacted
                            });
                        }
                        if (item.attributes.ContentArea === 677 && item.attributes.TestLevel === 0) {
                            stateMATH.push({
                                entityID: item.attributes.EntityID,
                                FY: item.attributes.FY,
                                area: item.attributes.ContentAreaDef,
                                group: item.attributes.SubgroupDef,
                                level: item.attributes.TestLevelName,
                                MATH1: item.attributes.PCT_PL1,
                                MATH2: item.attributes.PCT_PL2,
                                MATH3: item.attributes.PCT_PL3,
                                MATH4: item.attributes.PCT_PL4,
                                MATHP: item.attributes.PCT_Passing,
                                MATHRDT: item.attributes.PCT_Redacted
                            });
                        }
                    });
                    // console.log(stateELA);
                    // console.log(stateMATH);

                    return stateELA, stateMATH;
                };

                /**
                 * Used to change the Test Level
                 * http://bootsnipp.com/snippets/featured/funky-radio-buttons
                 */
                $("body").on("change", "#fradio :input", function() {
                    self.tLevel = this.labels[0].innerHTML;
                    // console.log(self.tLevel);
                    self.createAllMERITChart();
                });

                /**
                 * Used to change the Assessment Type [ELA/MATH]
                 */
                $("#typeAssess :input").change(function() {
                    // console.log(this.value);
                    self.typeA = this.value;
                    self.tLevel = "All Students";

                    self.testLevel();
                    self.createAllMERITChart();
                });

                self.testLevel = function() {
                    dc.empty("fradio");
                    var i;
                    var chk;
                    if (self.typeA === "ELA") {
                        var elaLength = self.distinctELA.length;
                        for (i = 0; i < elaLength; i++) {
                            if (i === 0) {
                                chk = "checked";
                            } else {
                                chk = "";
                            }
                            var radioButton = '<div class="funkyradio-success">\n<input type="radio" name="radio" id="radio' + [i] + '"' + chk + '/>\n<label id="r' + [i] + '"' + ' for="radio' + [i] + '"' + '></label></div>';
                            dc.place(radioButton, "fradio", "last");
                            dom.byId("r" + [i]).innerHTML = self.distinctELA[i].level;
                        }
                    }
                    if (self.typeA === "MATH") {
                        var mathLength = self.distinctMATH.length;
                        for (i = 0; i < mathLength; i++) {
                            if (i === 0) {
                                chk = "checked";
                            } else {
                                chk = "";
                            }
                            var radioButton = '<div class="funkyradio-success">\n<input type="radio" name="radio" id="radio' + [i] + '"' + chk + '/>\n<label id="r' + [i] + '"' + ' for="radio' + [i] + '"' + '></label></div>';
                            dc.place(radioButton, "fradio", "last");
                            dom.byId("r" + [i]).innerHTML = self.distinctMATH[i].level;
                        }
                    }
                };

                /**
                 * [createAllMERITChart] - gives the AzMERIT Student breakdown for each student group
                 * @data from [breakdownQueryHandler] via []
                 * @return {[type]} [description]
                 */
                self.createAllMERITChart = function() {
                    console.log(self.breakdownELA);
                    console.log(self.stateELA);
                    console.log(self.districtELA);
                    // console.log(self.breakdownMATH);
                    // console.log(self.typeA);
                    // console.log(self.tLevel);

                    if (self.typeA === "ELA") {
                        self.bd = [];
                        $.each(self.breakdownELA, function(index, item) {
                            if (item.level === self.tLevel) {
                                if (item.ELA1 < 0) {
                                    item.ELA1 = 0;
                                }
                                if (item.ELA2 < 0) {
                                    item.ELA2 = 0;
                                }
                                if (item.ELA3 < 0) {
                                    item.ELA3 = 0;
                                }
                                if (item.ELA4 < 0) {
                                    item.ELA4 = 0;
                                }
                                if (item.ELAP === -1) {
                                    item.ELAP = 100;
                                }
                                self.bd.push(item);
                            }
                        });
                        // console.log(self.bd);
                        self.dbd = [];
                        $.each(self.districtELA, function(index, item) {
                            if (item.level === self.tLevel) {
                                if (item.ELA1 < 0) {
                                    item.ELA1 = 0;
                                }
                                if (item.ELA2 < 0) {
                                    item.ELA2 = 0;
                                }
                                if (item.ELA3 < 0) {
                                    item.ELA3 = 0;
                                }
                                if (item.ELA4 < 0) {
                                    item.ELA4 = 0;
                                }
                                self.dbd.push(item);
                            }
                        });
                        // console.log(self.dbd);
                        self.sbd = [];
                        $.each(self.stateELA, function(index, item) {
                            if (item.level === self.tLevel) {
                                if (item.ELA1 < 0) {
                                    item.ELA1 = 0;
                                }
                                if (item.ELA2 < 0) {
                                    item.ELA2 = 0;
                                }
                                if (item.ELA3 < 0) {
                                    item.ELA3 = 0;
                                }
                                if (item.ELA4 < 0) {
                                    item.ELA4 = 0;
                                }
                                self.sbd.push(item);
                            }
                        });
                        // console.log(self.sbd);
                    }

                    if (self.typeA === "MATH") {
                        self.bd = [];
                        $.each(self.breakdownMATH, function(index, item) {
                            if (item.level === self.tLevel) {
                                if (item.MATH1 < 0) {
                                    item.MATH1 = 0;
                                }
                                if (item.MATH2 < 0) {
                                    item.MATH2 = 0;
                                }
                                if (item.MATH3 < 0) {
                                    item.MATH3 = 0;
                                }
                                if (item.MATH4 < 0) {
                                    item.MATH4 = 0;
                                }
                                if (item.MATHP === -1) {
                                    item.MATHP = 100;
                                }
                                self.bd.push(item);
                            }
                        });
                        // console.log(self.bd);
                        self.dbd = [];
                        $.each(self.districtMATH, function(index, item) {
                            if (item.level === self.tLevel) {
                                if (item.MATH1 < 0) {
                                    item.MATH1 = 0;
                                }
                                if (item.MATH2 < 0) {
                                    item.MATH2 = 0;
                                }
                                if (item.MATH3 < 0) {
                                    item.MATH3 = 0;
                                }
                                if (item.MATH4 < 0) {
                                    item.MATH4 = 0;
                                }
                                self.dbd.push(item);
                            }
                        });
                        // console.log(self.dbd);
                        self.sbd = [];
                        $.each(self.stateMATH, function(index, item) {
                            if (item.level === self.tLevel) {
                                if (item.MATH1 < 0) {
                                    item.MATH1 = 0;
                                }
                                if (item.MATH2 < 0) {
                                    item.MATH2 = 0;
                                }
                                if (item.MATH3 < 0) {
                                    item.MATH3 = 0;
                                }
                                if (item.MATH4 < 0) {
                                    item.MATH4 = 0;
                                }
                                self.sbd.push(item);
                            }
                        });
                        // console.log(self.sbd);
                    }

                    // builds a list of test levels that are available
                    var list = [];
                    $.each(self.bd, function(index, item) {
                        list.push(item.group);
                    });
                    // console.log(list);

                    var blankObj0 = {
                        "ELA1": 0,
                        "ELA2": 0,
                        "ELA3": 0,
                        "ELA4": 0,
                        "ELAP": 0,
                        "FY": self.selectedYear,
                        "area": self.typeA,
                        "countyID": 5555,
                        "distID": 5555,
                        "entityID": 5555,
                        "group": "",
                        "level": self.tLevel,
                        "schoolID": 5555,
                        "REDACT": 0
                    };

                    var blankObj1 = {
                        "MATH1": 0,
                        "MATH2": 0,
                        "MATH3": 0,
                        "MATH4": 0,
                        "MATHP": 0,
                        "FY": self.selectedYear,
                        "area": self.typeA,
                        "countyID": 5555,
                        "distID": 5555,
                        "entityID": 5555,
                        "group": "",
                        "level": self.tLevel,
                        "schoolID": 5555,
                        "REDACT": 0
                    };

                    $.each(appConfig.subGroups1, function(index, item) {
                        var bb = list.includes(item);
                        var gg;
                        if (bb === false) {
                            if (self.typeA === "ELA") {
                                // console.log("MISSING: " + item);
                                gg = $.extend({}, blankObj0);
                            }
                            if (self.typeA === "MATH") {
                                // console.log("MISSING: " + item);
                                gg = $.extend({}, blankObj1);
                            }
                            gg.group = item;
                            self.bd.push(gg);
                        }
                    });

                    self.studentBreakDown = [];
                    $.each(self.bd, function(index, item) {

                        Object.keys(item).forEach(function(key, index) {
                            item[key] = item[key];
                            item["sort"] = appConfig.sortOrder[item["group"]];
                        });
                        self.studentBreakDown.push(item);
                    });
                    // console.log(self.studentBreakDown);

                    // used to sort attributes and put into array.
                    function compare(a, b) {
                        if (a.sort < b.sort) {
                            return -1;
                        }
                        if (a.sort > b.sort) {
                            return 1;
                        }
                        return 0;
                    }
                    self.studentBreakDown.sort(compare);
                    // console.log(self.studentBreakDown);

                    // var TotalArray = $.merge(self.sbd, self.studentBreakDown);
                    // console.log(TotalArray);

                    var TotalArray = self.sbd.concat(self.dbd, self.studentBreakDown);
                    // console.log(TotalArray);

                    buildChart();
                    // buildChart1();

                    /**
                     * [buildChart - Bar Chart showing four categories of Proficiency]
                     * @return {[type]} [description]
                     */
                    function buildChart() {
                        var seriesINFO;
                        var title;
                        if (self.typeA === "ELA") {
                            title = self.selectedYear + " ELA Proficiency Results",
                                seriesINFO = [{
                                    name: "Redacted",
                                    field: "REDACT",
                                    color: "#c0c0c0"
                                }, {
                                    name: "Minimally Proficient",
                                    field: "ELA1",
                                    color: "#910000"
                                }, {
                                    name: "Partially Proficient",
                                    field: "ELA2",
                                    color: "#d9900a"
                                }, {
                                    name: "Proficient",
                                    field: "ELA3",
                                    color: "#2995e0"
                                }, {
                                    name: "Highly Proficient",
                                    field: "ELA4",
                                    color: "#50be09"
                                }]
                        }
                        if (self.typeA === "MATH") {
                            title = self.selectedYear + " MATH Proficiency Results",
                                seriesINFO = [{
                                    name: "Redacted",
                                    field: "REDACT",
                                    color: "#c0c0c0"
                                }, {
                                    name: "Minimally Proficient",
                                    field: "MATH1",
                                    color: "#910000"
                                }, {
                                    name: "Partially Proficient",
                                    field: "MATH2",
                                    color: "#d9900a"
                                }, {
                                    name: "Proficient",
                                    field: "MATH3",
                                    color: "#2995e0"
                                }, {
                                    name: "Highly Proficient",
                                    field: "MATH4",
                                    color: "#50be09"
                                }]
                        }

                        $("#allChart").kendoChart({
                            title: {
                                text: title
                            },
                            dataSource: TotalArray,
                            legend: {
                                visible: false,
                                position: "bottom"
                            },
                            seriesDefaults: {
                                type: "bar",
                                stack: {
                                    type: "100%"
                                }
                            },
                            series: seriesINFO,
                            valueAxis: {
                                max: 1,
                                line: {
                                    visible: true
                                },
                                minorGridLines: {
                                    visible: true
                                },
                                majorGridLines: {
                                    visible: true,
                                    width: 2
                                },
                                labels: {
                                    template: "${ value * 100 }%"
                                }
                            },
                            categoryAxis: {
                                // field: "group",
                                categories: appConfig.subGroupsAll,
                                line: {
                                    visible: true
                                },
                                majorGridLines: {
                                    visible: false
                                }
                            },
                            tooltip: {
                                visible: true,
                                template: "${ series.name }: ${ value }%"
                            }
                        });
                    };

                    /**
                     * [buildChart1 - Bar Chart showing Percent Passed]
                     * @return {[type]} [description]
                     */
                    function buildChart1() {
                        var seriesINFO;
                        var title;
                        if (self.typeA === "ELA") {
                            title = self.selectedYear + " ELA Percent Passed",

                                seriesINFO = [{
                                    name: "Percent Passed",
                                    field: "ELAP",
                                    color: function(point) {
                                        if (point.value < 100) {
                                            // return "#50be09";
                                            return "#7709be";
                                        } else {
                                            return "#c0c0c0";
                                        }
                                    }
                                }]
                        }
                        if (self.typeA === "MATH") {
                            title = self.selectedYear + " MATH Percent Passed",
                                seriesINFO = [{
                                    name: "Percent Passed",
                                    field: "MATHP",
                                    color: function(point) {
                                        if (point.value < 100) {
                                            // return "#50be09";
                                            return "#7709be";
                                        } else {
                                            return "#c0c0c0";
                                        }
                                    }
                                }]
                        }

                        $("#passChart").kendoChart({
                            title: {
                                text: title
                            },
                            dataSource: TotalArray,
                            legend: {
                                visible: false,
                                position: "bottom"
                            },
                            seriesDefaults: {
                                type: "bar"
                            },
                            series: seriesINFO,
                            valueAxis: {
                                max: 100,
                                line: {
                                    visible: true
                                },
                                minorGridLines: {
                                    visible: true
                                },
                                majorGridLines: {
                                    visible: true,
                                    width: 2
                                },
                                labels: {
                                    template: "${ value }%"
                                }
                            },
                            categoryAxis: {
                                // field: "group",
                                categories: appConfig.subGroupsAll,
                                line: {
                                    visible: true
                                },
                                majorGridLines: {
                                    visible: false
                                }
                            },
                            tooltip: {
                                visible: true,
                                // template: "${ series.name }: ${ value }%"
                                template: "#if (value < 100) {# ${ series.name }: ${ value }% #} else {# Redacted #}#"
                            }
                        });
                    };
                };

            }; // end azBreakdownVM

            return azBreakdownVM;
        } // end function
    );
}());
