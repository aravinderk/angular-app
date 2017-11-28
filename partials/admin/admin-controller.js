angular.module('AdminControllerModule', []).controller('AdminController', AdminController);

AdminController.$inject = ['$scope', 'AdminService', '$state', '$timeout','$transitions'];

function AdminController($scope, AdminService, $state, $timeout, $transitions){
	
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
			if($scope.pageIndex === 2){
				if(!$scope.spaceForm.$pristine){
					alert("You have unsaved data");
					return;
				}
			}
			$scope.pageIndex++;
			$scope.spaceForm.$submitted = false;
			$state.go($scope.routes[$scope.pageIndex], {}, { location: true });
			// TO DO :: If required, send from data to backend
			console.log($scope.formData);

			
		}
	}
	$transitions.onSuccess({}, function(trans) {
			$scope.pageIndex = $scope.routes.indexOf(trans.$to().name) || 0;
			if(trans.$to().name == 'admin.facilityTags') {
					$scope.showSpaceImg = false;
			}
	});
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
	// Functions related to Admin Addon Page start here 
	function createAddon(){
		$scope.formData.addOns.addonList.push({saved: false})
		$scope.hideAddOnSave = false;
	}
	function saveAddOn(){
		$scope.spaceForm.$submitted = true;
		if($scope.spaceForm.$valid){
			angular.forEach($scope.formData.addOns.addonList,function(item, index){
				item['saved'] = true;
			})
			$scope.spaceForm.$submitted = false;
			$scope.hideAddOnSave = true;
			$scope.spaceForm.$pristine = true;
		}
		
	}
	function deleteAddOn(addOn){
		angular.forEach($scope.formData.addOns.addonList, function(item, index){
			if(item.$$hashKey == addOn.$$hashKey){
				$scope.formData.addOns.addonList.splice(index, 1)
			}
		})
		if($scope.formData.addOns.addonList.length == 0){
			$scope.formData.addOns.addonList.push({saved: false})
			$scope.spaceForm.$submitted = false;
		}
	}

	function cancelAddon(){
		var listLength = $scope.formData.addOns.addonList.length
		for(var i=0; i < listLength; i++){
			if(!$scope.formData.addOns.addonList[$scope.formData.addOns.addonList.length - 1].saved){
				$scope.formData.addOns.addonList.splice($scope.formData.addOns.addonList.length - 1, 1)
			}
		}
		
				$scope.spaceForm.$submitted = false;
				$scope.spaceForm.$pristine = true;
				$scope.hideAddOnSave = true;
	}
	function multiSelectHolidayCaolender (event) {

	}
	//Functions related to Admin Addon Page end here 
	function generateTimeSlots(){
		var timeSlots = [];
		var time = 0;
		for(var i=0; i < 24; i++){
			if(i < 9){
				i = '0' + i;
			}
			for(var j = 0; j < 2; j++){
				if(j == 0){
					timeSlots.push(i + ':00')
				}else{
					timeSlots.push(i + ':30')
				}
			}
		}
		return timeSlots;
	}
	
	function toggleTimePicker(params) {
		if(params == 'startTime'){
			$scope.startTimeShow = !$scope.startTimeShow;
		}else{
			$scope.endTimeShow = !$scope.endTimeShow;
		}
	}
	function selectSlot(slotTime, slotType) {
		var isValid = false;
		var slotObj = {};
		if(slotType == 'startTime'){
			$scope.formData.timings.startTime = slotTime;
			$scope.startTimeShow = false;
			isValid = true;
		}else{
			if($scope.formData.timings.startTime < slotTime){
				$scope.formData.timings.endTime = slotTime;
				$scope.endTimeShow = false;
				isValid = true;
			}else{
				alert("End Time can not be less than Start Time")
			}
		}
		
		if(isValid && $scope.formData.timings.endTime !== undefined){
			slotObj = {
				"startTime": $scope.formData.timings.startTime,
				"endTime": $scope.formData.timings.endTime
			}
			$scope.formData.timings.dates.slots.push(slotObj)
			$scope.formData.timings.startTime = undefined;
			$scope.formData.timings.endTime = undefined;
		}
		console.log($scope.formData.timings.dates)
	}
	
	function saveMonthSlot(params) {
		
		var slotObj =  { 
			"month": angular.copy($scope.formData.timings.dates.month), 
			"holidays":angular.copy($scope.formData.timings.holidayList), 
			"days":angular.copy($scope.formData.timings.selectedDaysList),
			"daysSlots":angular.copy($scope.formData.timings.dates.slots),
			"noOfSlots": angular.copy($scope.formData.timings.noOfSlots), 
			"price":angular.copy($scope.formData.timings.price)
		}
		console.log($scope.formData.timings.slotObj)
		$scope.formData.timings.slotObj.push(slotObj)
		clearTimingFields();
	}
	function deleteHoliday(date){
		angular.forEach($scope.formData.timings.holidayList, function(item, index){
			if(item.$$hashKey == date.$$hashKey){
				$scope.formData.timings.holidayList.splice(index, 1);
			}
		});
	}
	function deleteSlot(slot){
		angular.forEach($scope.formData.timings.dates.slots, function(item, index){
			if(item.$$hashKey == slot.$$hashKey){
				$scope.formData.timings.dates.slots.splice(index, 1)
			}
		})
	}
	function deleteDay(day){
		var index = $scope.formData.timings.selectedDaysList.indexOf(day)
		$scope.formData.timings.selectedDaysList.splice(index, 1)
	}
	function clearTimingFields (){
		$scope.formData.timings.dates.month = '';
		$scope.formData.timings.holidayList = [];
		$scope.formData.timings.selectedDaysList = [];
		$scope.formData.timings.dates.slots = [];
		$scope.formData.timings.noOfSlots = '';
		$scope.formData.timings.price = '';
	}
	$scope.$watch('formData.engineInfo.rooms', function (newValue, oldValue) {
		if (newValue !== oldValue) {
			$scope.formData.engineInfo.seats = oldValue;
		}	
	});

	$scope.$watch('formData.engineInfo.seats', function (newValue, oldValue) {
		if (newValue !== oldValue) {
			$scope.formData.engineInfo.rooms = oldValue;
		}
	});

	$scope.$watch('formData.timings.dates.holidays', function(newValue, oldValue){
		if(newValue !== null && newValue !== oldValue)
		$scope.formData.timings.holidayList.push(newValue);
	})
	$scope.$watch('formData.timings.days', function(newVal, oldVal){
		if(newVal != 'select' && newVal !== undefined && $scope.formData.timings.selectedDaysList.indexOf(newVal) == -1)
		$scope.formData.timings.selectedDaysList.push(newVal);
	})
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
		$scope.createAddon = createAddon;
		$scope.saveAddOn = saveAddOn;
		$scope.deleteAddOn = deleteAddOn;
		$scope.cancelAddon = cancelAddon;
		$scope.toggleTimePicker = toggleTimePicker;
		$scope.selectSlot = selectSlot;
		$scope.saveMonthSlot = saveMonthSlot;
		$scope.deleteSlot = deleteSlot;
		$scope.deleteHoliday = deleteHoliday;
		$scope.deleteDay = deleteDay;
		// $scope.bookSlot = bookSlot;
		// $scope.saveSlot = saveSlot;
		//$scope.updateDate = updateDate;
		// Variables in $scope 
		$scope.statusMenuItems = AdminService.getStatusMenuItems();
		$scope.routes = AdminService.getRoutes();
		$scope.leftMenuItems = AdminService.getLeftMenuItems();
		$scope.serviceTypeList = AdminService.getServiceTypeList();
		$scope.priceUnits = AdminService.getPriceUnit();
		$scope.monthList = AdminService.getMonths();
		$scope.weekDayList = AdminService.getDays();
		$scope.cityList = [];
		$scope.imageUrls = [];
		$scope.pageIndex = $scope.routes.indexOf($state.current.name) || 0;
		$scope.hideAddOnSave = false;
		$scope.dummyHours = generateTimeSlots();
		$scope.startTimeShow = false;
		$scope.endTimeShow = false;

		// $scope.dummyDays = ["AllWeekday", "AllWeekend","Monday","Tuesday","Wednesday","Thusday", "Friday", "Saturday", "Sunday"]
		$scope.formData = {
			basicInfo: {},
			facilityAndTags: {facilities: [], associatedCategory: [], images: []},
			addOns: {addonList:[{saved: false}], savedAddonList: []},
			engineInfo: {rooms: true, seats: false, dedicated: true},
			configuration: {},
			timings: {scheduleSlots:[{"startTime":'', "endTime":''}],dates:{"slots":[]}, holidayList: [], selectedDaysList:[], slotObj:[]},
			policies: {},
			promotions: {}
		};
		$scope.tooltipStartTime = '';
		$scope.tooltipEndTime = '';
		$scope.tooltipNumOfSeats = '';
		$scope.tooltipPricePerHour = '';
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
