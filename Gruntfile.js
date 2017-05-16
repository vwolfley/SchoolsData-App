module.exports = function(grunt) {

    "use strict";

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

        bannercss:  '/*! ========================================================================\n' +
                    ' * Maricopa Association of Governments\n' +
                    ' * MAG AzMERIT Data Viewer\n' +
                    ' * CSS document guiding layout for the MAG AzMERIT Data Viewer\n' +
                    ' * ==========================================================================\n' +
                    ' * @project    MAG AzMERIT Data Viewer\n' +
                    ' * @version    | version | <%= pkg.version %>\n' +
                    ' * @cssdoc     main.css \n' +
                    ' * @production | <%= pkg.date %>\n' +
                    ' * @copyright  2017 MAG\n' +
                    ' * @license    Licensed under MIT\n' +
                    ' * ========================================================================== */\n',

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
            files: ["app/*.js"],
            options: {
                // strict: true,
                sub: true,
                quotmark: "double",
                trailing: true,
                curly: true,
                eqeqeq: true,
                unused: true,
                scripturl: true, // This option defines globals exposed by the Dojo Toolkit.
                dojo: true, // This option defines globals exposed by the jQuery JavaScript library.
                jquery: true, // Set force to true to report JSHint errors but not fail the task.
                force: true,
                reporter: require("jshint-stylish-ex")
            }
        },

        uglify: {
            options: {
                mangle: false,
                // add banner to top of output file
                // banner: '/*  | <%= pkg.name %> - v<%= pkg.version %> | <%= grunt.template.today("mm-dd-yyyy") %> */\n'
                banner: '/**!\n' + ' * <%= pkg.name %>\n' + ' * v<%= pkg.version %>\n' + ' * <%= grunt.template.today("mm/dd/yyyy") %>\n' + '**/\n'
            },
            build: {
                files: {
                    // config files
                    "../deploy/build_min/app/config/cbrConfig.js": ["app/config/cbrConfig.js"],
                    "../deploy/build_min/app/config/colorRampConfig.js": ["app/config/colorRampConfig.js"],
                    "../deploy/build_min/app/config/queryBuilderConfig.js": ["app/config/queryBuilderConfig.js"],
                    "../deploy/build_min/app/config/readOnConfig.js": ["app/config/readOnConfig.js"],
                }
            }
        },

        bootlint: {
            options: {
                stoponerror: false,
                stoponwarning: false,
                relaxerror: []
            },
            files: ["app/index.html", "app/views/*.html"]
        },

        csslint: {
            strict: {
                options: {
                    formatters: [{
                        id: require("csslint-stylish"),
                        dest: "report/csslint_stylish.xml"
                    }]
                },
                src: ["app/css/main.css"]
            },
            lax: {
                options: {
                    "important": false,
                    "adjoining-classes": false,
                    "known-properties": false,
                    "box-sizing": false,
                    "box-model": false,
                    "overqualified-elements": false,
                    "display-property-grouping": false,
                    "bulletproof-font-face": false,
                    "compatible-vendor-prefixes": false,
                    "regex-selectors": false,
                    "errors": true,
                    "duplicate-background-images": false,
                    "duplicate-properties": false,
                    "empty-rules": false,
                    "selector-max-approaching": false,
                    "gradients": false,
                    "fallback-colors": false,
                    "font-sizes": false,
                    "font-faces": false,
                    "floats": false,
                    "star-property-hack": false,
                    "outline-none": false,
                    "import": false,
                    "ids": false,
                    "underscore-property-hack": false,
                    "rules-count": false,
                    "qualified-headings": false,
                    "selector-max": false,
                    "shorthand": false,
                    "text-indent": false,
                    "unique-headings": false,
                    "universal-selector": false,
                    "unqualified-attributes": false,
                    "vendor-prefix": false,
                    "zero-units": false,
                    formatters: [{
                        id: require("csslint-stylish"),
                        dest: "report/csslint_stylish.xml"
                    }]
                },
                src: ["app/css/main.css"]
            }
        },

        cssmin: {
            add_banner: {
                options: {
                    // add banner to top of output file
                    banner: '/* <%= pkg.name %> - v<%= pkg.version %> | <%= grunt.template.today("mm-dd-yyyy") %> */'
                },
                files: {
                    "dist/app/css/main.min.css": ["app/css/main.css"]
                }
            }
        },

        replace: {
            update_Meta: {
                src: ["index.html", "js/config.js", "humans.txt", "README.md", "css/main.css"], // source files array
                // src: ["README.md"], // source files array
                overwrite: true, // overwrite matched source files
                replacements: [{
                    // html pages
                    from: /(<meta name="revision-date" content=")[0-9]{2}\/[0-9]{2}\/[0-9]{4}(">)/g,
                    to: '<meta name="revision-date" content="' + '<%= pkg.date %>' + '">',
                }, {
                    // html pages
                    from: /(<meta name="version" content=")([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))(">)/g,
                    to: '<meta name="version" content="' + '<%= pkg.version %>' + '">',
                }, {
                    // config.js
                    from: /(v)([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))( \| )[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g,
                    to: 'v' + '<%= pkg.version %>' + ' | ' + '<%= pkg.date %>',
                }, {
                    // humans.txt
                    from: /(Version\: )([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "Version: " + '<%= pkg.version %>',
                }, {
                    // humans.txt
                    from: /(Last updated\: )[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g,
                    to: "Last updated: " + '<%= pkg.date %>',
                }, {
                    // README.md
                    from: /(#### version )([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "#### version " + '<%= pkg.version %>',
                }, {
                    // README.md
                    from: /(`Updated: )[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g,
                    to: "`Updated: " + '<%= pkg.date %>',
                }, {
                    // main.css
                    from: /(@version)([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "@version   " + ' <%= pkg.version %>',
                }]
            }
        }


    });

    // this would be run by typing "grunt test" on the command line
    // grunt.registerTask("test", ["uglify", "cssmin", "concat"]);

    grunt.registerTask("work", ["jshint"]);

    grunt.registerTask("workcss", ["csslint"]);

    grunt.registerTask("buildJS", ["uglify"]);

    grunt.registerTask("update", ["replace"]);

    grunt.registerTask("build", ["replace", "cssmin", "concat"]);

    grunt.registerTask("blint", ["bootlint"]);

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask("default", []);

};

// ref
// http://coding.smashingmagazine.com/2013/10/29/get-up-running-grunt/
// http://csslint.net/about.html
// http://www.jshint.com/docs/options/
// @use JSDoc - http://usejsdoc.org/index.html