/* ========================================================================
 * Maricopa Association of Governments
 * JS document
 * @project     MAG Schools Data Visualization Project
 * @summary     config file for project
 * @file        config.js
 * ======================================================================== */

define([], function() {
      return {

            version: "0.0.4 | 2017-10-05",
            copyright: "2017",

            emailLink: "https://www.azmag.gov/EmailPages/JasonHoward.asp",

            // mainURL: "http://geo.azmag.gov/gismag/rest/services/maps/ReadOn_test/MapServer/0",
            // mainURL: "http://geo.azmag.gov/gismag/rest/services/Test/SchoolsTestData/MapServer",
            mainURL: "http://geo.azmag.gov/gismag/rest/services/Test/SchoolsData_2017/MapServer",

            _subGroups: ["State Average", "District Average", "School Average", "Male", "Female", "White", "Black", "Asian", "Hispanic", "Native American", "Pacific Islander", "Two or More Races", "SPED", "ELL", "FRL", "Migrant", "Homeless"],

            subGroupsAll: ["State Average", "District Average", "School Average", "Male", "Female", "White", "Black", "Asian", "Hispanic", "Native American", "Pacific Islander", "Two or More Races", "SPED", "ELL", "FRL", "Migrant", "Homeless"],

            subGroups: ["All Students", "Male", "Female", "White", "Black", "Asian", "Hispanic", "Native American", "Pacific Islander", "Two or More Races", "SPED", "ELL", "FRL", "Migrant", "Homeless"],

            stateAzMERIT2017ela: [0,41,20,29,10],
            stateAzMERIT2017math: [0,36,24,26,13],
            stateAzMERIT2016ela: [0,42,20,28,10],
            stateAzMERIT2016math: [0,38,25,26,11],
            stateAzMERIT2015ela: [0,42,23,28,7],
            stateAzMERIT2015math: [0,38,27,24,11],

            // Chronic Absent Rate for State
            // All Students, All Grades
            stateChronicRate2014: 13,
            stateChronicRate2015: 14,
            stateChronicRate2016: 14,
            stateChronicRate2017: 0,

            subGroups1: [
                  "All Students",
                  "Male",
                  "Female",
                  "White",
                  "Black",
                  "Asian",
                  "Hispanic",
                  "Native American",
                  "Pacific Islander",
                  "Two or More",
                  "SPED",
                  "ELL",
                  "FRL",
                  "Migrant",
                  "Homeless"
            ],

            sortOrder: {
                  "All": 0,
                  "Male": 1,
                  "Female": 2,
                  "White": 3,
                  "Black": 4,
                  "Asian": 5,
                  "Hispanic": 6,
                  "Native American": 7,
                  "Pacific Islander": 8,
                  "Two or More": 9,
                  "SPED": 10,
                  "ELL": 11,
                  "FRL": 12,
                  "Migrant": 13,
                  "Homeless": 14
            },

            defalutAzMERIT: [{
                  ELA1: 0,
                  ELA2: 0,
                  ELA3: 0,
                  ELA4: 0,
                  ELAP: 0,
                  FY: "",
                  area: "",
                  countyID: 0,
                  distID: 0,
                  entityID: 0,
                  group: "All",
                  level: "",
                  schoolID: 0,
                  sort: 0
            }, {
                  ELA1: 0,
                  ELA2: 0,
                  ELA3: 0,
                  ELA4: 0,
                  ELAP: 0,
                  FY: "",
                  area: "",
                  countyID: 0,
                  distID: 0,
                  entityID: 0,
                  group: "Male",
                  level: "",
                  schoolID: 0,
                  sort: 1
            }, {
                  ELA1: 0,
                  ELA2: 0,
                  ELA3: 0,
                  ELA4: 0,
                  ELAP: 0,
                  FY: "",
                  area: "",
                  countyID: 0,
                  distID: 0,
                  entityID: 0,
                  group: "Female",
                  level: "",
                  schoolID: 0,
                  sort: 2
            }, {
                  ELA1: 0,
                  ELA2: 0,
                  ELA3: 0,
                  ELA4: 0,
                  ELAP: 0,
                  FY: "",
                  area: "",
                  countyID: 0,
                  distID: 0,
                  entityID: 0,
                  group: "White",
                  level: "",
                  schoolID: 0,
                  sort: 3
            }, {
                  ELA1: 0,
                  ELA2: 0,
                  ELA3: 0,
                  ELA4: 0,
                  ELAP: 0,
                  FY: "",
                  area: "",
                  countyID: 0,
                  distID: 0,
                  entityID: 0,
                  group: "Black",
                  level: "",
                  schoolID: 0,
                  sort: 4
            }, {
                  ELA1: 0,
                  ELA2: 0,
                  ELA3: 0,
                  ELA4: 0,
                  ELAP: 0,
                  FY: "",
                  area: "",
                  countyID: 0,
                  distID: 0,
                  entityID: 0,
                  group: "Asian",
                  level: "",
                  schoolID: 0,
                  sort: 5
            }, {
                  ELA1: 0,
                  ELA2: 0,
                  ELA3: 0,
                  ELA4: 0,
                  ELAP: 0,
                  FY: "",
                  area: "",
                  countyID: 0,
                  distID: 0,
                  entityID: 0,
                  group: "Hispanic",
                  level: "",
                  schoolID: 0,
                  sort: 6
            }, {
                  ELA1: 0,
                  ELA2: 0,
                  ELA3: 0,
                  ELA4: 0,
                  ELAP: 0,
                  FY: "",
                  area: "",
                  countyID: 0,
                  distID: 0,
                  entityID: 0,
                  group: "Native American",
                  level: "",
                  schoolID: 0,
                  sort: 7
            }, {
                  ELA1: 0,
                  ELA2: 0,
                  ELA3: 0,
                  ELA4: 0,
                  ELAP: 0,
                  FY: "",
                  area: "",
                  countyID: 0,
                  distID: 0,
                  entityID: 0,
                  group: "Pacific Islander",
                  level: "",
                  schoolID: 0,
                  sort: 8
            }, {
                  ELA1: 0,
                  ELA2: 0,
                  ELA3: 0,
                  ELA4: 0,
                  ELAP: 0,
                  FY: "",
                  area: "",
                  countyID: 0,
                  distID: 0,
                  entityID: 0,
                  group: "Two or More Races",
                  level: "",
                  schoolID: 0,
                  sort: 9
            }, {
                  ELA1: 0,
                  ELA2: 0,
                  ELA3: 0,
                  ELA4: 0,
                  ELAP: 0,
                  FY: "",
                  area: "",
                  countyID: 0,
                  distID: 0,
                  entityID: 0,
                  group: "SPED",
                  level: "",
                  schoolID: 0,
                  sort: 10
            }, {
                  ELA1: 0,
                  ELA2: 0,
                  ELA3: 0,
                  ELA4: 0,
                  ELAP: 0,
                  FY: "",
                  area: "",
                  countyID: 0,
                  distID: 0,
                  entityID: 0,
                  group: "ELL",
                  level: "",
                  schoolID: 0,
                  sort: 11
            }, {
                  ELA1: 0,
                  ELA2: 0,
                  ELA3: 0,
                  ELA4: 0,
                  ELAP: 0,
                  FY: "",
                  area: "",
                  countyID: 0,
                  distID: 0,
                  entityID: 0,
                  group: "FRL",
                  level: "",
                  schoolID: 0,
                  sort: 12
            }, {
                  ELA1: 0,
                  ELA2: 0,
                  ELA3: 0,
                  ELA4: 0,
                  ELAP: 0,
                  FY: "",
                  area: "",
                  countyID: 0,
                  distID: 0,
                  entityID: 0,
                  group: "Migrant",
                  level: "",
                  schoolID: 0,
                  sort: 13
            }, {
                  ELA1: 0,
                  ELA2: 0,
                  ELA3: 0,
                  ELA4: 0,
                  ELAP: 0,
                  FY: "",
                  area: "",
                  countyID: 0,
                  distID: 0,
                  entityID: 0,
                  group: "Homeless",
                  level: "",
                  schoolID: 0,
                  sort: 14
            }]


      };
});
