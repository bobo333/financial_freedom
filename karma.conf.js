// Karma configuration
// Generated on Thu Nov 06 2014 23:24:40 GMT-0800 (Pacific Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'bower_components/angular/angular.min.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/angular-route/angular-route.min.js',
        'bower_components/angular-i18n/angular-locale_en-us.js',
        'javascript/custom/ng-currency.js',
        
        'javascript/app.js',
        'javascript/interest_service.js',
        'javascript/retirement_calculator_service.js',
        'javascript/create_retirement_graph_service.js',
        
        'test/unit/retirement_calculator_service_spec.js',
        'test/unit/interest_service_spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['Chrome', 'Firefox', 'PhantomJS'],
    browsers: ['PhantomJS'],
    

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
