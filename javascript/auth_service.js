FinancialFreedom.factory('AuthService', ['$resource', '$http', function($resource, $http) {
	return {

		userSignup: function(user) {

			var formData = {
      			'email'       : user.emailsubmission,
      			'password'    : user.passwordsubmission1
  			};


			var req = {
				method: 'POST',
				url: 'api/signup.php',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: $.param(formData)
			}

			$http(req).
	  		success(function(data, status, headers, config) {
		    // this callback will be called asynchronously
		    // when the response is available
		    	this.status = status;
          		this.data = data;
          		console.log("Request was a runaway success");
          		console.log(this.data);
		  	}).
		  	error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		    	this.data = data || "Request failed";
          		this.status = status;
          		console.log("Request was a massive failure");
          		console.log(this.data);
		  	});

		},

	 	logout: function() {
	 		$http.get('api/logout.php').success(function(data, status, headers, config) {
		    // this callback will be called asynchronously
		    // when the response is available
		    	this.status = status;
          		this.data = data;
          		console.log(data);
		  	}).
		  	error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		    	this.data = data || "Request failed";
          		this.status = status;
		  	});
	 	}
	}
}]);