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

        htmlhint: {
            build: {
                options: {
                    "tag-pair": true, // Force tags to have a closing pair
                    "tagname-lowercase": true, // Force tags to be lowercase
                    "attr-lowercase": true, // Force attribute names to be lowercase e.g. <div id="header"> is invalid
                    "attr-value-double-quotes": true, // Force attributes to have double quotes rather than single
                    // "doctype-first": true,           // Force the DOCTYPE declaration to come first in the document
                    "spec-char-escape": true, // Force special characters to be escaped
                    "id-unique": true, // Prevent using the same ID multiple times in a document
                    // "head-script-disabled": false,   // Prevent script tags being loaded in the head for performance reasons
                    "style-disabled": true // Prevent style tags. CSS should be loaded through
                },
                src: ["index.html", "app/views/*.html"]
            }
        },

        jshint: {
            options: {
                jshintrc: true,
                reporter: require("jshint-stylish-ex")
            },
            src: ["Gruntfile.js", "src/js/*.js"],
        },

        uglify: {
            options: {
                banner: "<% var subtask = uglify[grunt.task.current.target]; %>" +
                    "\n/*! <%= subtask.name %> */",
                preserveComments: "true",
                mangle: false
            },
            task1: {
                name: "config.min.js",
                files: [{
                    src: "dist/js/config.js",
                    dest: "dist/js/config.min.js"
                }]
            }
        },

        cssmin: {
            options: {
                specialComments: "all",
                processImport: false,
                roundingPrecision: -1,
                mergeIntoShorthands: false,
                advanced: false,
            },
            target: {
                files: [{
                    expand: true,
                    cwd: "dist/css",
                    src: ["calciteCss.css", "custom.css"],
                    dest: "dist/css",
                    ext: ".min.css"
                }]
            }
        },

        concat: {
            css: {
                options: {
                    stripBanners: true,
                    banner: "<%= bannercss %>"
                },
                src: ["dist/css/calciteCss.min.css", "dist/css/custom.min.css"],
                dest: "dist/css/main-concat.min.css",
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

    grunt.registerTask("build", ["clean:build", "replace", "copy", "cssmin", "uglify", "concat", "clean:cleancss", "clean:cleanjs", "toggleComments"]);


    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask("default", []);

};

// ref
// http://coding.smashingmagazine.com/2013/10/29/get-up-running-grunt/
// http://csslint.net/about.html
// http://www.jshint.com/docs/options/
// @use JSDoc - http://usejsdoc.org/index.html
