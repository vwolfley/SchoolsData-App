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
    var selectedSchool;
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
            "esri/dijit/HomeButton",

            "appPackages/config",
            "appPackages/scatterChart-vm",
            "appPackages/azBreakdown-vm",
            "appPackages/infoBadges-vm",
            "appPackages/passingCharts-vm",
            "appPackages/chronicCharts-vm",
            "appPackages/enrollmentCharts-vm",
            "appPackages/enrollmentTables-vm",
            "appPackages/frlScatterChart-vm",
            "appPackages/demographicsChart-vm",
            "appPackages/azMeritTrends-vm",
            "appPackages/districtTable-vm",
            "appPackages/enrollmentSubgroups-vm",

            "dojo/domReady!"
        ],
        function(parser, all, dom, on, dc, domClass, arrayUtils, Query, QueryTask, StatisticDefinition, Map, BasemapToggle, FeatureLayer, InfoTemplate, Point, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, PictureMarkerSymbol, Graphic, Color, Extent, HomeButton, appConfig, scatterChartVM, azBreakdownVM, infoBadgesVM, passingChartsVM, chronicChartsVM, enrollmentChartsVM, enrollmentTablessVM, frlScatterChartVM, demographicsChartVM, azMeritTrendsVM, districtTableVM, enrollmentSubgroups) {
            parser.parse();

            $("#year-filtering-tabs").kendoTabStrip({
                dataSource: ["2015", "2016", "2017"],
                change: function(e) {
                    selectedYear = this.value();

                    $(".selected-year").text(selectedYear);

                    getSchoolsList();

                    passingChartsVM.sYear(selectedYear);
                    azBreakdownVM.sYear(selectedYear);
                }
            }).data("kendoTabStrip").select(2);
            // console.log(selectedYear);
            //=================================================================================>

            // add version and date to about.html, changed in config.js
            $(".version").text(appConfig.version);
            $(".copyright").text(appConfig.copyright);

            var map = new Map("mapDiv", {
                center: [-111.681, 34.256],
                minZoom: 6,
                maxZoom: 19,
                basemap: "streets",
                // basemap: "gray",
                showAttribution: false,
                logo: false
            });

            var toggle = new BasemapToggle({
                map: map,
                basemap: "satellite"
            }, "BasemapToggle");
            toggle.startup();

            var home = new HomeButton({
                map: map,
                visible: true
            }, "HomeButton");
            home.startup();

            /**
             * [getSchoolsList - gets the list of schools for the drop-down menu]
             * @return {[type]} [description]
             */
            function getSchoolsList() {
                var queryTask;
                var query;

                queryTask = new QueryTask(appConfig.mainURL + "/10");
                query = new Query();
                query.where = "EntityID > 0";
                query.returnGeometry = false;
                query.outFields = ["*"];
                queryTask.execute(query, azSchoolsListQueryHandler, azSchoolsListQueryFault);
            }

            /**
             * [Queries AzSchools_InfoData for yearly stats ]
             * @param  {schoolSelected} e [SchoolEntityID, FY]
             * @return {azSchoolsQueryHandler}
             * @return {azSchoolsQueryFault} [error]
             */
            function getSchoolsData() {
                var queryTask;
                var query;
                var year = selectedYear;

                queryTask = new QueryTask(appConfig.mainURL + "/0");
                query = new Query();
                query.where = "FY = '" + year + "' AND SchoolEntityID > 0";
                query.returnGeometry = false;
                query.outFields = ["*"];
                // console.log(query.where);
                queryTask.execute(query, azSchoolsQueryHandler, azSchoolsQueryFault);
            }

            /**
             * [getSchoolLocation]
             * @param  {schoolSelected} e [EntityID, FY]
             * @return {schoolPointQueryHandler}
             * @return {schoolPointQueryFault} [error]
             */
            function getSchoolLocation(e) {
                var dataItem = e;
                var queryTask;
                var query;

                queryTask = new QueryTask(appConfig.mainURL + "/0");
                query = new Query();
                query.where = "EntityID = " + dataItem.entityID + " AND FY = '" + dataItem.FY + "'";
                query.returnGeometry = true;
                query.outFields = ["*"];

                queryTask.execute(query, schoolPointQueryHandler, schoolPointQueryFault);
            }

            /**
             * [getSchoolScores]
             * @param  {schoolSelected} e [EntityID, Subgroup, TestLevel]
             * @return {schoolScoresQueryHandler}
             * @return {schoolScoresQueryFault} [error]
             */
            function getSchoolScores(e) {
                var dataItem = e;
                var queryTask;
                var query;
                queryTask = new QueryTask(appConfig.mainURL + "/1");
                query = new Query();
                query.where = "EntityID = " + dataItem.entityID + " AND Subgroup = 0 AND TestLevel = 0";
                query.returnGeometry = false;
                query.outFields = ["*"];
                // console.log(query.where);
                queryTask.execute(query, schoolScoresQueryHandler, schoolScoresQueryFault);
            }

            /**
             * [getDistrictData]
             * @param  {schoolSelected} e [DistrictEntityID, FY]
             * @return {districtDataQueryHandler}
             * @return {districtDataQueryFault} [error]
             */
            function getDistrictData(e) {
                var dataItem = e;
                var queryTask;
                var query;

                queryTask = new QueryTask(appConfig.mainURL + "/0");
                query = new Query();
                query.where = "DistrictEntityID = " + dataItem.dID + " AND FY = '" + dataItem.FY + "'";
                query.returnGeometry = false;
                query.outFields = ["*"];
                queryTask.execute(query, districtDataQueryHandler, districtDataQueryFault);
            }

            /**
             * [getDistrictScores]
             * @param  {schoolSelected} e [DistrictEntityID]
             * @return {districtScoresQueryHandler}   [description]
             * @return {districtScoresQueryFault} [error]
             */
            function getDistrictScores(e) {
                var dataItem = e;
                var queryTask;
                var query;

                queryTask = new QueryTask(appConfig.mainURL + "/1");
                query = new Query();
                query.where = "EntityID = " + dataItem.dID + " AND FY = " + dataItem.FY + " AND Subgroup = 0 AND TestLevel = 0";
                // console.log(query.where);
                query.returnGeometry = false;
                query.outFields = ["*"];
                queryTask.execute(query, districtScoresQueryHandler, districtScoresQueryFault);
            }

            /**
             * [getSchoolBreakDown]
             * @param  {schoolSelected} e [EntityID & selectedYear]
             * @return {schoolBreakdownQueryHandler}
             * @return {schoolBreakdownQueryFault} [error]
             */
            function getSchoolBreakDown(e) {
                var dataItem = e;
                var queryTask;
                var query;
                var year;

                if (selectedYear === "2015") {
                    year = 2015;
                    qtask();
                }
                if (selectedYear === "2016") {
                    year = 2016;
                    qtask();
                }
                if (selectedYear === "2017") {
                    year = 2017;
                    qtask();
                }

                function qtask() {
                    queryTask = new QueryTask(appConfig.mainURL + "/1");
                    query = new Query();
                    query.where = "EntityID = " + dataItem.entityID + "AND FY = " + year;
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                    queryTask.execute(query, azBreakdownVM.schoolBreakdownQueryHandler, azBreakdownVM.schoolBreakdownQueryFault);
                }
            }

            /**
             * [getgetTestTrends]
             * @param  {schoolSelected} e [EntityID & TestLevel]
             * @return {azMeritTrendsQueryHandler}
             * @return {azMeritTrendsQueryFault} [error]
             */
            function getTestTrends(e) {
                var dataItem = e;
                var queryTask;
                var query;

                queryTask = new QueryTask(appConfig.mainURL + "/1");
                query = new Query();
                query.where = "EntityID = " + dataItem.entityID + " AND TestLevel = 0";
                // console.log(query.where);
                query.returnGeometry = false;
                query.outFields = ["*"];
                queryTask.execute(query, azMeritTrendsVM.azMeritTrendsQueryHandler, azMeritTrendsVM.azMeritTrendsQueryFault);
            }

            /**
             * [getDistrictBreakDown]
             * @param  {schoolSelected} e [EntityID & selectedYear]
             * @return {districtBreakdownQueryHandler}
             * @return {districtBreakdownQueryFault} [error]
             */
            function getDistrictBreakDown(e) {
                var dataItem = e;
                var queryTask;
                var query;
                if (selectedYear === "2015") {
                    year = 2015;
                    qtask();
                }
                if (selectedYear === "2016") {
                    year = 2016;
                    qtask();
                }
                if (selectedYear === "2017") {
                    year = 2017;
                    qtask();
                }

                function qtask() {
                    queryTask = new QueryTask(appConfig.mainURL + "/1");
                    query = new Query();
                    query.where = "EntityID = " + dataItem.dID + "AND FY = " + year;
                    // query.where = "EntityID = " + dataItem.dID + "AND FY = " + year + " AND Subgroup = 0";
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                    queryTask.execute(query, azBreakdownVM.districtBreakdownQueryHandler, azBreakdownVM.districtBreakdownQueryFault);
                }
            }

            /**
             * [getStateBreakDown]
             * @param  {state data} [EntityID & selectedYear]
             * @return {stateBreakdownQueryHandler}
             * @return {stateBreakdownQueryFault} [error]
             */
            function getStateBreakDown() {
                var queryTask;
                var query;

                if (selectedYear === "2015") {
                    year = 2015;
                    qtask();
                }
                if (selectedYear === "2016") {
                    year = 2016;
                    qtask();
                }
                if (selectedYear === "2017") {
                    year = 2017;
                    qtask();
                }

                function qtask() {
                    queryTask = new QueryTask(appConfig.mainURL + "/1");
                    query = new Query();
                    query.where = "EntityID = -1" + " AND FY = " + year;
                    // query.where = "EntityID = -1" + " AND FY = " + year + " AND Subgroup = 0";
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                    queryTask.execute(query, azBreakdownVM.stateBreakdownQueryHandler, azBreakdownVM.stateBreakdownQueryFault);
                }
            }


            /**
             * [getChronicData]
             * @param  {schoolSelected}  e [EntityID & selectedYear]
             * @return {chronicDataQueryHandler}
             * @return {chronicDataQueryFault} [error]
             */
            function getChronicData(e) {
                var dataItem = e;
                var queryTask;
                var query;

                queryTask = new QueryTask(appConfig.mainURL + "/9");
                query = new Query();
                query.where = "EntityID = " + dataItem.entityID + " AND FY = " + selectedYear;
                query.returnGeometry = false;
                query.outFields = ["*"];
                // console.log(query.where);

                queryTask.execute(query, chronicDataQueryHandler, chronicDataQueryFault);
            }

            /**
             * [getEnrollmentData]
             * @param  {schoolSelected} e [EntityID]
             * @return {enrollmentGradeQueryHandler}   [description]
             * @return {enrollmentDataQueryFault} [error]
             */
            function getEnrollmentData(e) {
                var dataItem = e;
                // console.log(dataItem);
                var queryTask;
                var query;
                gradeEnroll();
                raceEnroll();
                raceEnrollDistrict();

                function gradeEnroll() {
                    queryTask = new QueryTask(appConfig.mainURL + "/3");
                    query = new Query();
                    query.where = "EntityID = " + dataItem.entityID;
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                    // console.log(query.where);

                    queryTask.execute(query, enrollmentGradeQueryHandler, enrollmentDataQueryFault);
                }

                function raceEnroll() {
                    queryTask = new QueryTask(appConfig.mainURL + "/4");
                    query = new Query();
                    query.where = "EntityID = " + dataItem.entityID + " AND FY = " + selectedYear;
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                    // console.log(query.where);

                    queryTask.execute(query, enrollmentRaceQueryHandler, enrollmentDataQueryFault);
                }

                function raceEnrollDistrict() {
                    queryTask = new QueryTask(appConfig.mainURL + "/4");
                    query = new Query();
                    query.where = "EntityID = " + dataItem.dID + " AND FY = " + selectedYear;
                    query.returnGeometry = false;
                    query.outFields = ["*"];
                    // console.log(query.where);

                    queryTask.execute(query, enrollmentRaceDistrictQueryHandler, enrollmentDataQueryFault);
                }
            }


            //================================================================================================>

            /**
             * [azSchoolsListQueryFault]
             * @param  {getSchoolsList()}
             * @return {error}
             */
            function azSchoolsListQueryFault(error) {
                console.log(error.messaege);
            }

            /**
             * [azSchoolsListQueryHandler]
             * @param  {getSchoolsList()}
             * @return {error}
             */
            function azSchoolsListQueryHandler(results) {
                var features = results.features;
                // console.log(features);

                var sList = [];
                $.each(features, function(index, item) {
                    var i = item.attributes;
                    sList.push({
                        schoolName: i.SchoolName,
                        districtName: i.DistrictName,
                        districtID: i.DistrictEntityID,
                        entityID: i.EntityID,
                        city: i.PCity,
                    });
                });
                // console.log(sList);
                schoolsList(sList);
            }

            /**
             * [schoolPointQueryFault]
             * @param  {getSchoolPoint()}
             * @return {error}
             */
            function schoolPointQueryFault(error) {
                console.log(error.messaege);
            }

            /**
             * [schoolPointQueryHandler]
             * @param  {getSchoolPoint()}
             * @return {[map]}
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
            }

            /**
             * [azSchoolsQueryFault]
             * @param  {getSchoolsData()}
             * @return {error}
             */
            function azSchoolsQueryFault(error) {
                console.log(error.messaege);
            }

            /**
             * [azSchoolsQueryHandler]
             * @param  {getSchoolsData()}
             * @return {[scatterChartVM, frlScatterChartVM]}
             */
            function azSchoolsQueryHandler(results) {
                var features = results.features;
                // console.log(features);

                var azSchoolInfo = [];
                var azSchoolsScatter = [];
                var azSchoolsFRL = [];
                $.each(features, function(index, item) {

                    if (selectedSchool === item.attributes.EntityID) {
                        azSchoolInfo.push({
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
                            frlp: item.attributes.FRL_CALC,
                            score: item.attributes.Score,
                            grade: item.attributes.ADE_Grade,
                            chronic: item.attributes.ChronicAbsence,
                            attend: item.attributes.AttendanceRate,
                            ELAp: item.attributes.ELA_Passing,
                            MATHp: item.attributes.MATH_Passing
                        });
                    }

                    azSchoolsScatter.push({
                        sName: item.attributes.SchoolName,
                        entityID: item.attributes.EntityID,
                        FY: item.attributes.FY,
                        ELAp: item.attributes.ELA_Passing,
                        MATHp: item.attributes.MATH_Passing,
                        rank: item.attributes.Rank,
                        rankSort: item.attributes.RankNum
                    });

                    azSchoolsFRL.push({
                        sName: item.attributes.SchoolName,
                        entityID: item.attributes.EntityID,
                        FY: item.attributes.FY,
                        frl: item.attributes.FRL_CALC,
                        score: item.attributes.Score
                    });

                });
                // console.log(azSchoolInfo);
                // console.log(azSchoolsScatter);

                schoolInfo(azSchoolInfo);
                scatterChartVM.azMERITscatterChart(azSchoolsScatter, selectedYear);
                frlScatterChartVM.frlScatterChart(azSchoolsFRL, selectedYear);
            }

            /**
             * [districtDataQueryFault]
             * @param  {getDistrictData()}
             * @return {error}
             */
            function districtDataQueryFault(error) {
                console.log(error.messaege);
            }

            /**
             * [districtDataQueryHandler]
             * @param  {getDistrictData()}
             * @return {[districtTableVM]}
             * @return {districtDataQueryFault} [error]
             */
            function districtDataQueryHandler(results) {
                var features = results.features;
                // console.log(features);

                var distInfo = [];
                $.each(features, function(index, item) {
                    var x = item.attributes;
                    distInfo.push(x);
                });
                // console.log(distInfo);

                districtTableVM.districtTable(distInfo);
            }

            /**
             * [districtDataQueryFault]
             * @param  {getDistrictScores()}
             * @return {error}
             */
            function districtScoresQueryFault(error) {
                console.log(error.messaege);
            }

            /**
             * [districtScoresQueryHandler]
             * @param  {getDistrictScores()}
             * @return {[passingChartsVM]}
             */
            function districtScoresQueryHandler(results) {
                var features = results.features;
                // console.log(features);

                var distScores = [];
                $.each(features, function(index, item) {
                    var x = item.attributes;
                    distScores.push(x);
                });
                // console.log(distScores);
                // passingChartsVM.createComparisonChart(distScores);
                passingChartsVM.createComparBarChart(distScores);
            }

            /**
             * [schoolScoresQueryFault]
             * @param  {getSchoolScores()}
             * @return {error}
             */
            function schoolScoresQueryFault(error) {
                console.log(error.messaege);
            }

            /**
             * [schoolScoresQueryHandler] - AzMERIT Schools Scores
             * @param  {getSchoolScores()}
             * @return {[passingChartsVM]}
             */
            function schoolScoresQueryHandler(results) {
                var features = results.features;
                // console.log(features);

                var f2015 = [];
                var f2016 = [];
                var f2017 = [];
                $.each(features, function(index, item) {
                    var x = item.attributes;
                    if (x.FY === 2015) {
                        f2015.push(x);
                    }
                    if (x.FY === 2016) {
                        f2016.push(x);
                    }
                    if (x.FY === 2017) {
                        f2017.push(x);
                    }
                });
                // console.log(f2015);
                // console.log(f2016);
                // console.log(f2017);

                var info2015ela;
                var info2015math;
                if (f2015.length > 0) {
                    $.each(f2015, function(index, item) {
                        if (item.ContentArea === 675) {
                            info2015ela = item;
                        }
                        if (item.ContentArea === 677) {
                            info2015math = item;
                        }
                    });
                } else {
                    info2015ela = 0;
                    info2015math = 0;
                }
                // console.log(info2015ela);
                // console.log(info2015math);

                var info2016ela;
                var info2016math;
                if (f2016.length > 0) {
                    $.each(f2016, function(index, item) {
                        if (item.ContentArea === 675) {
                            info2016ela = item;
                        }
                        if (item.ContentArea === 677) {
                            info2016math = item;
                        }
                    });
                } else {
                    info2016ela = 0;
                    info2016math = 0;
                }
                // console.log(info2016ela);
                // console.log(info2016math);

                var info2017ela;
                var info2017math;
                if (f2017.length > 0) {
                    $.each(f2017, function(index, item) {
                        if (item.ContentArea === 675) {
                            info2017ela = item;
                        }
                        if (item.ContentArea === 677) {
                            info2017math = item;
                        }
                    });
                } else {
                    info2017ela = 0;
                    info2017math = 0;
                }
                // console.log(info2017ela);
                // console.log(info2017math);

                var e1, e2;
                if (selectedYear === "2015") {
                    e1 = info2015ela;
                    e2 = info2015math;
                    passingChartsVM.score(e1, e2);
                }
                if (selectedYear === "2016") {
                    e1 = info2016ela;
                    e2 = info2016math;
                    passingChartsVM.score(e1, e2);
                }
                if (selectedYear === "2017") {
                    e1 = info2017ela;
                    e2 = info2017math;
                    passingChartsVM.score(e1, e2);
                }

                var v2015 = [info2015ela, info2015math];
                var v2016 = [info2016ela, info2016math];
                var v2017 = [info2017ela, info2017math];
                passingChartsVM.diffScore(v2015, v2016, v2017);
            }

            /**
             * [chronicDataQueryFault]
             * @param  {getChronicData2()}
             * @return {error}
             */
            function chronicDataQueryFault(error) {
                console.log(error.messaege);
            }

            /**
             * [chronicDataQueryHandler]
             * @param  {getChronicData()}
             * @return {[chronicChartsVM]}
             */
            function chronicDataQueryHandler(results) {
                var features = results.features;
                // console.log(features);

                var chronicInfo = [];
                if (features.length > 0) {
                    $.each(features, function(index, item) {
                        chronicInfo.push({
                            fy: item.attributes.FY,
                            entityID: item.attributes.EntityID,
                            gradeLevel: item.attributes.GradeLevel,
                            gradeLevelDef: item.attributes.GradeLevelDef,
                            subGroup: item.attributes.Subgroup,
                            subGroupDef: item.attributes.SubgroupDef,
                            PCT_Absences: item.attributes.PCT_18plus_Absences_num,
                            PCT_AbsencesText: item.attributes.PCT_18plus_Absences_text
                        });
                    });
                } else {
                    chronicInfo;
                }
                // console.log(chronicInfo);
                chronicChartsVM.chronicAbsenceChart(chronicInfo, selectedYear);
            }


            /**
             * [enrollmentDataQueryFault]
             * @param  {getEnrollmentData()}
             * @return {error}
             */
            function enrollmentDataQueryFault(error) {
                console.log(error.messaege);
            }

            /**
             * [enrollmentGradeQueryHandler]
             * @param  {getEnrollmentData()}
             * @return {}
             */
            function enrollmentGradeQueryHandler(results) {
                var features = results.features;
                // console.log(features);

                var enrollmentData = [];
                var enrollmentInfo = [];
                $.each(features, function(index, item) {
                    enrollmentData.push({
                        fy: item.attributes.FY,
                        entityID: item.attributes.EntityID,
                        ps: item.attributes.PS,
                        kg: item.attributes.KG,
                        g1: item.attributes.G1,
                        g2: item.attributes.G2,
                        g3: item.attributes.G3,
                        total: item.attributes.Total,
                    });
                    enrollmentInfo.push(item.attributes);
                });
                // console.log(enrollmentData);
                // console.log(enrollmentInfo);
                enrollmentChartsVM.enrollmentChart(enrollmentData);
                enrollmentChartsVM.enrollmentCohorts(enrollmentInfo);
                enrollmentTablessVM.enrollmentTableGrade(enrollmentInfo);
            }

            /**
             * [enrollmentRaceQueryHandler]
             * @param  {getEnrollmentData()}
             * @return {[enrollmentTablessVM, demographicsChartVM]}
             */
            function enrollmentRaceQueryHandler(results) {
                var features = results.features;
                // console.log(features);

                var raceEnrollment = [];
                var subgroupEnroll = [];
                $.each(features, function(index, item) {
                    raceEnrollment.push(item.attributes);
                    subgroupEnroll.push({
                        subgroup: item.attributes.SubgroupDef,
                        total: item.attributes.Total
                    });
                });
                // console.log(raceEnrollment);
                // console.log(subgroupEnroll);

                enrollmentTablessVM.enrollmentTableRace(raceEnrollment);
                demographicsChartVM.studentDemoChart(raceEnrollment);
                enrollmentSubgroups.enrollmentSubgroupChart(subgroupEnroll);
            }

            /**
             * [enrollmentRaceDistrictQueryHandler]
             * @param  {getEnrollmentData()}
             * @return {[demographicsChartVM]}
             */
            function enrollmentRaceDistrictQueryHandler(results) {
                var features = results.features;
                // console.log(features);

                var raceEnrollment = [];
                $.each(features, function(index, item) {
                    if (item.attributes.Subgroup === 0) {
                        raceEnrollment.push(item.attributes);
                    }
                });
                demographicsChartVM.districtDemoChart(raceEnrollment);
            }

            //============================================================================================================>

            /**
             * [populates the drop-down menu for "Find a School"]
             * @param  {[type]} e [description]
             * @return {[type]}   [description]
             */
            function schoolsList(results) {
                var schools = results;
                // console.log(schools);

                $("#schools").kendoComboBox({
                    dataTextField: "schoolName",
                    dataValueField: "entityID",
                    template: "${data.schoolName}" + " - <span style='font-size: 12px;'>${data.city}" + " (${data.entityID})</span>",
                    dataSource: {
                        data: schools,
                        sort: {
                            field: "schoolName",
                            dir: "asc"
                        }
                    },
                    index: 1,
                    change: onChange
                });
                var schoolData = $("#schools").data("kendoComboBox");
                var dataItem = schoolData.dataItem();
                selectedSchool = dataItem.entityID;
                // console.log(dataItem);

                getSchoolsData();

                function onChange() {
                    var value = $("#schools").val();
                    var schoolData = $("#schools").data("kendoComboBox");
                    var dataItem = schoolData.dataItem();
                    selectedSchool = dataItem.entityID;

                    getSchoolsData();

                    // toggles the Assessment Type back to ELA from MATH
                    $("#option1").parents(".btn").button("toggle");
                }
            }

            /**
             * [schoolInfo]
             * Data from [azSchoolsQueryHandler] via [getSchoolsData();]
             * @return
             */
            function schoolInfo(results) {
                var features = results;
                // console.log(features);

                var dataItem = {};
                $.each(features, function(index, item) {
                    dataItem = item;
                });
                // console.log(dataItem);

                // school name & district name
                $(".schoolName").text(dataItem.sName);
                $(".schoolID").text("  (" + dataItem.entityID + ")");
                $(".districtName").text(dataItem.dName);
                $(".districtID").text("  (" + dataItem.dID + ")");

                dom.byId("info1").innerHTML = dataItem.sClass + " School&nbsp;&nbsp;|&nbsp;&nbsp;" + dataItem.sType + "&nbsp;&nbsp;|&nbsp;&nbsp;" + dataItem.grades;
                dom.byId("info2").innerHTML = dataItem.address + " " + dataItem.city + ", AZ " + dataItem.zip;

                scatterChartVM.schoolSelected(dataItem);
                frlScatterChartVM.schoolSelected(dataItem);

                getSchoolLocation(dataItem);
                getSchoolScores(dataItem);
                getSchoolBreakDown(dataItem);
                getDistrictBreakDown(dataItem);
                getStateBreakDown();
                getChronicData(dataItem);
                getEnrollmentData(dataItem);
                getTestTrends(dataItem);
                getDistrictData(dataItem);
                getDistrictScores(dataItem);

                infoBadgesVM.adeGradeBadge(dataItem);
                infoBadgesVM.scoreBadge(dataItem);
                infoBadgesVM.titleIBadge(dataItem);
                infoBadgesVM.freeReducedBadge(dataItem);
                infoBadgesVM.chronicBadge(dataItem);
                infoBadgesVM.attendanceBadge(dataItem);
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
}
