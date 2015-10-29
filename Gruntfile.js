module.exports = function(grunt) {
	grunt.initConfig({
	  	compass: {
			dist: {
				options: {
					sassDir: 'sass',
					cssDir: 'stylesheets/output/'
				}
			}
		},

	  	watch: {	
			css: {
				files: ['**/*.scss'],
				tasks: ['compass'],
				options: {
					atBegin: true,
				},
			},
			html: {
				files: ['./index.php']
			},
			scripts: {
				files: ['./javascript/*', './Gruntfile.js']
			},

		}
	});

	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['watch']);
};