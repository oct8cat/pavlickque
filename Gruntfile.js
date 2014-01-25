(function(module) {
    'use strict';

    module.exports = function(grunt) {
        grunt.initConfig({
            jshint: {
                all: ['index.js', 'lib/**/*.js'],
                options: {
                    jshintrc: '.jshintrc',
                }
            }
        });

        grunt.loadNpmTasks('grunt-contrib-jshint');

        grunt.registerTask('build', ['jshint']);
        grunt.registerTask('default', ['build']);
    };

}).call(this, module);
