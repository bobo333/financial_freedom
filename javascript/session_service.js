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
		//$window.sessionStorage["userInfo"] = JSON.stringify(email);
		$window.sessionStorage.setItem("userInfo", angular.toJson(user_data));		
		data.currentUser = true;
		data.email = user_data.email;
		console.log(angular.fromJson($window.sessionStorage.getItem("userInfo")));
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
