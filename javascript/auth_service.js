FinancialFreedom.factory('AuthService', ['$http', 'Session', function($http, Session) {

	var data = {
		showSignUp: false
	};

	 data.updateShowSignUp = function(userStatus) {
		if (userStatus == "signUp") {
			data.showSignUp = true;
			return;
		};

		if (userStatus == "signIn") {
			data.showSignUp = false;
			return;
		};
	};

	data.createAccount = function (credentials) {

		var formData = {
  			'email'       : credentials.email,
  			'password'    : credentials.password
		}

		var req = {
			method: 'POST',
			url: 'api/signup.php',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: $.param(formData)
		}

		return $http(req).
  		success(function(data, status, headers, config) {

      		this.data = data;
      		Session.create(credentials.email);
  			console.log(this.data);

      		return this.data;

	  	}).
	  	error(function(data, status, headers, config) {

	    	this.data = data || "Request failed";
	    	console.log(this.data);
      		return this.data;
	  	});

	};

	data.login = function (credentials) {

		var formData = {
  			'email'       : credentials.email,
  			'password'    : credentials.password
		}

		var req = {
			method: 'POST',
			url: 'api/login.php',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: $.param(formData)
		}

		return $http(req).
  		success(function(data, status, headers, config) {

      		this.data = data;
      		Session.create(credentials.email);
  			console.log(this.data);

      		return this.data;

	  	}).
	  	error(function(data, status, headers, config) {

	    	this.data = data || "Request failed";

      		return this.data;
	  	});

	};

	data.isAuthenticated = function () {
    	return !!Session.email;
  	};

 	data.logout = function() {
 		$http.get('api/logout.php').success(function(data, status, headers, config) {

      		this.data = data;

      		Session.destroy();

      		console.log(this.data);

      		return this.data;

	  	}).
	  	error(function(data, status, headers, config) {

      		this.status = status;
      		return this.data;
	  	});
 	};

 	return {
 		data: data
 	};

}]);