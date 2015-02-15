FinancialFreedom.service('GoogleAnalyticsService', ['$rootScope', '$location', '$window', function($rootScope, $location, $window) {

	$rootScope.$on('$routeChangeSuccess', function(event) {
    	$window.ga('send', 'pageview', { page: $location.url() });
	});
}]);
