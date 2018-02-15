/**
 * Provides view-model implementation of the AZ MERIT scores.
 */
(function() {

    "use strict";
    define([],
        function() {

            var enrollmentTableVM = new function() {
                var self = this;

                /**
                 * [azMERITAllSchoolsChart] - Shows all schools and their AzMERIT score in scatter chart.
                 * Data from [azSchoolsQueryHandler] via [getSchoolsData();]
                 * @return
                 */
                self.enrollmentTableGrade = function(e) {
                    // console.log(e);
                    var info = e;

                    $("#enrollmentTable-Grade").kendoGrid({
                        dataSource: {
                            data: info
                        },
                        // height: 550,
                        groupable: false,
                        sortable: true,
                        resizable: true,
                        pageable: false,
                        columns: [{
                            field: "FY",
                            title: "Fiscal Year",
                            width: 48,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "EntityID",
                            title: "Entity ID",
                            width: 48,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "DistrictEntityID",
                            title: "District Entity ID",
                            width: 58,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "SchoolName",
                            title: "School Name",
                            width: 200,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "SchoolType",
                            title: "School Type",
                            width: 80,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "PS",
                            title: "PS",
                            width: 38,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "KG",
                            title: "KG",
                            width: 38,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "G1",
                            title: "G1",
                            width: 38,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "G2",
                            title: "G2",
                            width: 38,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "G3",
                            title: "G3",
                            width: 38,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "G4",
                            title: "G4",
                            width: 38,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "G5",
                            title: "G5",
                            width: 38,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "G6",
                            title: "G6",
                            width: 38,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "G7",
                            title: "G7",
                            width: 38,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "G8",
                            title: "G8",
                            width: 38,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "UE",
                            title: "UE",
                            width: 38,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "G9",
                            title: "G9",
                            width: 38,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "G10",
                            title: "G10",
                            width: 38,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "G11",
                            title: "G11",
                            width: 38,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "G12",
                            title: "G12",
                            width: 38,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "Total",
                            title: "Total",
                            width: 45,
                            format: "{0:N0}",
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }]
                    });

                };

                self.enrollmentTableRace = function(e) {
                    // console.log(e);
                    var info = e;

                    $("#enrollmentTable-Race").kendoGrid({
                        dataSource: {
                            data: info
                        },
                        // height: 550,
                        groupable: false,
                        sortable: true,
                        resizable: true,
                        pageable: false,
                        columns: [{
                            field: "FY",
                            title: "Fiscal Year",
                            width: 48,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "EntityID",
                            title: "Entity ID",
                            width: 48,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "DistrictEntityID",
                            title: "District Entity ID",
                            width: 58,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "SchoolName",
                            title: "School Name",
                            width: 200,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "SchoolType",
                            title: "School Type",
                            width: 80,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "Subgroup",
                            title: "Subgroup",
                            width: 58,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "Male",
                            title: "Male",
                            width: 38,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "Female",
                            title: "Female",
                            width: 45,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "White",
                            title: "White",
                            width: 38,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "Hispanic",
                            title: "Hispanic",
                            width: 50,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "Asian",
                            title: "Asian",
                            width: 38,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "Black",
                            title: "Black",
                            width: 40,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "NativeAmerican",
                            title: "Native American",
                            width: 45,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "PacificIslander",
                            title: "Pacific Islander",
                            width: 45,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "TwoOrMore",
                            title: "Two Or More",
                            width: 38,
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }, {
                            field: "Total",
                            title: "Total",
                            width: 45,
                            format: "{0:N0}",
                            attributes: {
                                class: "table-cell",
                                style: "text-align: center; font-size: 11px"
                            },
                            headerAttributes: {
                                "class": "grid-header-style",
                                style: "text-align: center; font-size: 12px"
                            }
                        }]
                    });
                };


            }; // end enrollmentTableVM
            return enrollmentTableVM;
        } // end function
    );
}());
