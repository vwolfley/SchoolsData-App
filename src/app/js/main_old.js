/* ========================================================================
 * Maricopa Association of Governments
 *
 * MAG AzMERIT Data Viewer
 * JS document for the MAG AzMERIT Data Viewer
 *
 * ========================================================================
 * @project     MAG AzMERIT Data Viewer
 * @version     0.0.2
 * @jsdoc       main.js
 * @copyright   2016 MAG
 * @license     Licensed under MIT
 * ======================================================================== */

$(document).ready(function() {
    setTimeout(setup, 500);
});

function setup() {
    var selectedYear = "2016";
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
        function(parser, all, dom, on, dc, domClass, arrayUtils, Query, QueryTask, StatisticDefinition, Map, FeatureLayer, InfoTemplate, Point, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, PictureMarkerSymbol, Graphic, Color, Extent, appConfig) {
            parser.parse();

            $("#year-filtering-tabs").kendoTabStrip({
                dataSource: ["2015", "2016"],
                change: function(e) {
                    selectedYear = this.value();

                    $(".selected-year").text(selectedYear);

                    schoolNames();
                    getData();
                }
            }).data("kendoTabStrip").select(1);
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

            /**
             * [getData]
             * @return {azMERITAllQueryHandler}
             * @return {azMERITAllQueryFault} [error]
             */
            function getData() {
                var queryTask;
                var query;

                if (selectedYear === "2015") {
                    queryTask = new QueryTask(appConfig.mainURL + "/0");
                    query = new Query();
                    query.where = "SchoolID > 0 AND FY = '2015'";
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                }
                if (selectedYear === "2016") {
                    queryTask = new QueryTask(appConfig.mainURL + "/1");
                    query = new Query();
                    query.where = "SchoolID > 0 AND FY = '2016'";
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                }
                queryTask.execute(query, azMERITAllQueryHandler, azMERITAllQueryFault)
            }

            /**
             * [getSchoolPoint]
             * @return {schoolPointQueryHandler}
             * @return {schoolPointQueryFault} [error]
             */
            function getSchoolPoint() {
                var queryTask;
                var query;

                if (selectedYear === "2015") {
                    queryTask = new QueryTask(appConfig.mainURL + "/0");
                    query = new Query();
                    query.where = "ENTITYID = " + self.dataItem.entityID;
                    query.returnGeometry = true;
                    query.outFields = ["*"];
                }
                if (selectedYear === "2016") {
                    queryTask = new QueryTask(appConfig.mainURL + "/1");
                    query = new Query();
                    query.where = "ENTITYID = " + self.dataItem.entityID;
                    query.returnGeometry = true;
                    query.outFields = ["*"];
                }
                queryTask.execute(query, schoolPointQueryHandler, schoolPointQueryFault)
            }

            function getDistrictData(dID) {
                var queryTask;
                var query;

                if (selectedYear === "2015") {
                    queryTask = new QueryTask(appConfig.mainURL + "/0");
                    query = new Query();
                    query.where = "DISTRICTID = " + dID;
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                }
                if (selectedYear === "2016") {
                    queryTask = new QueryTask(appConfig.mainURL + "/1");
                    query = new Query();
                    query.where = "DISTRICTID = " + dID;
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                }
                queryTask.execute(query, azMERITdistQueryHandler, azMERITdistQueryFault)
            }

            /**
             * [getData2]
             * @return {schoolsQueryHandler}
             * @return {schoolsQueryFault} [error]
             */
            function getData2() {
                var promises;
                var s2015;
                var s2016;

                qt2015 = new QueryTask(appConfig.mainURL + "/2");
                q2015 = new Query();
                qt2016 = new QueryTask(appConfig.mainURL + "/4");
                q2016 = new Query();

                q2015.returnGeometry = q2016.returnGeometry = false;
                q2015.outFields = q2016.outFields = ["*"];
                q2015.where = q2016.where = "EntityID = " + self.dataItem.entityID + " AND Subgroup = 'X' AND TestLevel = 'All Students'";

                s2015 = qt2015.execute(q2015);
                s2016 = qt2016.execute(q2016);
                promises = all([s2015, s2016]);
                promises.then(schoolsQueryHandler, schoolsQueryFault);
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
                    queryTask = new QueryTask(appConfig.mainURL + "/2");
                    query = new Query();
                    query.where = "EntityID = " + self.dataItem.entityID;
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                }
                if (selectedYear === "2016") {
                    queryTask = new QueryTask(appConfig.mainURL + "/4");
                    query = new Query();
                    query.where = "EntityID = " + self.dataItem.entityID;
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                }
                queryTask.execute(query, breakdownQueryHandler, breakdownQueryFault)
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
                    queryTask = new QueryTask(appConfig.mainURL + "/2");
                    query = new Query();
                    query.where = "EntityID = " + dID + "AND Subgroup = 'X'";
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                }
                if (selectedYear === "2016") {
                    queryTask = new QueryTask(appConfig.mainURL + "/4");
                    query = new Query();
                    query.where = "EntityID = " + dID + "AND Subgroup = 'X'";
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                }
                queryTask.execute(query, districtBreakdownQueryHandler, districtBreakdownQueryFault)
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
                    queryTask = new QueryTask(appConfig.mainURL + "/2");
                    query = new Query();
                    query.where = "EntityID = -1";
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                }
                if (selectedYear === "2016") {
                    queryTask = new QueryTask(appConfig.mainURL + "/4");
                    query = new Query();
                    query.where = "EntityID = -1";
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                }
                queryTask.execute(query, stateBreakdownQueryHandler, stateBreakdownQueryFault)
            }

            /**
             * [getCountyData]
             * @return {countyQueryHandler}
             * @return {countyQueryFault} [error]
             */
            function getCountyData() {
                var queryTask;
                var query;

                if (selectedYear === "2015") {
                    queryTask = new QueryTask(appConfig.mainURL + "/2");
                    query = new Query();
                    // query.where = "EntityID = " + self.countyID + " AND Subgroup = 'X' AND TestLevel = 'All Students'";
                    query.where = "EntityID = " + self.countyID;
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                }
                if (selectedYear === "2016") {
                    queryTask = new QueryTask(appConfig.mainURL + "/4");
                    query = new Query();
                    // query.where = "EntityID = " + self.countyID + " AND Subgroup = 'X' AND TestLevel = 'All Students'";
                    query.where = "EntityID = " + self.countyID;
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                }
                queryTask.execute(query, countyQueryHandler, countyQueryFault)
            }
            //================================================================================================>

            schoolPointQueryHandler, schoolPointQueryFault

            /**
             * [schoolPointQueryFault]
             * @param  getSchoolPoint()
             * @return {error}
             */
            function schoolPointQueryFault(error) {
                console.log(error.messaege);
            };

            /**
             * [schoolPointQueryFault]
             * @param  getSchoolPoint()
             * @return {error}
             */
            function schoolPointQueryHandler(response) {
                var feature = response.features[0];
                // console.log(feature);

                var symbol;
                if (selectedYear === "2015") {
                    symbol = new PictureMarkerSymbol({
                        "angle": 0,
                        "xoffset": 0,
                        "yoffset": 10,
                        "type": "esriPMS",
                        "url": "http://static.arcgis.com/images/Symbols/Shapes/BluePin1LargeB.png",
                        "contentType": "image/png",
                        "width": 34,
                        "height": 34
                    });

                }
                if (selectedYear === "2016") {
                    symbol = new PictureMarkerSymbol({
                        "angle": 0,
                        "xoffset": 0,
                        "yoffset": 10,
                        "type": "esriPMS",
                        "url": "http://static.arcgis.com/images/Symbols/Shapes/GreenPin1LargeB.png",
                        "contentType": "image/png",
                        "width": 34,
                        "height": 34
                    });
                }
                // https://developers.arcgis.com/javascript/3/samples/portal_symbols/index.html

                map.graphics.clear();
                var infoTemplate = new InfoTemplate();
                infoTemplate.setTitle("School");
                infoTemplate.setContent("${SchoolName}<br>${Address}<br>${City}");

                feature.setSymbol(symbol);
                feature.setInfoTemplate(infoTemplate);
                map.graphics.add(feature);
                // map.centerAt(feature.geometry);
                map.centerAndZoom(feature.geometry, 14);

            };

            /**
             * [azMERITAllQueryFault]
             * @param  getData()
             * @return {error}
             */
            function azMERITAllQueryFault(error) {
                console.log(error.messaege);
            };

            /**
             * [azMERITAllQueryHandler]
             * @param  getData()
             * @return {self.azMERITschools}
             */
            function azMERITAllQueryHandler(results) {
                var features = results.features;
                // console.log(features);

                // console.log("Schools - " + features.length);
                // dom.byId("schoolInfo").innerHTML = "<strong>" + features.length + "</strong></br>Number of Schools";

                self.azMERITschools = [];
                $.each(features, function(index, item) {
                    var groupScore;
                    if (item.attributes.GROUP1 === "A") {
                        groupScore = "Very High";
                    }
                    if (item.attributes.GROUP1 === "B") {
                        groupScore = "High";
                    }
                    if (item.attributes.GROUP1 === "C") {
                        groupScore = "Middle";
                    }
                    if (item.attributes.GROUP1 === "D") {
                        groupScore = "Low";
                    }
                    if (item.attributes.GROUP1 === "F") {
                        groupScore = "Very Low";
                    }
                    self.azMERITschools.push({
                        sName: item.attributes.SchoolName,
                        dName: item.attributes.DistrictName,
                        dID: item.attributes.DISTRICTID,
                        entityID: item.attributes.ENTITYID,
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
                        active: item.attributes.Active
                    });
                });
                // console.log(self.azMERITschools);

                azMERITAllSchoolsChart();
                // schoolNames();
                getBreakDown();
                getStateBreakDown();
                getSchoolPoint();
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
                        dID: item.attributes.DISTRICTID,
                        entityID: item.attributes.ENTITYID,
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
                    if (item.attributes.ContentArea === 675) {
                        self.breakdownELA.push({
                            entityID: item.attributes.EntityID,
                            distID: item.attributes.DistrictEntityID,
                            countyID: item.attributes.CountyEntityID,
                            schoolID: item.attributes.SchoolEntityID,
                            FY: item.attributes.FY,
                            area: item.attributes.ContentAreaDef,
                            group: item.attributes.SubgroupDef,
                            level: item.attributes.TestLevel,
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
                    if (item.attributes.ContentArea === 675) {
                        self.elaLevels.push({
                            level: item.attributes.TestLevel,
                            sort: item.attributes.SORT
                        });
                    }
                    if (item.attributes.ContentArea === 677) {
                        self.mathLevels.push({
                            level: item.attributes.TestLevel,
                            sort: item.attributes.SORT
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

                testLevel();
                // createAllMERITChart();

            };

            function districtBreakdownQueryFault(error) {
                console.log(error.messaege);
            };

            function districtBreakdownQueryHandler(results) {
                var features = results.features;
                // console.log(features);

                self.districtELA = [];
                self.districtMATH = [];
                $.each(features, function(index, item) {
                    if (item.attributes.ContentArea === 675 && item.attributes.SubgroupDef === "All") {
                        self.districtELA.push({
                            entityID: item.attributes.EntityID,
                            FY: item.attributes.FY,
                            area: item.attributes.ContentAreaDef,
                            group: item.attributes.SubgroupDef,
                            level: item.attributes.TestLevel,
                            ELA1: item.attributes.PCT_PL1,
                            ELA2: item.attributes.PCT_PL2,
                            ELA3: item.attributes.PCT_PL3,
                            ELA4: item.attributes.PCT_PL4,
                            ELAP: item.attributes.PCT_Passing,
                        });
                    }
                    if (item.attributes.ContentArea === 677 && item.attributes.SubgroupDef === "All") {
                        self.districtMATH.push({
                            entityID: item.attributes.EntityID,
                            FY: item.attributes.FY,
                            area: item.attributes.ContentAreaDef,
                            group: item.attributes.SubgroupDef,
                            level: item.attributes.TestLevel,
                            MATH1: item.attributes.PCT_PL1,
                            MATH2: item.attributes.PCT_PL2,
                            MATH3: item.attributes.PCT_PL3,
                            MATH4: item.attributes.PCT_PL4,
                            MATHP: item.attributes.PCT_Passing,
                        });
                    }

                });
                // console.log(self.districtELA);
                // console.log(self.districtMATH);

            };

            function stateBreakdownQueryFault(error) {
                console.log(error.messaege);
            };

            function stateBreakdownQueryHandler(results) {
                var features = results.features;
                // console.log(features);

                self.stateELA = [];
                self.stateMATH = [];
                $.each(features, function(index, item) {
                    if (item.attributes.ContentArea === 675 && item.attributes.SubgroupDef === "All") {
                        self.stateELA.push({
                            entityID: item.attributes.EntityID,
                            FY: item.attributes.FY,
                            area: item.attributes.ContentAreaDef,
                            group: item.attributes.SubgroupDef,
                            level: item.attributes.TestLevel,
                            ELA1: item.attributes.PCT_PL1,
                            ELA2: item.attributes.PCT_PL2,
                            ELA3: item.attributes.PCT_PL3,
                            ELA4: item.attributes.PCT_PL4,
                            ELAP: item.attributes.PCT_Passing,
                        });
                    }
                    if (item.attributes.ContentArea === 677 && item.attributes.SubgroupDef === "All") {
                        self.stateMATH.push({
                            entityID: item.attributes.EntityID,
                            FY: item.attributes.FY,
                            area: item.attributes.ContentAreaDef,
                            group: item.attributes.SubgroupDef,
                            level: item.attributes.TestLevel,
                            MATH1: item.attributes.PCT_PL1,
                            MATH2: item.attributes.PCT_PL2,
                            MATH3: item.attributes.PCT_PL3,
                            MATH4: item.attributes.PCT_PL4,
                            MATHP: item.attributes.PCT_Passing,
                        });
                    }

                });
                // console.log(self.stateELA);
                // console.log(self.stateMATH);

                self.typeA = "ELA";
                self.tLevel = "All Students";

                createAllMERITChart();

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

            function countyQueryFault(error) {
                console.log(error.messaege);
            };

            function countyQueryHandler(results) {
                // console.log(results.features);
                var countyInfo = results.features;

                // data for comparison scores charts
                self.countyELA = [];
                $.each(countyInfo, function(index, item) {
                    if (item.attributes.ContentArea === 675 && item.attributes.Subgroup === "X" && item.attributes.TestLevel === "All Students") {
                        self.countyELA.push(item.attributes);
                    }
                });
                // console.log(countyELA);
                self.countyELApassing = countyELA[0].PCT_Passing;

                self.countyMATH = [];
                $.each(countyInfo, function(index, item) {
                    if (item.attributes.ContentArea === 677 && item.attributes.Subgroup === "X" && item.attributes.TestLevel === "All Students") {
                        self.countyMATH.push(item.attributes);
                    }
                });
                // console.log(countyMATH);
                self.countyMATHpassing = countyMATH[0].PCT_Passing;

                // data for Student Breakdown Chart
                self.countyELAall = [];
                $.each(countyInfo, function(index, item) {
                    if (item.attributes.ContentArea === 675) {
                        self.countyELAall.push(item.attributes);
                    }
                });
                // console.log(self.countyELAall);

                self.countyMATHall = [];
                $.each(countyInfo, function(index, item) {
                    if (item.attributes.ContentArea === 677) {
                        self.countyMATHall.push(item.attributes);
                    }
                });
                // console.log(self.countyMATHall);

                self.countyName;
                switch (self.countyID) {
                    case 338:
                        self.countyName = "Apache";
                        break;
                    case 339:
                        self.countyName = "Cochise";
                        break;
                    case 340:
                        self.countyName = "Coconino";
                        break;
                    case 341:
                        self.countyName = "Gila";
                        break;
                    case 342:
                        self.countyName = "Graham";
                        break;
                    case 343:
                        self.countyName = "Greenlee";
                        break;
                    case 344:
                        self.countyName = "Maricopa";
                        break;
                    case 345:
                        self.countyName = "Mohave";
                        break;
                    case 346:
                        self.countyName = "Navajo";
                        break;
                    case 347:
                        self.countyName = "Pima";
                        break;
                    case 348:
                        self.countyName = "Pinal";
                        break;
                    case 349:
                        self.countyName = "Santa Cruz";
                        break;
                    case 350:
                        self.countyName = "Yavapai";
                        break;
                    case 351:
                        self.countyName = "Yuma";
                        break;
                    case 352:
                        self.countyName = "La Paz";
                        break;
                }

                createCountyStateChart()
            };

            function schoolsQueryFault(error) {
                console.log(error.messaege);
            };

            function schoolsQueryHandler(results) {
                var features2015 = results[0].features;
                var features2016 = results[1].features;
                // console.log(features2015);
                // console.log(features2016);

                self.schoolID = features2015[0].attributes.SchoolEntityID;
                self.countyID = features2015[0].attributes.CountyEntityID;
                self.districtID = features2015[0].attributes.DistrictEntityID;
                // console.log(self.countyID);

                var info2015ela = features2015[0].attributes;
                var info2015math = features2015[1].attributes;
                var info2016ela = features2016[0].attributes;
                var info2016math = features2016[1].attributes;
                // // console.log('ELA 2015 - ' + info2015ela.PCT_Passing);
                // // console.log('ELA 2016 - ' + info2016ela.PCT_Passing);

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
                    // console.log("ELA " + elaChange);
                    var mathChange = info2016math.PCT_Passing - info2015math.PCT_Passing;
                    // console.log("MATH " + mathChange);

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
                getCountyData();
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
             * [azMERITAllSchoolsChart] - Shows all schools and their AzMERIT score in scatter chart.
             * Data from [azMERITQueryHandler] via [getData();]
             * @return
             */
            function azMERITAllSchoolsChart() {

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
             * [schoolNames] - populates the dropdown menu for "Find a School"
             * Data from [azMERITQueryHandler] via [getData();]
             * @return
             */
            function schoolNames() {
                // console.log(self.azMERITschools);

                $("#schools").kendoDropDownList({
                    dataTextField: "sName",
                    dataValueField: "entityID",
                    dataSource: {
                        data: self.azMERITschools,
                        filter: {
                            field: "group",
                            operator: "isnotnull"
                        }
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

                if (dataItem.ELAP > 0) {
                    dom.byId("elaScore").innerHTML = dataItem.ELAP + "%";
                    createChartELA();
                } else {
                    dom.byId("elaScore").innerHTML = "N/A";
                }
                if (dataItem.MATHP > 0) {
                    dom.byId("mathScore").innerHTML = dataItem.MATHP + "%";
                    createChartMATH();
                } else {
                    dom.byId("elaScore").innerHTML = "N/A";
                }

                var dID = dataItem.dID;
                getData2();
                getDistrictData(dID);
                getDistrictBreakDown(dID);
                // console.log(self.dataItem);

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


                    if (dataItem.ELAP > 0) {
                        dom.byId("elaScore").innerHTML = dataItem.ELAP + "%";
                        createChartELA();
                    } else {
                        dom.byId("elaScore").innerHTML = "N/A";
                    }
                    if (dataItem.MATHP > 0) {
                        dom.byId("mathScore").innerHTML = dataItem.MATHP + "%";
                        createChartMATH();
                    } else {
                        dom.byId("elaScore").innerHTML = "N/A";
                    }

                    getData2();
                    getSchoolPoint();
                    getBreakDown();
                    getDistrictData(dID);
                    getDistrictBreakDown(dID);
                    getStateBreakDown();

                    // toggles the Assessment Type back to ELA from MATH
                    $("#option1").parents('.btn').button('toggle');

                    // console.log(self.dataItem);
                };
            };

            /**
             * [createChartELA - Pie Chart]
             * @return {[type]} [description]
             */
            function createChartELA() {

                if (dataItem.ELA1 === -1) {
                    dataItem.ELA1 = 0;
                }
                if (dataItem.ELA2 === -1) {
                    dataItem.ELA2 = 0;
                }
                if (dataItem.ELA3 === -1) {
                    dataItem.ELA3 = 0;
                }
                if (dataItem.ELA4 === -1) {
                    dataItem.ELA4 = 0;
                }

                function isBigEnough(element, index, array) {
                    return element == 0;
                }
                var ddCheck = [dataItem.ELA1, dataItem.ELA2, dataItem.ELA3, dataItem.ELA4].every(isBigEnough);
                //console.log(ddCheck);

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
                        value: dataItem.ELA1,
                    }, {
                        type: "Partially Proficient",
                        value: dataItem.ELA2,
                    }, {
                        type: "Proficient",
                        value: dataItem.ELA3,
                        explode: true
                    }, {
                        type: "Highly Proficient",
                        value: dataItem.ELA4,
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
                        seriesColors: ["#d62d20", "#ffa700", "#0057e7", "#028900"],
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
             * @return {[type]} [description]
             */
            function createChartMATH() {

                if (dataItem.MATH1 === -1) {
                    dataItem.MATH1 = 0;
                }
                if (dataItem.MATH2 === -1) {
                    dataItem.MATH2 = 0;
                }
                if (dataItem.MATH3 === -1) {
                    dataItem.MATH3 = 0;
                }
                if (dataItem.MATH4 === -1) {
                    dataItem.MATH4 = 0;
                }

                function isBigEnough(element, index, array) {
                    return element == 0;
                }
                var ddCheck = [dataItem.MATH1, dataItem.MATH2, dataItem.MATH3, dataItem.MATH4].every(isBigEnough);
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
                        value: dataItem.MATH1,
                    }, {
                        type: "Partially Proficient",
                        value: dataItem.MATH2,
                    }, {
                        type: "Proficient",
                        value: dataItem.MATH3,
                        explode: true
                    }, {
                        type: "Highly Proficient",
                        value: dataItem.MATH4,
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
                        seriesColors: ["#d62d20", "#ffa700", "#0057e7", "#028900"],
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
             * [createCountyStateChart description]
             * @return {[type]} [description]
             */
            function createCountyStateChart() {
                var seriesData;

                if (selectedYear === "2016") {
                    // stateData = [38, 38]
                    seriesData = [{
                        name: "ELA",
                        data: [self.countyELApassing, 38]
                    }, {
                        name: "MATH",
                        data: [self.countyMATHpassing, 38]
                    }];
                }
                if (selectedYear === "2015") {
                    // stateData = [34, 35]
                    seriesData = [{
                        name: "ELA",
                        data: [self.countyELApassing, 34]
                    }, {
                        name: "MATH",
                        data: [self.countyMATHpassing, 35]
                    }];
                }

                buildChart();

                function buildChart() {
                    $("#compChart").kendoChart({
                        legend: {
                            position: "bottom"
                        },
                        seriesDefaults: {
                            type: "column",
                            labels: {
                                visible: true,
                                background: "transparent",
                                format: "{0}%",
                                font: "bold italic 12px Open Sans Condensed,Verdana,sans-serif",
                            },
                            gap: 0.5,
                            spacing: 0.10
                        },
                        seriesColors: ["#007bc3", "#0019c3"],
                        series: seriesData,
                        valueAxis: {
                            visible: false,
                            labels: {
                                format: "{0}%"
                            },
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            },
                            axisCrossingValue: 0,
                            max: 50,
                            min: 0
                        },
                        categoryAxis: {
                            categories: [self.countyName, "Arizona"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true,
                            template: "${ series.name } - ${ value }%"
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
                            if (item.ELA1 === -1 || item.ELA1 === -2) {
                                item.ELA1 = 0;
                            }
                            if (item.ELA2 === -1 || item.ELA2 === -2) {
                                item.ELA2 = 0;
                            }
                            if (item.ELA3 === -1 || item.ELA3 === -2) {
                                item.ELA3 = 0;
                            }
                            if (item.ELA4 === -1 || item.ELA4 === -2) {
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
                            if (item.ELA1 === -1 || item.ELA1 === -2) {
                                item.ELA1 = 0;
                            }
                            if (item.ELA2 === -1 || item.ELA2 === -2) {
                                item.ELA2 = 0;
                            }
                            if (item.ELA3 === -1 || item.ELA3 === -2) {
                                item.ELA3 = 0;
                            }
                            if (item.ELA4 === -1 || item.ELA4 === -2) {
                                item.ELA4 = 0;
                            }
                            self.dbd.push(item);
                        }
                    });
                    // console.log(self.dbd);
                    self.sbd = [];
                    $.each(self.stateELA, function(index, item) {
                        if (item.level === self.tLevel) {
                            if (item.ELA1 === -1 || item.ELA1 === -2) {
                                item.ELA1 = 0;
                            }
                            if (item.ELA2 === -1 || item.ELA2 === -2) {
                                item.ELA2 = 0;
                            }
                            if (item.ELA3 === -1 || item.ELA3 === -2) {
                                item.ELA3 = 0;
                            }
                            if (item.ELA4 === -1 || item.ELA4 === -2) {
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
                            if (item.MATH1 === -1 || item.MATH1 === -2) {
                                item.MATH1 = 0;
                            }
                            if (item.MATH2 === -1 || item.MATH2 === -2) {
                                item.MATH2 = 0;
                            }
                            if (item.MATH3 === -1 || item.MATH3 === -2) {
                                item.MATH3 = 0;
                            }
                            if (item.MATH4 === -1 || item.MATH4 === -2) {
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
                            if (item.MATH1 === -1 || item.MATH1 === -2) {
                                item.MATH1 = 0;
                            }
                            if (item.MATH2 === -1 || item.MATH2 === -2) {
                                item.MATH2 = 0;
                            }
                            if (item.MATH3 === -1 || item.MATH3 === -2) {
                                item.MATH3 = 0;
                            }
                            if (item.MATH4 === -1 || item.MATH4 === -2) {
                                item.MATH4 = 0;
                            }
                            self.dbd.push(item);
                        }
                    });
                    // console.log(self.dbd);
                    self.sbd = [];
                    $.each(self.stateMATH, function(index, item) {
                        if (item.level === self.tLevel) {
                            if (item.MATH1 === -1 || item.MATH1 === -2) {
                                item.MATH1 = 0;
                            }
                            if (item.MATH2 === -1 || item.MATH2 === -2) {
                                item.MATH2 = 0;
                            }
                            if (item.MATH3 === -1 || item.MATH3 === -2) {
                                item.MATH3 = 0;
                            }
                            if (item.MATH4 === -1 || item.MATH4 === -2) {
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
                console.log(TotalArray);

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
                            visible: true,
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
                                        return "#50be09";
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
                                        return "#50be09";
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