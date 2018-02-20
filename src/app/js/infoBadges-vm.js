/**
 * Provides view-model implementation of the school info badges.
 */
(function() {

    "use strict";
    define([
            "dojo/dom-construct"
        ],
        function(dc) {

            var infoBadgesVM = new function() {

                var self = this;

                /**
                 * Places grade badge showing the ADE Letter Grade
                 * @return {[type]} [description]
                 */
                self.adeGradeBadge = function(e) {
                    var dataItem = e;

                    var emptyTEST = $("#infoBadge").is(":empty");
                    if (emptyTEST === false) {
                        dc.destroy("gradeBadge");
                    }

                    var year = dataItem.FY;
                    var schoolGrade = dataItem.grade;
                    var gradeClass;
                    var grade;
                    var gradeInfo;

                    if (schoolGrade === "A") {
                        gradeClass = "badges gradeA";
                        grade = "class='grade'";
                    }
                    if (schoolGrade === "B") {
                        gradeClass = "badges gradeB";
                        grade = "class='grade'";
                    }
                    if (schoolGrade === "C") {
                        gradeClass = "badges gradeC";
                        grade = "class='grade2'";
                    }
                    if (schoolGrade === "D") {
                        gradeClass = "badges gradeD";
                        grade = "class='grade'";
                    }
                    if (schoolGrade === "F") {
                        gradeClass = "badges gradeF";
                        grade = "class='grade'";
                    }
                    if (schoolGrade === "N/A") {
                        gradeClass = "badges gradeNA";
                        grade = "class='grade'";
                    }
                    if (schoolGrade === "UR") {
                        gradeClass = "badges gradeNA";
                        grade = "class='grade'";
                    }
                    if (schoolGrade === "NR") {
                        gradeClass = "badges gradeNA";
                        grade = "class='grade'";
                    }

                    gradeInfo = year + "</br>GRADE" + "<p " + grade + ">" + schoolGrade + "</p>";

                    dc.create("span", {
                        id: "gradeBadge",
                        className: gradeClass,
                        innerHTML: gradeInfo
                    }, "infoBadge", 0);
                };

                /**
                 * Places score badge showing the AzMERIT combined score
                 * @return {[type]} [description]
                 */
                self.scoreBadge = function(e) {
                    var dataItem = e;

                    var emptyTEST = $("#infoBadge").is(":empty");
                    if (emptyTEST === false) {
                        dc.destroy("scoreBadge");
                    }

                    var year = dataItem.FY;
                    var schoolScore = dataItem.score;
                    var scoreClass;
                    var score;
                    var scoreInfo;

                    if (schoolScore >= 80) {
                        scoreClass = "badges gradeA";
                        score = "class='score'";
                    }
                    if (schoolScore >= 60 && schoolScore < 80) {
                        scoreClass = "badges gradeB";
                        score = "class='score'";
                    }
                    if (schoolScore >= 40 && schoolScore < 60) {
                        scoreClass = "badges gradeC";
                        score = "class='score2'";
                    }
                    if (schoolScore >= 20 && schoolScore < 40) {
                        scoreClass = "badges gradeD";
                        score = "class='score'";
                    }
                    if (schoolScore >= 0 && schoolScore < 20) {
                        scoreClass = "badges gradeF";
                        score = "class='score'";
                    }
                    scoreInfo = year + "</br>SCORE" + "<p " + score + ">" + schoolScore + "%</p>";

                    if (schoolScore < 0) {
                        scoreClass = "badges gradeNA";
                        schoolScore = "N/A";
                        score = "class='score'";
                        scoreInfo = year + "</br>SCORE" + "<p " + score + ">" + schoolScore + "</p>";
                    }

                    dc.create("span", {
                        id: "scoreBadge",
                        className: scoreClass,
                        innerHTML: scoreInfo
                    }, "infoBadge", 1);

                };

                /**
                 * Places title I badge if school is title I
                 * @return {[type]} [description]
                 */
                self.titleIBadge = function(e) {
                    var dataItem = e;

                    var emptyTEST = $("#infoBadge").is(":empty");
                    if (emptyTEST === false) {
                        dc.destroy("titleIBadge");
                    }

                    var year = dataItem.FY;

                    if (dataItem.titleI === "Y") {
                        dc.create("span", {
                            id: "titleIBadge",
                            className: "badges titleI",
                            innerHTML: year + "<p class='t1'>Title I</br>School</p>"
                        }, "infoBadge", 2);
                    } else {
                        dc.destroy("titleIBadge");
                    }
                };

                /**
                 * Places Free and Reduced badge for school info
                 * @return {[type]} [description]
                 */
                self.freeReducedBadge = function(e) {
                    var dataItem = e;

                    var emptyTEST = $("#infoBadge").is(":empty");
                    if (emptyTEST === false) {
                        dc.destroy("freeBadge");
                    }

                    var year = dataItem.FY;
                    var FRL = dataItem.frl;

                    if (FRL !== "-9") {
                        dc.create("span", {
                            id: "freeBadge",
                            className: "badges freeRed",
                            innerHTML: year + "<p class='r1'>Free & Reduced Lunch</p>" + "<p class='r2'>" + FRL + "</p>"
                        }, "infoBadge", 3);
                    } else if (FRL === "-9") {
                        dc.create("span", {
                            id: "freeBadge",
                            className: "badges freeRed",
                            innerHTML: year + "<p class='r1'>Free & Reduced Lunch</p>" + "<p class='r2'>N/A</p>"
                        }, "infoBadge", 3);
                    } else {
                        dc.destroy("freeBadge");
                    }
                };

                /**
                 * Places Chronic Absence badge for school info
                 * @return {[type]} [description]
                 */
                self.chronicBadge = function(e) {
                    var dataItem = e;

                    var emptyTEST = $("#infoBadge").is(":empty");
                    if (emptyTEST === false) {
                        dc.destroy("chronicBadge");
                    }
                    var year = dataItem.FY;
                    var Chronic = dataItem.chronic;

                    dc.create("span", {
                        id: "chronicBadge",
                        className: "badges chronic",
                        innerHTML: year + "<p class='c1'>Chronic Absence Rate</p>" + "<p class='c2'>" + Chronic + "</p>"
                    }, "infoBadge", 4);
                };

                /**
                 * Places Attendance Rate badge for school info
                 * @return {[type]} [description]
                 */
                self.attendanceBadge = function(e) {
                    var dataItem = e;

                    var emptyTEST = $("#attendBadge").is(":empty");
                    if (emptyTEST === false) {
                        dc.destroy("attendBadge");
                    }
                    var year = dataItem.FY;
                    var attendRate = dataItem.attend;

                    dc.create("span", {
                        id: "attendBadge",
                        className: "badges attend",
                        innerHTML: year + "<p class='c1'>Attendance Rate</p>" + "<p class='c2'>" + attendRate + "</p>"
                    }, "infoBadge", 5);
                };

            }; // end infoBadgesVM

            return infoBadgesVM;
        } // end function
    );
}());
