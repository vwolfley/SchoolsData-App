/**
 * Provides view-model implementation of the AZ MERIT scores.
 */
(function() {

    "use strict";
    define([],
        function() {

            var districtTableVM = new function() {
                var self = this;

                /**
                 * [districtTable] District Summary Grid
                 * @param  {[type]} e [description]
                 * @return {[type]}   [description]
                 */
                self.districtTable = function(e) {
                    var info = e;
                    // console.log(info);

                    buildDgrid();

                    function buildDgrid() {
                        $("#grid").kendoGrid({
                            dataSource: {
                                data: info
                            },
                            groupable: false,
                            sortable: true,
                            pageable: false,
                            resizable: true,
                            columns: [{
                                field: "DistrictEntityID",
                                title: "District Entity ID",
                                width: 58,
                                attributes: {
                                    class: "table-cell",
                                    style: "text-align: center; font-size: 11px"
                                },
                                headerAttributes: {
                                    class: "grid-header-style",
                                    style: "text-align: center; font-size: 12px"
                                }
                            }, {
                                field: "EntityID",
                                title: "School Entity ID",
                                sortable: {
                                  initialDirection: "desc"
                                },
                                width: 48,
                                attributes: {
                                    class: "table-cell",
                                    style: "text-align: center; font-size: 11px"
                                },
                                headerAttributes: {
                                    class: "grid-header-style",
                                    style: "text-align: center; font-size: 12px"
                                }
                            }, {
                                field: "SchoolName",
                                title: "School Name",
                                width: 260,
                                attributes: {
                                    class: "table-cell",
                                    style: "font-size: 11px"
                                },
                                headerAttributes: {
                                    class: "grid-header-style",
                                    style: "text-align: center; font-size: 12px"
                                }
                            }, {
                                field: "EntityClass",
                                title: "School Class",
                                width: 70,
                                attributes: {
                                    class: "table-cell",
                                    style: "text-align: center; font-size: 11px"
                                },
                                headerAttributes: {
                                    class: "grid-header-style",
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
                                    class: "grid-header-style",
                                    style: "text-align: center; font-size: 12px"
                                }
                            }, {
                                field: "GradeLevels",
                                title: "Grades",
                                width: 150,
                                attributes: {
                                    class: "table-cell",
                                    style: "font-size: 11px"
                                },
                                headerAttributes: {
                                    class: "grid-header-style",
                                    style: "text-align: center; font-size: 12px"
                                }
                            }, {
                                field: "Active",
                                title: "Active",
                                width: 40,
                                attributes: {
                                    class: "table-cell",
                                    style: "text-align: center; font-size: 11px"
                                },
                                headerAttributes: {
                                    class: "grid-header-style",
                                    style: "text-align: center; font-size: 12px"
                                }
                            }, {
                                field: "ELA_Passing",
                                title: "% Passing ELA",
                                format: "{0:p0 %}",
                                template: "#= kendo.format('{0:p0}', ELA_Passing / 100) #",
                                width: 55,
                                attributes: {
                                    class: "table-cell",
                                    style: "text-align: center; font-size: 11px"
                                },
                                headerAttributes: {
                                    class: "grid-header-style",
                                    style: "text-align: center; font-size: 12px"
                                }
                            }, {
                                field: "MATH_Passing",
                                title: "% Passing MATH",
                                format: "{0:p0 %}",
                                template: "#= kendo.format('{0:p0}', MATH_Passing / 100) #",
                                width: 55,
                                attributes: {
                                    class: "table-cell",
                                    style: "text-align: center; font-size: 11px"
                                },
                                headerAttributes: {
                                    class: "grid-header-style",
                                    style: "text-align: center; font-size: 12px"
                                }
                            }]
                        });

                    }

                };

            }; // end districtTableVM
            return districtTableVM;
        } // end function
    );
}());
