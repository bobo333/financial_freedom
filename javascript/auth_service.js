FinancialFreedom.factory('AuthService', function() {

	var userLoggedIn = false;

	return {

		createAccount: function(email, password) {



		},
		login: function() { // eventually will have arguments of email and password
			userLoggedIn = true; // to be set to the token and userID
		},
		logout: function() {
			userLoggedIn = false;
		},
		isUserLoggedIn: function() {
			return userLoggedIn;
		}
	}
});