FinancialFreedom.factory('UserDataService', function($http, Session) {
	
	var data = {};

	data.getUserData = function() {

		return $http.get('api/get-user-data.php')
			.success(function(response, status, headers, config) {

      			return response.user_data;
	  		}).
		  	error(function(response, status, headers, config) {

		    	this.data = response || "Request failed";
	      		return this.data;
		  	});
	};

	data.updateUserData = function(new_user_data) {

		var req = {
			method: 'POST',
			url: 'api/update-user-data.php',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: $.param(new_user_data)
		};

		if (Session.data.currentUser) {
			return $http(req).
		  		success(function(data, status, headers, config) {

		      		this.data = data;

		      		return this.data;

			  	}).
			  	error(function(data, status, headers, config) {

			    	this.data = data || "Request failed";
		      		return this.data;
			  	});
		}
			

	};

	data.destroy = function() {
		data: {}
	};

	return {
		data: data
	};
});