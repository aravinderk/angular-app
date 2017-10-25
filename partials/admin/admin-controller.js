angular.module('AdminControllerModule', []).controller('AdminController', AdminController);

AdminController.$inject = ['$scope', 'AdminService', '$state'];

function AdminController($scope, AdminService, $state){
	// Variables in $scope 
	$scope.statusMenuItems = AdminService.statusMenuItems;
	$scope.leftMenuItems = AdminService.leftMenuItems;
	$scope.routes = AdminService.routes;
	$scope.cityList = AdminService.getCities();
	$scope.stateList = AdminService.getStates();
	$scope.categoryList = AdminService.getCategoryList();
	$scope.pageIndex = $scope.routes.indexOf($state.current.name) || 0;
	$scope.showSpaceImg = false;
	$scope.formData = {
		basicInfo: {},
		facilityAndTags: {associatedCategory: []},
		addOns: {},
		engineInfo: {},
		configuration: {},
		timings: {},
		policies: {cancellationOperator: 'AND'},
		promotions: {applicable1: [], applicable: []}
	};

	$scope.cancellationOperator = ['AND', 'OR'];

	// Functions in $scope
	$scope.handleNext = HandleNext;
	$scope.saveAsDraft = SaveAsDraft;

	function HandleNext () {
		if($scope.spaceForm.$valid){
			console.log('form valid');
			if (($scope.routes.length - 1) <= $scope.pageIndex) {
				return;
			}
			if ($scope.pageIndex === 1 && !$scope.showSpaceImg ) {
				$scope.showSpaceImg = true;
				return;
			}
			console.log('form data', $scope.formData);
			$scope.spaceForm.$submitted = false;
			$scope.pageIndex++;
			$state.go($scope.routes[$scope.pageIndex], {}, { location: true });
		}
	}

	function SaveAsDraft () {
		alert('Work in progress');
	}
}
