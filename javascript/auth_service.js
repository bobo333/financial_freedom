FinancialFreedom.factory('AuthService', ['$http', 'Session', function($http, Session) {

	var authService = {};

	authService.createAccount = function (credentials) {

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

	authService.login = function (credentials) {

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

	authService.isAuthenticated = function () {
    	return !!Session.email;
  	};

 	authService.logout = function() {
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

 	return authService;

}]);