FinancialFreedom.service('Session', function($window, $timeout) {

	var initialCheck = function() {
		if ($window.sessionStorage["userInfo"] == 'undefined') {
			return null;
		}
		else {
			return $window.sessionStorage["userInfo"];
		}
	}

	var data = {
		currentUser: initialCheck(),
		email: null
	};

	data.create = function(email) {
		$window.sessionStorage["userInfo"] = JSON.stringify(email);
		data.currentUser = true;
		data.email = email;
	};

	data.destroy = function() {

		if ($window.sessionStorage["userInfo"] != 'undefined') {

			data.showLogoutMessage = true;

			$timeout(function() {
				data.showLogoutMessage = null;
				angular.copy(null, data.showLogoutMessage);
				console.log("it's happening");
			}, 2000);
		}

		$window.sessionStorage["userInfo"] = 'undefined';
		data.currentUser = null;
		data.email = null;
	};

	return {
		data: data
	};

});
