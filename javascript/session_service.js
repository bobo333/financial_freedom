FinancialFreedom.service('Session', function() {

	var session = {};

	session.create = function(email) {
		this.email = email;
		$window.sessionStorage
	};

	session.destroy = function() {
		this.email = null;
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

});