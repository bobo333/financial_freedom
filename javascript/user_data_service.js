FinancialFreedom.factory('UserDataService', function($http, Session, UserDataCache) {
	
	var data = {};

	data.getUserData = function() {

		return $http.get('api/get-user-data.php').success(function(response, status, headers, config) {

  			// data.user_data = response.user_data; Set user data
  			console.log(response.user_data);

  			UserDataCache.email = response.user_data.email;
  			UserDataCache.created_at = response.user_data.created_at;

      		return response.user_data;
	  	}).
	  	error(function(response, status, headers, config) {

	    	this.data = response || "Request failed";
	    	console.log(this.data);
      		return this.data;
	  	});
	}

	data.updateUserData = function(new_user_data) {

		var req = {
			method: 'POST',
			url: 'api/update-user-data.php',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: $.param(new_user_data)
		}

		if (Session.data.currentUser) {
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
		}
			

	}

	return {
		data: data
	}
});