/* ========================================================================
 * Maricopa Association of Governments
 * JS document
 * @project     MAG Schools Data Visualization Project
 * @summary     main JavaScript file
 * @file        main.js
 * ======================================================================== */

$(document).ready(function() {
    setTimeout(setup, 500);
});

function setup() {
    var selectedYear = "2017";
    var dataURL;
    var self = this;

    require([
            "dojo/parser",
            "dojo/promise/all",
            "dojo/dom",
            "dojo/on",
            "dojo/dom-construct",
            "dojo/dom-class",
            "dojo/_base/array",
            "esri/tasks/query",
            "esri/tasks/QueryTask",
            "esri/tasks/StatisticDefinition",
            "esri/map",
            "esri/dijit/BasemapToggle",
            "esri/layers/FeatureLayer",
            "esri/InfoTemplate",
            "esri/geometry/Point",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/symbols/SimpleLineSymbol",
            "esri/symbols/SimpleFillSymbol",
            "esri/symbols/PictureMarkerSymbol",
            "esri/graphic",
            "esri/Color",
            "esri/geometry/Extent",

            "appConfig/config",

            "dojo/domReady!"
        ],
        function(parser, all, dom, on, dc, domClass, arrayUtils, Query, QueryTask, StatisticDefinition, Map, BasemapToggle, FeatureLayer, InfoTemplate, Point, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, PictureMarkerSymbol, Graphic, Color, Extent, appConfig) {
            parser.parse();

            $("#year-filtering-tabs").kendoTabStrip({
                dataSource: ["2015", "2016", "2017"],
                change: function(e) {
                    selectedYear = this.value();

                    $(".selected-year").text(selectedYear);

                    getSchoolsData(selectedYear);
                }
            }).data("kendoTabStrip").select(2);
            //=================================================================================>

            // add version and date to about.html, changed in config.js
            dom.byId("version").innerHTML = appConfig.version;

            var map = new Map("mapDiv", {
                center: [-112, 33],
                minZoom: 5,
                maxZoom: 19,
                basemap: "streets",
                showAttribution: false,
                logo: false
            });

            var toggle = new BasemapToggle({
                map: map,
                basemap: "satellite"
            }, "BasemapToggle");
            toggle.startup();

            /**
             * [getData]
             * @return {azSchoolsQueryHandler}
             * @return {azSchoolsQueryFault} [error]
             */
            function getSchoolsData(selectedYear) {
                var queryTask;
                var query;
                var year = selectedYear;

                queryTask = new QueryTask(appConfig.mainURL + "/0");
                query = new Query();
                query.where = "FY = '" + year + "' AND SchoolEntityID > 0";
                query.returnGeometry = false;
                query.outFields = ["*"];
                queryTask.execute(query, azSchoolsQueryHandler, azSchoolsQueryFault)
            }

            /**
             * [getSchoolLocation]
             * @return {schoolPointQueryHandler}
             * @return {schoolPointQueryFault} [error]
             */
            function getSchoolLocation() {
                var queryTask;
                var query;

                queryTask = new QueryTask(appConfig.mainURL + "/0");
                query = new Query();
                query.where = "EntityID = " + self.dataItem.entityID;
                query.returnGeometry = true;
                query.outFields = ["*"];

                queryTask.execute(query, schoolPointQueryHandler, schoolPointQueryFault)
            }

            /**
             * [getSchoolScores]
             * @return {schoolScoresQueryHandler}
             * @return {schoolsQueryFault} [error]
             */
            function getSchoolScores() {
                var promises;
                var s2015;
                var s2016;
                var s2017;

                qt2015 = new QueryTask(appConfig.mainURL + "/1");
                q2015 = new Query();
                qt2016 = new QueryTask(appConfig.mainURL + "/1");
                q2016 = new Query();
                qt2017 = new QueryTask(appConfig.mainURL + "/1");
                q2017 = new Query();

                q2015.returnGeometry = q2016.returnGeometry = false;
                q2015.outFields = q2016.outFields = ["*"];
                q2015.where = q2016.where = "EntityID = " + self.dataItem.entityID + " AND Subgroup = 'All' AND TestLevel = 'All Students'";

                s2015 = qt2015.execute(q2015);
                s2016 = qt2016.execute(q2016);
                s2017 = qt2017.execute(q2017);
                promises = all([s2015, s2016, s2017]);
                promises.then(schoolScoresQueryHandler, schoolScoresQueryFault);
            }

            /**
             * [getBreakDown]
             * @return {breakdownQueryHandler}
             * @return {breakdownQueryFault} [error]
             */
            function getBreakDown() {
                var queryTask;
                var query;

                if (selectedYear === "2015") {
                    qtask();
                }
                if (selectedYear === "2016") {
                    qtask();
                }
                if (selectedYear === "2017") {
                    qtask();
                }

                function qtask() {
                    queryTask = new QueryTask(appConfig.mainURL + "/1");
                    query = new Query();
                    query.where = "EntityID = " + self.dataItem.entityID;
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                    queryTask.execute(query, breakdownQueryHandler, breakdownQueryFault)
                }
            }

            function getDistrictData(dID) {
                var queryTask;
                var query;

                queryTask = new QueryTask(appConfig.mainURL + "/0");
                query = new Query();
                query.where = "DistrictEntityID = " + dID;
                query.returnGeometry = false;
                query.outFields = ["*"];

                queryTask.execute(query, azMERITdistQueryHandler, azMERITdistQueryFault)
            }

            /**
             * [getDistrictBreakDown]
             * @return {districtBreakdownQueryHandler}
             * @return {districtBreakdownQueryFault} [error]
             */
            function getDistrictBreakDown(dID) {
                // console.log(dID);
                var queryTask;
                var query;
                if (selectedYear === "2015") {
                    qtask();
                }
                if (selectedYear === "2016") {
                    qtask();
                }
                if (selectedYear === "2017") {
                    qtask();
                }

                function qtask() {
                    queryTask = new QueryTask(appConfig.mainURL + "/1");
                    query = new Query();
                    query.where = "EntityID = " + dID + "AND Subgroup = 'All'";
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                    queryTask.execute(query, districtBreakdownQueryHandler, districtBreakdownQueryFault)
                }

            }

            /**
             * [getStateBreakDown]
             * @return {stateBreakdownQueryHandler}
             * @return {stateBreakdownQueryFault} [error]
             */
            function getStateBreakDown() {
                var queryTask;
                var query;

                if (selectedYear === "2015") {
                    qtask();
                }
                if (selectedYear === "2016") {
                    qtask();
                }
                if (selectedYear === "2017") {
                    qtask();
                }

                function qtask() {
                    queryTask = new QueryTask(appConfig.mainURL + "/1");
                    query = new Query();
                    query.where = "EntityID = -1";
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                    queryTask.execute(query, stateBreakdownQueryHandler, stateBreakdownQueryFault)
                }

            }
            //================================================================================================>

            /**
             * [schoolPointQueryFault]
             * @param  getSchoolPoint()
             * @return {error}
             */
            function schoolPointQueryFault(error) {
                console.log(error.messaege);
            };

            /**
             * [schoolPointQueryHandler]
             * @param  getSchoolPoint()
             * @return {error}
             */
            function schoolPointQueryHandler(response) {
                var feature = response.features[0];
                // console.log(feature);

                var pin;
                // https://developers.arcgis.com/javascript/3/samples/portal_symbols/index.html
                if (selectedYear === "2015") {
                    pin = "http://static.arcgis.com/images/Symbols/Shapes/BluePin1LargeB.png";
                }
                if (selectedYear === "2016") {
                    pin = "http://static.arcgis.com/images/Symbols/Shapes/GreenPin1LargeB.png";
                }
                if (selectedYear === "2017") {
                    pin = "http://static.arcgis.com/images/Symbols/Shapes/PurplePin1LargeB.png";
                }

                var symbol = new PictureMarkerSymbol({
                    "angle": 0,
                    "xoffset": 0,
                    "yoffset": 10,
                    "type": "esriPMS",
                    "url": pin,
                    "contentType": "image/png",
                    "width": 34,
                    "height": 34
                });

                map.graphics.clear();
                var infoTemplate = new InfoTemplate();
                infoTemplate.setTitle("School");
                infoTemplate.setContent("${SchoolName}<br>${PAddress}<br>${PCity}");

                feature.setSymbol(symbol);
                feature.setInfoTemplate(infoTemplate);
                map.graphics.add(feature);
                // map.centerAt(feature.geometry);
                map.centerAndZoom(feature.geometry, 14);

            };

            /**
             * [azSchoolsQueryFault]
             * @param  getSchoolsData()
             * @return {error}
             */
            function azSchoolsQueryFault(error) {
                console.log(error.messaege);
            };

            /**
             * [azSchoolsQueryHandler]
             * @param  getSchoolsData()
             * @return {self.azMERITschools}
             */
            function azSchoolsQueryHandler(results) {
                var features = results.features;
                console.log(features);

                self.azSchools = [];
                $.each(features, function(index, item) {

                    self.azSchools.push({
                        sName: item.attributes.SchoolName,
                        dName: item.attributes.DistrictName,
                        dID: item.attributes.DistrictEntityID,
                        entityID: item.attributes.EntityID,
                        FY: item.attributes.FY,
                        address: item.attributes.PAddress,
                        city: item.attributes.PCity,
                        zip: item.attributes.ZIPcode,
                        grades: item.attributes.GradesServed,
                        sClass: item.attributes.EntityClass,
                        sType: item.attributes.SchoolType,
                        active: item.attributes.Active,
                        titleI: item.attributes.TitleI,
                        frl: item.attributes.FRL,
                        grade: item.attributes.Grade
                    });
                });
                console.log(self.azSchools);

                getschoolNames();
                getSchoolLocation();
                // azMERITscatterChart();
            };

            function azMERITdistQueryFault(error) {
                console.log(error.messaege);
            };
            /**
             * [azMERITdistQueryHandler description]
             * @param  getDistrictData
             * @return
             */
            function azMERITdistQueryHandler(results) {
                var features = results.features;
                // console.log(features);

                self.distInfo = [];
                $.each(features, function(index, item) {
                    var groupScore, vColor;
                    if (item.attributes.GROUP1 === "A") {
                        groupScore = "Very High";
                        vColor = "#028900";
                    }
                    if (item.attributes.GROUP1 === "B") {
                        groupScore = "High";
                        vColor = "#0057e7";
                    }
                    if (item.attributes.GROUP1 === "C") {
                        groupScore = "Middle";
                        vColor = "#9e379f";
                    }
                    if (item.attributes.GROUP1 === "D") {
                        groupScore = "Low";
                        vColor = "#ffa700";
                    }
                    if (item.attributes.GROUP1 === "F") {
                        groupScore = "Very Low";
                        vColor = "#d62d20";
                    }
                    self.distInfo.push({
                        sName: item.attributes.SchoolName,
                        dName: item.attributes.DistrictName,
                        dID: item.attributes.DistrictEntityID,
                        entityID: item.attributes.EntityID,
                        FY: item.attributes.FY,
                        address: item.attributes.Address,
                        city: item.attributes.City,
                        zip: item.attributes.ZIPcode,
                        grades: item.attributes.Grades,
                        sClass: item.attributes.SchoolClass,
                        sType: item.attributes.SchoolType,
                        ELA1: item.attributes.ELA1,
                        ELA2: item.attributes.ELA2,
                        ELA3: item.attributes.ELA3,
                        ELA4: item.attributes.ELA4,
                        ELAP: item.attributes.ELAP,
                        MATH1: item.attributes.MATH1,
                        MATH2: item.attributes.MATH2,
                        MATH3: item.attributes.MATH3,
                        MATH4: item.attributes.MATH4,
                        MATHP: item.attributes.MATHP,
                        group: groupScore,
                        sort: item.attributes.GROUP1,
                        active: item.attributes.Active,
                        vColor: vColor
                    });
                });
                // console.log(self.distInfo);
                buildDgrid();
                azMERITdistrictScatter();
            };

            function breakdownQueryFault(error) {
                console.log(error.messaege);
            };

            function breakdownQueryHandler(results) {
                var features = results.features;
                // console.log(features);

                self.breakdownELA = [];
                self.breakdownMATH = [];
                $.each(features, function(index, item) {
                    if (item.attributes.ContentArea === ELA) {
                        self.breakdownELA.push({
                            entityID: item.attributes.EntityID,
                            distID: item.attributes.DistrictEntityID,
                            countyID: item.attributes.CountyEntityID,
                            schoolID: item.attributes.SchoolEntityID,
                            FY: item.attributes.FY,
                            // area: item.attributes.ContentAreaDef,
                            // group: item.attributes.SubgroupDef,
                            level: item.attributes.TestLevel,
                            ELA1: item.attributes.PCT_PL1,
                            ELA2: item.attributes.PCT_PL2,
                            ELA3: item.attributes.PCT_PL3,
                            ELA4: item.attributes.PCT_PL4,
                            ELAP: item.attributes.PCT_Passing,
                            REDACT: item.attributes.PCT_Redacted,
                        });
                    }
                    if (item.attributes.ContentArea === MATH) {
                        self.breakdownMATH.push({
                            entityID: item.attributes.EntityID,
                            distID: item.attributes.DistrictEntityID,
                            countyID: item.attributes.CountyEntityID,
                            schoolID: item.attributes.SchoolEntityID,
                            FY: item.attributes.FY,
                            // area: item.attributes.ContentAreaDef,
                            // group: item.attributes.SubgroupDef,
                            level: item.attributes.TestLevel,
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
                    if (item.attributes.ContentArea === ELA) {
                        self.elaLevels.push({
                            level: item.attributes.TestLevel,
                            sort: item.attributes.TestOrder
                        });
                    }
                    if (item.attributes.ContentArea === MATH) {
                        self.mathLevels.push({
                            level: item.attributes.TestLevel,
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
            };

            function districtBreakdownQueryFault(error) {
                console.log(error.messaege);
            };

            /**
             * [districtBreakdownQueryHandler description]
             * @param  {[type]} results [description]
             * @return {[type]}         [description]
             */
            function districtBreakdownQueryHandler(results) {
                var features = results.features;
                // console.log(features);

                self.districtELA = [];
                self.districtMATH = [];
                var districtAZMERITela = [];
                var districtAZMERITmath = [];
                $.each(features, function(index, item) {
                    if (item.attributes.ContentArea === ELA && item.attributes.TestLevel === "All Students") {
                        self.districtELA.push({
                            entityID: item.attributes.EntityID,
                            FY: item.attributes.FY,
                            // area: item.attributes.ContentAreaDef,
                            // group: item.attributes.SubgroupDef,
                            level: item.attributes.TestLevel,
                            ELA1: item.attributes.PCT_PL1,
                            ELA2: item.attributes.PCT_PL2,
                            ELA3: item.attributes.PCT_PL3,
                            ELA4: item.attributes.PCT_PL4,
                            ELAP: item.attributes.PCT_Passing,
                            ELARDT: item.attributes.PCT_Redacted
                        });
                        if (item.attributes.TestLevel === "All Students") {
                            districtAZMERITela.push({
                                ELA1: item.attributes.PCT_PL1,
                                ELA2: item.attributes.PCT_PL2,
                                ELA3: item.attributes.PCT_PL3,
                                ELA4: item.attributes.PCT_PL4,
                                ELAP: item.attributes.PCT_Passing,
                                ELARDT: item.attributes.PCT_Redacted
                            });
                        }
                    }
                    if (item.attributes.ContentArea === MATH && item.attributes.TestLevel === "All Students") {
                        self.districtMATH.push({
                            entityID: item.attributes.EntityID,
                            FY: item.attributes.FY,
                            // area: item.attributes.ContentAreaDef,
                            // group: item.attributes.SubgroupDef,
                            level: item.attributes.TestLevel,
                            MATH1: item.attributes.PCT_PL1,
                            MATH2: item.attributes.PCT_PL2,
                            MATH3: item.attributes.PCT_PL3,
                            MATH4: item.attributes.PCT_PL4,
                            MATHP: item.attributes.PCT_Passing,
                            MATHRDT: item.attributes.PCT_Redacted
                        });
                        if (item.attributes.TestLevel === "All Students") {
                            districtAZMERITmath.push({
                                MATH1: item.attributes.PCT_PL1,
                                MATH2: item.attributes.PCT_PL2,
                                MATH3: item.attributes.PCT_PL3,
                                MATH4: item.attributes.PCT_PL4,
                                MATHP: item.attributes.PCT_Passing,
                                MATHRDT: item.attributes.PCT_Redacted
                            });
                        }
                    }

                });
                // console.log(self.districtELA);
                // console.log(self.districtMATH);
                // console.log(districtAZMERITela);
                // console.log(districtAZMERITmath);
                self.districtAll = $.extend({}, districtAZMERITela[0], districtAZMERITmath[0]);
                // console.log(self.districtAll);
                // createDistrictStateChart();
            };

            function stateBreakdownQueryFault(error) {
                console.log(error.messaege);
            };

            function stateBreakdownQueryHandler(results) {
                var features = results.features;
                // console.log(features);

                self.stateELA = [];
                self.stateMATH = [];
                var stateELAall = [];
                var stateMATHall = [];
                $.each(features, function(index, item) {
                    if (item.attributes.ContentArea === ELA && item.attributes.TestLevel === "All Students") {
                        self.stateELA.push({
                            entityID: item.attributes.EntityID,
                            FY: item.attributes.FY,
                            // area: item.attributes.ContentAreaDef,
                            // group: item.attributes.SubgroupDef,
                            level: item.attributes.TestLevel,
                            ELA1: item.attributes.PCT_PL1,
                            ELA2: item.attributes.PCT_PL2,
                            ELA3: item.attributes.PCT_PL3,
                            ELA4: item.attributes.PCT_PL4,
                            ELAP: item.attributes.PCT_Passing,
                            ELARDT: item.attributes.PCT_Redacted
                        });
                        if (item.attributes.TestLevel === "All Students") {
                            stateELAall.push({
                                ELA1: item.attributes.PCT_PL1,
                                ELA2: item.attributes.PCT_PL2,
                                ELA3: item.attributes.PCT_PL3,
                                ELA4: item.attributes.PCT_PL4,
                                ELAP: item.attributes.PCT_Passing,
                                ELARDT: item.attributes.PCT_Redacted
                            });
                        }
                    }
                    if (item.attributes.ContentArea === MATH && item.attributes.TestLevel === "All Students") {
                        self.stateMATH.push({
                            entityID: item.attributes.EntityID,
                            FY: item.attributes.FY,
                            // area: item.attributes.ContentAreaDef,
                            // group: item.attributes.SubgroupDef,
                            level: item.attributes.TestLevel,
                            MATH1: item.attributes.PCT_PL1,
                            MATH2: item.attributes.PCT_PL2,
                            MATH3: item.attributes.PCT_PL3,
                            MATH4: item.attributes.PCT_PL4,
                            MATHP: item.attributes.PCT_Passing,
                            MATHRDT: item.attributes.PCT_Redacted
                        });
                        if (item.attributes.TestLevel === "All Students") {
                            stateMATHall.push({
                                MATH1: item.attributes.PCT_PL1,
                                MATH2: item.attributes.PCT_PL2,
                                MATH3: item.attributes.PCT_PL3,
                                MATH4: item.attributes.PCT_PL4,
                                MATHP: item.attributes.PCT_Passing,
                                MATHRDT: item.attributes.PCT_Redacted
                            });
                        }
                    }

                });
                // console.log(self.stateELA);
                // console.log(self.stateMATH);
                // console.log(stateELAall);
                // console.log(stateMATHall);

                self.stateAll = $.extend({}, stateELAall[0], stateMATHall[0]);
                // console.log(self.stateAll);
                self.typeA = "ELA";
                self.tLevel = "All Students";

                testLevel();
                createAllMERITChart();
                createDistrictStateChart();
            };


            /**
             * Used to change the Test Level
             * http://bootsnipp.com/snippets/featured/funky-radio-buttons
             */
            $("body").on("change", "#fradio :input", function() {
                self.tLevel = this.labels[0].innerHTML;
                // console.log(self.tLevel);
                createAllMERITChart();
            });

            /**
             * Used to change the Assessment Type [ELA/MATH]
             */
            $("#typeAssess :input").change(function() {
                // console.log(this.value);
                self.typeA = this.value;
                self.tLevel = "All Students";

                testLevel();
                createAllMERITChart();
            });

            function schoolScoresQueryFault(error) {
                console.log(error.messaege);
            };

            function schoolScoresQueryHandler(results) {
                var features2015 = results[0].features;
                var features2016 = results[1].features;
                // console.log(features2015);
                // console.log(features2016);

                var info2015ela;
                var info2015math;
                if (features2015.length != 0) {
                    info2015ela = features2015[0].attributes;
                    info2015math = features2015[1].attributes;
                } else {
                    info2015ela = 0;
                    info2015math = 0;
                    info2015ela.PCT_Passing = 0;
                    info2015math.PCT_Passing = 0;
                }

                var info2016ela;
                var info2016math;
                if (features2016.length != 0) {
                    info2016ela = features2016[0].attributes;
                    info2016math = features2016[1].attributes;
                } else {
                    info2016ela = 0;
                    info2016math = 0;
                    info2016ela.PCT_Passing = 0;
                    info2016math.PCT_Passing = 0;
                }

                var e1, e2;
                if (selectedYear === "2016") {
                    e1 = info2016ela;
                    e2 = info2016math;
                    score(e1, e2);
                }
                if (selectedYear === "2015") {
                    e1 = info2015ela;
                    e2 = info2015math;
                    score(e1, e2);
                }

                function score(e1, e2) {

                    if (e1.PCT_Passing > 0) {
                        dom.byId("elaScore").innerHTML = e1.PCT_Passing + "%";
                        createChartELA(e1);
                    } else {
                        dom.byId("elaScore").innerHTML = "N/A";
                        dom.byId("elaChart").innerHTML = "<p class='chartGone'>Chart</p><p class='pCG'>N/A</p>";
                        domClass.add("elaChart", "chartGoneNA");
                    }
                    if (e2.PCT_Passing > 0) {
                        dom.byId("mathScore").innerHTML = e2.PCT_Passing + "%";
                        createChartMATH(e2);
                    } else {
                        dom.byId("mathScore").innerHTML = "N/A";
                        dom.byId("mathChart").innerHTML = "<p class='chartGone'>Chart</p><p class='pCG'>N/A</p>";
                        domClass.add("mathChart", "chartGoneNA");
                    }
                }

                function diffScore() {

                    if (info2015ela.PCT_Passing < 0) {
                        info2015ela.PCT_Passing = 0;
                    }
                    if (info2016ela.PCT_Passing < 0) {
                        info2016ela.PCT_Passing = 0;
                    }
                    if (info2015math.PCT_Passing < 0) {
                        info2015math.PCT_Passing = 0;
                    }
                    if (info2016math.PCT_Passing < 0) {
                        info2016math.PCT_Passing = 0;
                    }

                    var elaChange = info2016ela.PCT_Passing - info2015ela.PCT_Passing;
                    var mathChange = info2016math.PCT_Passing - info2015math.PCT_Passing;

                    var ec1 = isNaN(elaChange);
                    var mc1 = isNaN(mathChange);

                    var upARROW = '<img class="arrow" src="./app/images/arrowUp.png" alt="UP">';
                    var downARROW = '<img class="arrow" src="./app/images/arrowDown.png" alt="Down">';
                    var noARROW = '<img class="noarrow" src="./app/images/arrowSide.png" alt="Side">';

                    if (selectedYear === "2016") {
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
                    } else {
                        dc.empty("elaChange");
                        dc.empty("elaArrow");
                        dc.empty("mathChange");
                        dc.empty("mathArrow");
                    }

                }
                diffScore();
            };
            //============================================================================================================>

            function testLevel() {
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
             * [getSchoolNames] - populates the dropdown menu for "Find a School"
             * Data from [azSchoolsQueryHandler] via [getSchoolsData();]
             * @return
             */
            function getSchoolNames() {
                // console.log(self.azSchools);

                $("#schools").kendoDropDownList({
                    dataTextField: "sName",
                    dataValueField: "entityID",
                    template: "${data.sName}" + " - <span style='font-size: 12px;'>${data.city}" + " (${data.entityID})</span>",
                    dataSource: {
                        data: self.azSchools,
                        sort: {
                            field: "sName",
                            dir: "asc"
                        }
                        // filter: {
                        //     field: "active",
                        //     operator: "eq",
                        //     value: "Y"
                        // }
                    },
                    index: 0,
                    change: onChange
                });

                var schoolData = $("#schools").data("kendoDropDownList");
                self.dataItem = schoolData.dataItem();

                // school name & district name
                dom.byId("schoolName0").innerHTML = self.dataItem.sName;
                dom.byId("districtName0").innerHTML = self.dataItem.dName;
                dom.byId("sNUM0").innerHTML = "&nbsp;(" + self.dataItem.entityID + ")";
                dom.byId("schoolName1").innerHTML = self.dataItem.sName;
                dom.byId("districtName1").innerHTML = self.dataItem.dName;
                dom.byId("sNUM1").innerHTML = "&nbsp;(" + self.dataItem.entityID + ")";
                dom.byId("schoolName2").innerHTML = self.dataItem.sName;
                dom.byId("districtName2").innerHTML = self.dataItem.dName;
                dom.byId("sNUM2").innerHTML = "&nbsp;(" + self.dataItem.entityID + ")";

                dom.byId("info1").innerHTML = self.dataItem.sClass + " School&nbsp;&nbsp;|&nbsp;&nbsp;" + self.dataItem.sType + "&nbsp;&nbsp;|&nbsp;&nbsp;" + self.dataItem.grades;
                dom.byId("info2").innerHTML = self.dataItem.address + " " + self.dataItem.city + ", AZ " + self.dataItem.zip;

                var dID = dataItem.dID;
                getSchoolScores();
                getBreakDown();
                getDistrictBreakDown(dID);
                getStateBreakDown();
                getDistrictData(dID);
                // console.log(self.dataItem);

                gradeBadge();
                titleIBadge();
                freeReducedBadge();

                function onChange() {
                    var value = $("#schools").val();
                    var schoolData = $("#schools").data("kendoDropDownList");
                    self.dataItem = schoolData.dataItem();

                    var dID = dataItem.dID;

                    // school name & district name
                    dom.byId("schoolName0").innerHTML = self.dataItem.sName;
                    dom.byId("districtName0").innerHTML = self.dataItem.dName;
                    dom.byId("sNUM0").innerHTML = "&nbsp;(" + self.dataItem.entityID + ")";
                    dom.byId("schoolName1").innerHTML = self.dataItem.sName;
                    dom.byId("districtName1").innerHTML = self.dataItem.dName;
                    dom.byId("sNUM1").innerHTML = "&nbsp;(" + self.dataItem.entityID + ")";
                    dom.byId("schoolName2").innerHTML = self.dataItem.sName;
                    dom.byId("districtName2").innerHTML = self.dataItem.dName;
                    dom.byId("sNUM2").innerHTML = "&nbsp;(" + self.dataItem.entityID + ")";

                    dom.byId("info1").innerHTML = self.dataItem.sClass + " School&nbsp;&nbsp;|&nbsp;&nbsp;" + self.dataItem.sType + "&nbsp;&nbsp;|&nbsp;&nbsp;" + self.dataItem.grades;
                    dom.byId("info2").innerHTML = self.dataItem.address + " " + self.dataItem.city + ", AZ " + self.dataItem.zip;

                    getSchoolScores();
                    getSchoolLocation();
                    getBreakDown();
                    getDistrictBreakDown(dID);
                    getStateBreakDown();
                    getDistrictData(dID);

                    gradeBadge();
                    titleIBadge();
                    freeReducedBadge();

                    // toggles the Assessment Type back to ELA from MATH
                    $("#option1").parents('.btn').button('toggle');

                    // console.log(self.dataItem);
                };
            };

            /**
             * [gradeBadge description]
             * @return {[type]} [description]
             */
            function gradeBadge() {
                var emptyTEST = $("#info3").is(":empty");
                if (emptyTEST === false) {
                    dc.destroy("gradeBadge");
                }

                var year = self.dataItem.FY;
                var schoolGrade = self.dataItem.grade;
                // console.log(schoolGrade);
                var gradeClass;
                var grade;
                var gradeInfo;

                if (schoolGrade >= 80) {
                    gradeClass = "letterGrade gradeA";
                    grade = "class='grade'";
                }
                if (schoolGrade >= 60 && schoolGrade < 80) {
                    gradeClass = "letterGrade gradeB";
                    grade = "class='grade'";
                }
                if (schoolGrade >= 40 && schoolGrade < 60) {
                    gradeClass = "letterGrade gradeC";
                    grade = "class='grade2'";
                }
                if (schoolGrade >= 20 && schoolGrade < 40) {
                    gradeClass = "letterGrade gradeD";
                    grade = "class='grade'";
                }
                if (schoolGrade >= 0 && schoolGrade < 20) {
                    gradeClass = "letterGrade gradeF";
                    grade = "class='grade'";
                }
                gradeInfo = year + "</br>GRADE" + "<p " + grade + ">" + schoolGrade + "%</p>";

                if (schoolGrade < 0) {
                    gradeClass = "letterGrade gradeNA";
                    schoolGrade = "N/A";
                    grade = "class='grade'";
                    gradeInfo = year + "</br>GRADE" + "<p " + grade + ">" + schoolGrade + "</p>";
                }

                dc.create("span", {
                    id: "gradeBadge",
                    className: gradeClass,
                    innerHTML: gradeInfo
                }, "info3", "first");

            };

            /**
             * Places title I badge if school is title I
             * @return {[type]} [description]
             */
            function titleIBadge() {
                var emptyTEST = $("#info4").is(":empty");
                if (emptyTEST === false) {
                    dc.destroy("titleIBadge");
                }
                var year = self.dataItem.FY;
                // console.log(self.dataItem.titleI);
                if (self.dataItem.titleI === "Y") {
                    dc.create("span", {
                        id: "titleIBadge",
                        className: "titleI",
                        innerHTML: year + "<p class='t1'>Title I</br>School</p>"
                    }, "info4", "first");
                } else {
                    dc.destroy("titleIBadge");
                }
            };

            /**
             * Places Free and Reduced badge for school info
             * @return {[type]} [description]
             */
            function freeReducedBadge() {
                var emptyTEST = $("#info4").is(":empty");
                if (emptyTEST === false) {
                    dc.destroy("freeBadge");
                }
                var year = self.dataItem.FY;
                // console.log(self.dataItem.frl);
                if (self.dataItem.frl !== "-9") {
                    dc.create("span", {
                        id: "freeBadge",
                        className: "freeRed",
                        innerHTML: year + "<p class='r1'>Free & Reduced Lunch</p>" + "<p class='r2'>" + self.dataItem.frl + "</p>"
                    }, "info4", "second");
                } else if (self.dataItem.frl === "-9") {
                    dc.create("span", {
                        id: "freeBadge",
                        className: "freeRed",
                        innerHTML: year + "<p class='r1'>Free & Reduced Lunch</p>" + "<p class='r2'>N/A</p>"
                    }, "info4", "second");
                } else {
                    dc.destroy("freeBadge");
                }
            };

            function chronicBadge() {

            }

            /**
             * [azMERITAllSchoolsChart] - Shows all schools and their AzMERIT score in scatter chart.
             * Data from [azSchoolsQueryHandler] via [getSchoolsData();]
             * @return
             */
            function azMERITscatterChart() {
                console.log(self.azMERITschools);
                $("#azMERITchartSchools").kendoChart({
                    theme: "Silver",
                    title: {
                        text: "AzMERIT Schools Percent Passing" + " " + selectedYear
                    },
                    dataSource: {
                        data: self.azMERITschools,
                        filter: {
                            field: "group",
                            operator: "isnotnull"
                        },
                        group: {
                            field: "sort"
                        },
                        sort: {
                            field: "sort",
                            dir: "asc"
                        }
                    },
                    legend: {
                        position: "bottom"
                    },
                    seriesDefaults: {
                        type: "scatter"
                    },
                    series: [{
                        xField: "ELAP",
                        yField: "MATHP",
                        name: "#= group.items[0].group #"
                    }],
                    seriesColors: ["#028900", "#0057e7", "#9e379f", "#ffa700", "#d62d20", "#777777"],
                    xAxis: {
                        max: 100,
                        title: {
                            text: "ELA Percent Passing"
                        },
                        labels: {
                            template: "${ value }%"
                        }
                    },
                    yAxis: {
                        min: 0,
                        max: 100,
                        title: {
                            text: "Math Percent Passing"
                        },
                        labels: {
                            template: "${ value }%"
                        }
                    },
                    tooltip: {
                        visible: true,
                        template: "${ dataItem.sName } <br>ELA - ${ dataItem.ELAP }% <br>MATH - ${ dataItem.MATHP }% "
                    }
                });
            };

            /**
             * [azMERITdistrictScatter] - Shows District schools and their AzMERIT score in scatter chart.
             * Data from [azMERITdistQueryHandler] via [getDistrictData();]
             * @return
             */
            function azMERITdistrictScatter() {
                // console.log(self.distInfo);
                dom.byId("distName1").innerHTML = self.distInfo[0].dName;
                dom.byId("distNum1").innerHTML = "(" + self.distInfo[0].dID + ")";

                $("#azMERITdistrictScatter").kendoChart({
                    theme: "Silver",
                    title: {
                        text: "AzMERIT District Schools Percent Passing" + " " + selectedYear
                    },
                    dataSource: {
                        data: self.distInfo,
                        filter: {
                            field: "group",
                            operator: "isnotnull"
                        },
                        group: {
                            field: "sort"
                        },
                        sort: {
                            field: "sort",
                            dir: "asc"
                        }
                    },
                    legend: {
                        position: "bottom"
                    },
                    seriesDefaults: {
                        type: "scatter"
                    },
                    series: [{
                        xField: "ELAP",
                        yField: "MATHP",
                        name: "#= group.items[0].group #",
                        colorField: "vColor"
                    }],
                    // seriesColors: ["#028900", "#0057e7", "#9e379f", "#ffa700", "#d62d20", "#777777"],
                    xAxis: {
                        max: 100,
                        title: {
                            text: "ELA Percent Passing"
                        },
                        labels: {
                            template: "${ value }%"
                        }
                    },
                    yAxis: {
                        min: 0,
                        max: 100,
                        title: {
                            text: "Math Percent Passing"
                        },
                        labels: {
                            template: "${ value }%"
                        }
                    },
                    tooltip: {
                        visible: true,
                        template: "${ dataItem.sName } <br>ELA - ${ dataItem.ELAP }% <br>MATH - ${ dataItem.MATHP }% "
                    }
                });
            };



            /**
             * [createChartELA - Pie Chart]
             *  * Data from [schoolScoresQueryHandler] via [getSchoolScores();]
             * @return {Pie Chart} [showing schools breakdown of AzMERIT scores for all students]
             */
            function createChartELA(e) {
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
            function createChartMATH(e) {
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
             * [createDistrictStateChart description]
             * * Data from countyQueryHandler via [getCountyData();]
             * @return {[type]} [Bar Chart] self.districtELA
             */
            function createDistrictStateChart() {
                // console.log(self.districtAll);
                // console.log(self.stateAll);

                var districtAll = self.districtAll;
                var stateAll = self.stateAll;

                var dataStack = [];
                dataStack.push(districtAll, stateAll);

                seriesINFO = [{
                    name: "Redacted",
                    field: "ELARDT",
                    stack: {
                        group: "ELA"
                    },
                    color: "#c0c0c0"
                }, {
                    name: "Minimally Proficient",
                    field: "ELA1",
                    stack: {
                        group: "ELA"
                    },
                    color: "#910000"
                }, {
                    name: "Partially Proficient",
                    field: "ELA2",
                    stack: {
                        group: "ELA"
                    },
                    color: "#d9900a"
                }, {
                    name: "Proficient",
                    field: "ELA3",
                    stack: {
                        group: "ELA"
                    },
                    color: "#2995e0"
                }, {
                    name: "Highly Proficient",
                    field: "ELA4",
                    stack: {
                        group: "ELA"
                    },
                    color: "#50be09"
                }, {
                    name: "Redacted",
                    field: "MATHRDT",
                    stack: {
                        group: "MATH"
                    },
                    color: "#c0c0c0"
                }, {
                    name: "Minimally Proficient",
                    field: "MATH1",
                    stack: {
                        group: "MATH"
                    },
                    color: "#910000"
                }, {
                    name: "Partially Proficient",
                    field: "MATH2",
                    stack: {
                        group: "MATH"
                    },
                    color: "#d9900a"
                }, {
                    name: "Proficient",
                    field: "MATH3",
                    stack: {
                        group: "MATH"
                    },
                    color: "#2995e0"
                }, {
                    name: "Highly Proficient",
                    field: "MATH4",
                    stack: {
                        group: "MATH"
                    },
                    color: "#50be09"
                }];

                buildChart();

                function buildChart() {
                    $("#compChart").kendoChart({
                        // title: {
                        //     text: "Sample"
                        // },
                        legend: {
                            visible: false,
                            position: "bottom"
                        },
                        dataSource: {
                            data: dataStack
                        },
                        series: seriesINFO,
                        dataBound: function(e) {
                            // console.log(e);
                            // var R1 = e.sender.options.series[0].data[0].ELARDT;
                            // var R2 = e.sender.options.series[5].data[0].ELARDT;
                            // // console.log("R1: "+ R1 +" & R2: "+ R2);
                            // if (R1 == 0) {
                            e.sender.options.series[0].labels.visible = false;
                            // }
                            // if (R2 == 0) {
                            e.sender.options.series[5].labels.visible = false;
                            // }
                        },
                        seriesDefaults: {
                            type: "column",
                            stack: {
                                type: "100%"
                            },
                            labels: {
                                visible: true,
                                background: "transparent",
                                format: "{0}%",
                                font: "bold italic 12px Open Sans Condensed,Verdana,sans-serif",
                                padding: -25
                            },
                            gap: 0.5,
                            spacing: 0.10
                        },
                        valueAxis: {
                            visible: true,
                            max: 1,
                            labels: {
                                format: "{0}%",
                                template: "${ value * 100}%"
                            },
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: true
                            }
                        },
                        categoryAxis: {
                            categories: ["District", "State"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: true
                            }
                        },
                        tooltip: {
                            visible: true,
                            template: "${ series.stack.group }<br/>${ series.name }<br/>${ value }%"
                        }
                    });
                }
            };

            /**
             * [createAllMERITChart] - gives the AzMERIT Student breakdown for each student group
             * @data from [breakdownQueryHandler] via []
             * @return {[type]} [description]
             */
            function createAllMERITChart() {
                // console.log(self.breakdownELA);
                // console.log(self.stateELA);
                // console.log(self.districtELA);
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
                    "FY": selectedYear,
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
                    "FY": selectedYear,
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
                buildChart1();

                /**
                 * [buildChart - Bar Chart showing four categories of Proficiency]
                 * @return {[type]} [description]
                 */
                function buildChart() {
                    var seriesINFO;
                    if (self.typeA === "ELA") {
                        title = selectedYear + " ELA Proficiency Results",
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
                        title = selectedYear + " MATH Proficiency Results",
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
                    if (self.typeA === "ELA") {
                        title = selectedYear + " ELA Percent Passed",

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
                        title = selectedYear + " MATH Percent Passed",
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

            /**
             * [buildDgrid] - District Summary Grid
             * @return {[type]} [description]
             */
            function buildDgrid() {
                dom.byId("distName").innerHTML = self.distInfo[0].dName;
                dom.byId("distNum").innerHTML = "(" + self.distInfo[0].dID + ")";

                $("#grid").kendoGrid({
                    dataSource: {
                        data: self.distInfo
                    },
                    // height: 550,
                    groupable: false,
                    sortable: true,
                    pageable: false,
                    columns: [{
                        field: "dID",
                        title: "District ID",
                        headerAttributes: {
                            "class": "grid-header-style"
                        },
                        width: 70

                    }, {
                        field: "entityID",
                        title: "School ID",
                        headerAttributes: {
                            "class": "grid-header-style"
                        },
                        width: 70
                    }, {
                        field: "sName",
                        title: "School Name",
                        headerAttributes: {
                            "class": "grid-header-style"
                        },
                        width: 260
                    }, {
                        field: "sClass",
                        title: "School Class",
                        headerAttributes: {
                            "class": "grid-header-style"
                        },
                        width: 70
                    }, {
                        field: "sType",
                        title: "School Type",
                        headerAttributes: {
                            "class": "grid-header-style"
                        },
                        width: 80
                    }, {
                        field: "grades",
                        title: "Grades",
                        headerAttributes: {
                            "class": "grid-header-style"
                        },
                        width: 150
                    }, {
                        field: "active",
                        title: "Active",
                        headerAttributes: {
                            "class": "grid-header-style"
                        },
                        attributes: {
                            "class": "kendoGridCenter"
                        },
                        width: 60
                    }, {
                        field: "ELAP",
                        title: "% Passing ELA",
                        format: "{0:p0 %}",
                        template: '#= kendo.format("{0:p0}", ELAP / 100) #',
                        headerAttributes: {
                            "class": "grid-header-style"
                        },
                        attributes: {
                            "class": "kendoGridCenter"
                        },
                        width: 80
                    }, {
                        field: "MATHP",
                        title: "% Passing MATH",
                        format: "{0:p0 %}",
                        template: '#= kendo.format("{0:p0}", MATHP / 100) #',
                        headerAttributes: {
                            "class": "grid-header-style"
                        },
                        attributes: {
                            "class": "kendoGridCenter"
                        },
                        width: 80
                    }]
                });

            }



        });
    // end main function
}

$(document).ready(function() {
    //*** Info binding
    $("#infoModal").load("app/views/info-view.html");
    $("#legalModal").load("app/views/legal-view.html");

});

/**
 * This is used to open a new window with email contact info
 * @return {[type]} [description]
 */
function openEmailwin() {
    var emailURL = "https://www.azmag.gov/EmailPages/JasonHoward.asp";

    // used to center popup in dual-screen computers
    // Fixes dual-screen position               Most browsers      Firefox
    var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
    var w = 600;
    var h = 660;
    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;

    var newWindow = window.open(emailURL, "", "resizable=no,location=no,menubar=no,status=no,toolbar=no,fullscreen=no,dependent=no,directories=no,copyhistory=no,scrollbars=no, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left);

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }
};
