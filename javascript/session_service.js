FinancialFreedom.service('Session', ['$window', '$timeout', function($window, $timeout) {

	var data = {
		currentUser: null,
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

	// data.checkSessionStatus = function() {
	// 	if ($window.sessionStorage["userInfo"]) {
 //            data.currentUser = $window.sessionStorage["userInfo"];
 //        }
 //        else {
 //        	return null;
 //        }
	// };

	return {
		data: data
	};

}]);
