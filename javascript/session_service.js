FinancialFreedom.service('Session', function($window, $timeout) {

	var initialCheck = function() {
		if ($window.sessionStorage["userInfo"] == 'undefined') {
			return null;
		}
		else {
			return $window.sessionStorage["userInfo"];
		}
	};

	var data = {
		currentUser: initialCheck(),
		email: null
	};

	data.create = function(user_data) {
		$window.sessionStorage.setItem("userInfo", angular.toJson(user_data));		
		data.currentUser = true;
		data.email = user_data.email;
	};

	data.destroy = function() {

		$window.sessionStorage.userInfo = 'undefined';
		data.currentUser = null;
		data.email = null;
	};

	return {
		data: data
	};

});
