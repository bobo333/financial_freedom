FinancialFreedom.service('modalService', ['$modal', 
	function ($modal) {

		var modalDefaults = {
            backdrop: true,
            modalFade: true,
            size: 'lg',
            templateUrl: 'partials/login_modal.html',
            controller: LoginModalInstanceCtrl,
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Sign in',
            bodyText: 'Perform this action?'
        };

		var LoginModalInstanceCtrl = function($scope, $rootScope, $modalInstance, $location, $timeout, AuthService, Session, UserDataCache) {    

			$scope.modalOptions = tempModalOptions;

		    $scope.loginFailureMessage = '';
		    $scope.signUpFailureMessage = '';

		    $scope.goToRoute = function(route) {
		        $location.path(route);
		    };

		    $scope.createAccount = function (credentials) {

		        AuthService.data.createAccount(credentials).then(function(user) {

		            if (this.data.success) {
		                Session.data.create(credentials.email);
		                $modalInstance.close();
		            }

		            else {
		                $scope.signUpFailureMessage = "Email already in use. Either sign in or try a different one.";

		                return angular.forEach(this.data.errors, function(key, value) {
		                    return key;
		                });
		            } 
		        });
		    };

		    $scope.login = function (credentials) {

		        AuthService.data.login(credentials).then(function (user)  {

		            if (this.data.success) {

		                Session.data.create(credentials.email);
		                UserDataCache.userData.fetchUserData();
		                $modalInstance.close();
		                $timeout(function() {
		                    $scope.goToRoute('/time-to-retirement');
		                },500);
		            }

		            else {

		                $scope.loginFailureMessage = "Your email or password was incorrect. Please try again.";

		                return angular.forEach(this.data.errors, function(key, value) {
		                    return key;
		                });
		            }

		        }, function () {
		            $scope.loginFailureMessage = "Login attempt failed. Check your internet connection and try again.";
		        });
		    };

		    $scope.cancel = function () {
		        $modalInstance.dismiss('cancel');
		    };

		};
		
        this.showModal = function (customModalDefaults, customModalType) {
            if (!customModalDefaults) customModalDefaults = {};

            var customModalOptions = {
            	showSignUp: true
            };

            if (customModalType == 'loginModalOptions') {

            	customModalOptions.showSignUp = false;
            }

            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {

            var tempModalDefaults = {};
            var tempModalOptions = {};

            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');
                    };
                };
            }

            return $modal.open(tempModalDefaults).result;
        };

	}]);