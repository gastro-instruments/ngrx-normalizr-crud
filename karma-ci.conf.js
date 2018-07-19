// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function(config) {
	config.set({
		basePath: './',
		frameworks: ['jasmine', 'karma-typescript'],
		files: [{ pattern: 'src/**/*.ts' }],
		preprocessors: {
			'src/**/*.ts': ['karma-typescript']
		},
		plugins: [
			require('karma-jasmine'),
			require('karma-typescript'),
			require('karma-chrome-launcher'),
			require('karma-coverage-istanbul-reporter')
		],
		client: {
			clearContext: false // leave Jasmine Spec Runner output visible in browser
		},
		coverageIstanbulReporter: {
			reports: ['html', 'lcovonly'],
			fixWebpackSourcePaths: true
		},
		reporters: ['progress', 'karma-typescript'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: false,
		browsers: ['ChromeHeadlessNoSandbox'],
		customLaunchers: {
			ChromeHeadlessNoSandbox: {
				base: 'ChromeHeadless',
				flags: ['--no-sandbox']
			}
		},
		singleRun: true
	});
};
