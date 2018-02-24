module.exports = function(grunt) {

    "use strict";

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

        bannercss: "/*! =============================================================\n" +
            " * Maricopa Association of Governments\n" +
            " * CSS Document\n" +
            " * @project    MAG Schools Data Visualization Project\n" +
            " * @file       main-concat.main.css\n" +
            " * @summary    css files that have been minified and concatenated\n" +
            " * @version    <%= pkg.version %>\n" +
            " * @date       <%= pkg.date %>\n" +
            " * @copyright  <%= pkg.copyright %>\n" +
            " * @license    MIT\n" +
            " * ===============================================================\n" +
            " */",

        bannerjs: "/*! ========================================================================\n" +
            " * Maricopa Association of Governments\n" +
            " * JavaScript Document\n" +
            " * @project    MAG Schools Data Visualization Project\n" +
            " * @file       main-concat.min.js\n" +
            " * @summary    JavaScript files that have been minified and concatenated\n" +
            " * @version    <%= pkg.version %>\n" +
            " * @date       <%= pkg.date %>\n" +
            " * @copyright  <%= pkg.copyright %>\n" +
            " * @license    MIT\n" +
            " * ========================================================================== */\n",

        jshint: {
            options: {
                jshintrc: true,
                reporter: require("jshint-stylish-ex")
            },
            src: ["Gruntfile.js", "src/js/*.js"],
        },

        uglify: {
            options: {
                // banner: "<% var subtask = uglify[grunt.task.current.target]; %>" +
                //     "\n/*! <%= subtask.name %> */",
                preserveComments: "true",
                mangle: false
            },
            files: [{
                expand: true,
                src: ["dist/app/js/*.js"],
                dest: "dist/app/js",
                cwd: '.',
            }]
            // task1: {
            //     name: "config.min.js",
            //     files: [{
            //         src: "dist/js/config.js",
            //         dest: "dist/js/config.min.js"
            //     }]
            // }
        },

        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist/app/css/main.min.css': ['dist/app/css/normalize.css', 'dist/app/css/main.css']
                }
            }
        },

        // cssmin: {
        //     // options: {
        //     //     specialComments: "all",
        //     //     processImport: false,
        //     //     roundingPrecision: -1,
        //     //     mergeIntoShorthands: false,
        //     //     advanced: false
        //     // },
        //     target: {
        //         files: [{
        //             expand: true,
        //             cwd: "dist/app/css",
        //             src: ["main.css", "normalize.css"],
        //             dest: "dist/app/css",
        //             ext: ".min.css"
        //         }]
        //     }
        // },

        concat: {
            css: {
                options: {
                    stripBanners: true,
                    banner: "<%= bannercss %>"
                },
                src: ["dist/app/css/normalize.min.css", "dist/app/css/main.min.css"],
                dest: "dist/app/css/main-concat.min.css",
                nonull: true,
            },
            js: {
                options: {
                    stripBanners: true,
                    banner: "<%= bannerjs %>"
                },
                src: ["dist/js/config.min.js", "dist/js/popupPanelEvents.min.js", "dist/js/layer.min.js", "dist/js/widgets.min.js", "dist/js/legend.min.js", "dist/js/popupFormat.min.js", "dist/js/main.min.js", ],
                dest: "dist/js/main-concat.min.js",
                nonull: true,
            }
        },

        clean: {
            build: {
                src: ["dist/"]
            },
            cleancss: {
                src: ["dist/css/*.css", "!dist/css/main-concat.min.css"]
            },
            cleanjs: {
                src: ["dist/js/*.js", "!dist/js/main-concat.min.js"]
            },
        },

        copy: {
            build: {
                cwd: "src/",
                src: ["**"],
                dest: "dist/",
                expand: true,
                dot: true
            }
        },

        toggleComments: {
            customOptions: {
                options: {
                    removeCommands: true
                },
                files: {
                    "dist/index.html": "src/index.html"
                }
            }
        },

        replace: {
            update_Meta: {
                src: ["src/index.html", "src/js/config.js", "src/humans.txt", "README.md"],
                overwrite: true, // overwrite matched source files
                replacements: [{
                    // html pages
                    from: /(<meta name="revision-date" content=")[0-9]{4}-[0-9]{2}-[0-9]{2}(">)/g,
                    to: '<meta name="revision-date" content="' + '<%= pkg.date %>' + '">',
                }, {
                    // html pages
                    from: /(<meta name="version" content=")([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))(">)/g,
                    to: '<meta name="version" content="' + '<%= pkg.version %>' + '">',
                }, {
                    // config.js
                    // version: "v0.0.2 | 2017-12-18",
                    from: /(v)([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))( \| )[0-9]{4}-[0-9]{2}-[0-9]{2}/g,
                    to: 'v' + '<%= pkg.version %>' + ' | ' + '<%= pkg.date %>',
                }, {
                    // config.js
                    // copyright: "2017",
                    from: /(copyright: )[0-9]{4}/g,
                    to: "copyright: " + "<%= pkg.copyright %>",
                }, {
                    // humans.txt
                    from: /(Version\: )([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "Version: " + '<%= pkg.version %>',
                }, {
                    // humans.txt
                    from: /(Last updated\: )[0-9]{4}-[0-9]{2}-[0-9]{2}/g,
                    to: "Last updated: " + '<%= pkg.date %>',
                }, {
                    // README.md
                    from: /(### version )([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "### version " + '<%= pkg.version %>',
                }, {
                    // README.md
                    from: /(`Updated: )[0-9]{4}-[0-9]{2}-[0-9]{2}/g,
                    to: "`Updated: " + '<%= pkg.date %>',
                }]
            }
        }


    });

    // this would be run by typing "grunt test" on the command line
    // grunt.registerTask("test", ["uglify", "cssmin", "concat"]);

    grunt.registerTask("work", ["jshint"]);
    grunt.registerTask("update", ["replace"]);

    grunt.registerTask("build", ["clean:build", "replace", "copy", "toggleComments"]);


    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask("default", []);

};

// ref
// http://coding.smashingmagazine.com/2013/10/29/get-up-running-grunt/
// http://csslint.net/about.html
// http://www.jshint.com/docs/options/
// @use JSDoc - http://usejsdoc.org/index.html
