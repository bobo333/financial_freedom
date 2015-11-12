FinancialFreedom.service('modalService', ['$modal',
	function ($modal) {

		var modalDefaults = {
            backdrop: true,
            modalFade: true,
            size: 'lg',
            templateUrl: 'partials/login_modal.html',
            controller: 'LoginModalInstanceCtrl'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Default header text',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalType) {

            var customModalOptions = {};

            if (!customModalDefaults) customModalDefaults = {};
            this.showSignUp = true;

            if (customModalType === 'loginModalOptions') {
            	this.showSignUp = false;
            }

            else if (customModalType === 'accountModalOptions') {
            	customModalDefaults.templateUrl = 'partials/account_modal.html';
            	customModalDefaults.controller = 'AccountModalInstanceCtrl';
            }
			else if (customModalType === 'feedbackModalOptions') {
            	customModalDefaults.templateUrl = 'partials/feedback_modal.html';
            	customModalDefaults.controller = 'FeedbackCtrl';
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

		this.close = function() {
				$modalInstance.dismiss('cancel');
		};

	}]);
