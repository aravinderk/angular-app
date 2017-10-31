angular.module('AdminControllerModule', []).controller('AdminController', AdminController);

AdminController.$inject = ['$scope', 'AdminService', '$state'];

function AdminController($scope, AdminService, $state){
	
	initController(); // Entry point for the controller
	var cityMap = {};
	
	// This will handle next button in each page
	function HandleNext () {
		if($scope.spaceForm.$valid){
			if (($scope.routes.length - 1) <= $scope.pageIndex) {
				return;
			}
			if ($scope.pageIndex === 1 && !$scope.showSpaceImg ) {
				$scope.showSpaceImg = true;
				return;
			}
			$scope.pageIndex++;
			$state.go($scope.routes[$scope.pageIndex], {}, { location: true });
			// TO DO :: If required, send from data to backend
			console.log($scope.formData);
		}
	}

	// This will handle state dropdown change
	function handleStateChange () {
		$scope.cityList = cityMap[$scope.formData.basicInfo.state];
		$scope.formData.basicInfo.city = '';
	}

	// This will handle save as draft functionality
	function SaveAsDraft () {
		AdminService.saveAsDraft($scope.formData).then(function(res){
			// TO DO :: Need to display acknowledgement to user
		});
	}

	function getAddressList (e, searchStr) {
		var dropdown = $(e.target).parent().find('.dropdown');
		if(searchStr && searchStr.length > 2 && $scope.searchStr !== searchStr) {
			resetLongAngLat();
			$scope.searchStr = searchStr;
			AdminService.getAddressList(searchStr).then(function(data){
				$scope.placesFromMap = data;
				if(!dropdown.hasClass('open') && data.length > 0){
					dropdown.find('button').click();
				}
			});
		} else if(!searchStr || (searchStr && searchStr.length < 3)){
			dropdown.removeClass('open');
			resetLongAngLat();
		}	
	}

	function getPlaceDetails (e, place) {
		e.preventDefault();
		$scope.formData.basicInfo.locationOnMap = place.name;
		AdminService.getPlaceDetails(place.id).then(function(data){
			$scope.formData.basicInfo.latitude = data.lat;
			$scope.formData.basicInfo.longitude = data.lng;
		});
	}

	function resetLongAngLat () {
		$scope.formData.basicInfo.latitude = '';
		$scope.formData.basicInfo.longitude = '';
	}

	function showAddFacilityPopup () {
		$scope.facility = '';
		$('#addFacilityModal').modal('show');
		$('#addFacilityModal input[type=text]').focus();
	}

	function addFacility () {
		if( $scope.facility ){
			$scope.addFacilitySubmit = false;
			$('#addFacilityModal').modal('hide');
			$scope.formData.facilityAndTags.facilities.push($scope.facility);
			$scope.facility = '';
		} else {
			$scope.addFacilitySubmit = true;
		}
	}

	function selectImage () {
		$('.spaceImgContainer input[name=uploadImg]').click();
	}

	function handleChangeImage (input) {
		$scope.imageError = false;
		if (input.files && input.files[0]) {
			var allowedTypes = ['PNG', 'JPG', 'JPEG'];
			var file = input.files[0];
			var fileType = file.name.substr(file.name.lastIndexOf('.') + 1);
			if(((file.size / 1024).toFixed(3)) > 1024 || !fileType || (fileType && allowedTypes.indexOf(fileType.toUpperCase()) <= -1)){
				$scope.imageError = true;
				$scope.$apply();
				return;
			}
			var reader = new FileReader();
			reader.onload = function(e) {
				$scope.imageUrls.push(e.target.result);
				$scope.formData.facilityAndTags.images.push(input.files[0]);
				$scope.$apply();
			}
			reader.readAsDataURL(input.files[0]);
		}
	}

	function initController () {
		// Functions in $scope
		$scope.handleNext = HandleNext;
		$scope.saveAsDraft = SaveAsDraft;
		$scope.handleStateChange = handleStateChange;
		$scope.getAddressList = getAddressList;
		$scope.getPlaceDetails = getPlaceDetails;
		$scope.showAddFacilityPopup = showAddFacilityPopup;
		$scope.addFacility = addFacility;
		$scope.selectImage = selectImage;
		$scope.handleChangeImage = handleChangeImage;

		// Variables in $scope 
		$scope.statusMenuItems = AdminService.getStatusMenuItems();
		$scope.routes = AdminService.getRoutes();
		$scope.cityList = [];
		$scope.imageUrls = [];
		$scope.pageIndex = $scope.routes.indexOf($state.current.name) || 0;
		$scope.formData = {
			basicInfo: {},
			facilityAndTags: {facilities: [], associatedCategory: [], images: []},
			addOns: {},
			engineInfo: {},
			configuration: {},
			timings: {},
			policies: {},
			promotions: {}
		};
		
		AdminService.getCities().then(function(data){
			data.forEach(function(item) {
				if(!cityMap[item.state_map]){
					cityMap[item.state_map] = [];
				}
				cityMap[item.state_map].push(item);
			});
		});

		AdminService.getStates().then(function(data){
			$scope.stateList = data;
		});

		AdminService.getAssociatedCategoryList().then(function(data){
			$scope.associatedCategoryList = data;
		});
	}
}
