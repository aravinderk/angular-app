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
			if($scope.pageIndex === 3){
				$scope.packageConfigEnable = true;
				$scope.enableAdon = false
				$scope.dedicatedSeatEnable = false;
			}
			if($scope.pageIndex == 4){
				if(!$scope.dedicatedSeatEnable){
					$scope.packageConfigEnable = false;
					if(!$scope.enableAdon){
						$scope.enableAdon = true;
					}else{
						$scope.enableAdon = false;
						$scope.dedicatedSeatEnable = true;
					}
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
			if(trans.$to().name == 'admin.timings'){
				$scope.packageConfigEnable = true;
				$scope.enableAdon = false
				$scope.dedicatedSeatEnable = false;
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
	function createAddon(addonType, index){
		var list = getAddonList(addonType, index)
		list.push({saved: false})
		$scope.hideAddOnSave = false;
	}
	function getAddonList (addOnType, index){
		var list = $scope.formData.addOns.addonList
		if(addOnType == 'configAddOn'){
			list = $scope.formData.configuration.packageConfigList[index].addonList
		}
		console.log(list)
		return list;
	}
	function saveAddOn(addonType, index){
		
		$scope.spaceForm.$submitted = true;
		var list = getAddonList(addonType, index)
		if($scope.spaceForm.$valid){
			angular.forEach(list,function(item, index){
				item['saved'] = true;
			})
			$scope.spaceForm.$submitted = false;
			if(addonType  == 'configAddOn'){
				list.hideAddOnSave = false
			}else{
				$scope.hideAddOnSave = false
			}
			$scope.spaceForm.$pristine = true;
		}
		
	}
	function deleteAddOn(addOn, addonType, index){
		var list = getAddonList(addonType, index)
		angular.forEach(list, function(item, index){
			if(item.$$hashKey == addOn.$$hashKey){
				list.splice(index, 1)
			}
		})
		if(list.length == 0){
			list.push({saved: false})
			$scope.spaceForm.$submitted = false;
			if(addonType  == 'configAddOn'){
				list.hideAddOnSave = false
			}else{
				$scope.hideAddOnSave = false
			}
			
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
	function selectSlot(slotTime, slotType, page) {
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
			var updateObj = {};
			if(page == 'summary'){
				updateObj = $scope.editScope.slots
			}else{
				updateObj = $scope.formData.timings.dates.slots
			}
			updateObj.push(slotObj);
			$scope.formData.timings.startTime = undefined;
			$scope.formData.timings.endTime = undefined;
		}
		console.log($scope.formData.timings.dates)
	}
	
	function saveMonthSlot(params) {
		if(!validateTimingsSlots()){
			return false;
		}
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
	function deleteSlot(slot, page){
		var deleteObj;
		if(page == 'summary'){
			deleteObj = $scope.editScope.slots
		}else{
			deleteObj = $scope.formData.timings.dates.slots
		}
		angular.forEach(deleteObj, function(item, index){
			if(item.$$hashKey == slot.$$hashKey){
				deleteObj.splice(index, 1)
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
	function validateTimingsSlots (){
		var isValid = true;
		$scope.timingError.month = false;
		$scope.timingError.day = false;
		$scope.timingError.slots=false;
		$scope.timingError.noOfSlots = false;
		$scope.timingError.price = false;
		if($scope.formData.timings.dates.month == '' || $scope.formData.timings.dates.month == 'select'){
			isValid = false;
			$scope.timingError.month = true;
		}
		// if($scope.formData.timings.holidayList.length == 0){
		// 	isValid = false;
		// }
		if($scope.formData.timings.selectedDaysList.length == 0){
			isValid = false;
			$scope.timingError.day = true;
		}
		if($scope.formData.timings.dates.slots.length == 0){
			isValid = false;
			$scope.timingError.slots=true;
		}
		if($scope.formData.timings.noOfSlots == undefined || $scope.formData.timings.noOfSlots == ''){
			isValid = false;
			$scope.timingError.noOfSlots = true
		}
		if($scope.formData.timings.price == undefined || $scope.formData.timings.price == ''){
			isValid = false;
			$scope.timingError.price = true
		}
		return isValid;
	}
	function createAnotherPackage(params) {
		$scope.formData.configuration.packageConfigList.push({selectAddOn: [], addonList:[{saved: false}]})
	}	
	function createAnotherConfig (){
		$scope.formData.configuration.dedicatedSeatConfig.push({
						selectAddOn: []
					})
	}
	function editSummary(params) {
		if(params.slots == undefined){
			params.slots = []
		}
		if(params.scheduleSlots ==  undefined){
			params.scheduleSlots = [{"startTime":'', "endTime":''}];
		}
		$scope.editScope = params 
	}
	function deleteDayInSummary(day){
		var index = $scope.editScope.days.indexOf(day)
		$scope.editScope.days.splice(index, 1)
	}
	$scope.$watch('editScope.selectedDays', function(newVal, oldVal){
		if ($scope.editScope.days != undefined && newVal !== undefined && newVal !== oldVal && $scope.editScope.days.indexOf(newVal) <= -1) {
			$scope.editScope.days.push(newVal)
		}
	});
	$scope.$watch('formData.timings.days', function(newVal, oldVal){
		if(newVal == 'monsat'){
			$scope.formData.timings.selectedDaysList = []
			$scope.formData.timings.selectedDaysList = [
				'mon',
				'tue',
				'wed',
				'thus',
				'fri',
				'sat',
				'sun'			]
		}
	})
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
		if(newVal != 'select' && newVal !== undefined && $scope.formData.timings.selectedDaysList.indexOf(newVal) == -1 && newVal !== 'monsat')
		$scope.formData.timings.selectedDaysList.push(newVal);
	})
	$scope.$watch('formData.engineInfo.byTheHour', function(newVal, oldVal){
		if(newVal){
			$scope.formData.engineInfo.dedicated = false
			$scope.formData.engineInfo.packages = false
		}
	})
	$scope.$watch('formData.engineInfo.dedicated', function(newVal, oldVal){
		if(newVal){
			$scope.formData.engineInfo.byTheHour = false
			$scope.formData.engineInfo.packages = false
		}
	})
	$scope.$watch('formData.engineInfo.packages', function(newVal, oldVal){
		if(newVal){
			$scope.formData.engineInfo.dedicated = false
			$scope.formData.engineInfo.byTheHour = false
		}
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
		$scope.createAnotherPackage = createAnotherPackage;
		$scope.createAnotherConfig = createAnotherConfig;
		$scope.editSummary = editSummary;
		$scope.deleteDayInSummary = deleteDayInSummary
		// $scope.bookSlot = bookSlot;
		// $scope.saveSlot = saveSlot;
		//$scope.updateDate = updateDate;
		// Variables in $scope 
		$scope.statusMenuItems = AdminService.getStatusMenuItems();
		$scope.routes = AdminService.getRoutes();
		$scope.leftMenuItems = AdminService.getLeftMenuItems();
		$scope.serviceTypeList = AdminService.getServiceTypeList();
		$scope.priceUnits = AdminService.getPriceUnit();
		$scope.discountUnit = AdminService.getDiscountUnit();
		$scope.monthList = AdminService.getMonths();
		$scope.weekDayList = AdminService.getDays();
		$scope.selectAddOnList = AdminService.getAddOnList()
		$scope.getAssetList = AdminService.getAssestStatus()
		$scope.editScope = {scheduleSlots:[{"startTime":'', "endTime":''}],slots:[]};
		$scope.cityList = [];
		$scope.imageUrls = [];
		$scope.pageIndex = $scope.routes.indexOf($state.current.name) || 0;
		$scope.hideAddOnSave = false;
		$scope.dummyHours = generateTimeSlots();
		$scope.startTimeShow = false;
		$scope.endTimeShow = false;
		$scope.packageConfigEnable = true;
		$scope.enableAdon = false;
		$scope.dedicatedSeatEnable = false;
		$scope.timingError = {
		};

		// $scope.dummyDays = ["AllWeekday", "AllWeekend","Monday","Tuesday","Wednesday","Thusday", "Friday", "Saturday", "Sunday"]
		$scope.formData = {
			basicInfo: {},
			facilityAndTags: {facilities: [], associatedCategory: [], images: []},
			addOns: {addonList:[{saved: false}], savedAddonList: []},
			engineInfo: {
				rooms: true, 
				seats: false, 
				dedicated: true,
				byTheHour: true,
				dedicated: false,
				packages: false
			},
			configuration: {
				packageConfigList:[{
					selectAddOn: [], 
					addonList:[{saved: false}]
				}], 
				dedicatedSeatConfig:[{
						selectAddOn: []
				}],
				enableSpaceAsAdon:{

				}
			},
			timings: {scheduleSlots:[{"startTime":'', "endTime":''}],dates:{"slots":[]}, holidayList: [], selectedDaysList:[], slotObj:[]},
			policies: {},
			promotions: {},
			timingUpdate : $scope.getAssetList
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
