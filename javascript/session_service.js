FinancialFreedom.service('Session', ['$window', '$timeout', function($window, $timeout) {

	var session = {};

	session.showLogoutMessage = null;

	session.create = function(email) {
		this.email = email;
		$window.sessionStorage["userInfo"] = JSON.stringify(email);
	};

	session.destroy = function() {

		if ($window.sessionStorage["userInfo"] != 'undefined') {

			session.showLogoutMessage = true;

			$timeout(function() {
				session.showLogoutMessage = null;
				angular.copy(null, session.showLogoutMessage);
				console.log("it's happening");
			}, 2000);
		}

		$window.sessionStorage["userInfo"] = 'undefined';
	};

	session.checkSessionStatus = function() {
		if ($window.sessionStorage["userInfo"]) {
            this.currentUser = $window.sessionStorage["userInfo"];
            return this.currentUser;
        }
        else {
        	return null;
        }
	};

	return session;

}]);
