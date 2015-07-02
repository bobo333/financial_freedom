FinancialFreedom.factory('AuthService', function($http, Session, UserDataCache) {

	var data = {};

	data.createAccount = function (credentials) {

		var formData = {
  			'email'       : credentials.email,
  			'password'    : credentials.password
		};

		var req = {
			method: 'POST',
			url: 'api/signup.php',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: $.param(formData)
		};

		return $http(req).
  		success(function(data, status, headers, config) {

      		this.data = data;
      		Session.data.create(credentials.email);

      		return this.data;

	  	}).
	  	error(function(data, status, headers, config) {

	    	this.data = data || "Request failed";
      		return this.data;
	  	});

	};

	data.login = function (credentials) {

		var formData = {
  			'email'       : credentials.email,
  			'password'    : credentials.password
		};

		var req = {
			method: 'POST',
			url: 'api/login.php',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: $.param(formData)
		};

		return $http(req).
  		success(function(data, status, headers, config) {

      		this.data = data;
      		
      		if (this.data.success) {
      			Session.data.create(credentials.email);
      		}


      		return this.data;

	  	}).
	  	error(function(data, status, headers, config) {

	    	this.data = data || "Request failed";

      		return this.data;
	  	});

	};

	data.isAuthenticated = function () {
    	return !!Session.data.email;
  	};

  	data.resetPassword = function(credentials) {

		var formData = {
  			'old_password'	: credentials.old_password,
  			'new_password'	: credentials.new_password
		};

		var req = {
			method: 'POST',
			url: 'api/change-password.php',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: $.param(formData)
		};

		return $http(req).
  		success(function(data, status, headers, config) {

      		this.data = data;

            console.log(this.data);


      		return this.data;

	  	}).
	  	error(function(data, status, headers, config) {

	    	this.data = data || "Request failed";

	    	console.log(this.data);

      		return this.data;
	  	});

  	};

 	data.logout = function() {

 		$http.get('api/logout.php').success(function(data, status, headers, config) {

      		this.data = data;
      		Session.data.destroy();
      		UserDataCache.userData.resetUserData();

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

});