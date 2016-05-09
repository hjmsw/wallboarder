module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      my_target: {
        files: {
          'public/js/main.min.js': [
            'public/js/colorPicker.js',
            'public/js/io.js',
            'public/js/jquery.tinycolorpicker.js',
            'public/js/revisionPagination.js',
            'public/js/socketio.js',
            'public/js/tables.js',
            'public/js/textBox.js',
            'public/js/ui.js'
          ]
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};
