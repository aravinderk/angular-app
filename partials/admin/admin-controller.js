angular.module('AdminControllerModule', []).controller('AdminController', AdminController);

AdminController.$inject = ['$scope', 'AdminService', '$state', '$timeout'];

function AdminController($scope, AdminService, $state, $timeout){
	
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

			$timeout(function(){
				$('#datetimepicker6').datetimepicker();
			},2000);
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

	// Functions related to Admin Addon Page end here 
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
	var firstClick = false;
	var prevDay;
	var showPopup;
	function bookSlot(event){
		if(showPopup){
			return;
		}
		var _this = $(event.target);
		var dayName = _this.closest('.hour').attr('day');
		var slotIndex = parseInt(_this.attr('slotIndex'));
		if(!firstClick){
			prevDay = dayName;
			firstClickNameId = slotIndex;
		}
		firstClick = firstClick ? false : true; 
		if(!firstClick){
			var secondClickNameId = slotIndex;
			if(prevDay == dayName){
				if(firstClickNameId > secondClickNameId){
					var thirdCup;
					thirdCup = secondClickNameId; 
					secondClickNameId = firstClickNameId;
					firstClickNameId = thirdCup;
				}
				for(var i = firstClickNameId; i <= secondClickNameId; i++){
					var elem = $('[name='+dayName+'_'+i+']');
					if(elem.hasClass('selected')){
						elem.removeClass('selected');
					}else{
						elem.addClass('selected');
						showPopup = true;
						$('.toolTip').show();
					} 
				}
				$scope.tooltipStartTime = $scope.dummyHours[firstClickNameId];
				$scope.tooltipEndTime = $scope.dummyHours[secondClickNameId+1];
				$scope.tooltipDayName = dayName;
				//mapScheduler(dayName, firstClickNameId, secondClickNameId);
			}else{
				alert("please select the end slot from same row")
			}
		}
		 
		console.log(dayName, firstClick)
	}

	function mapScheduler (){
		var scheduleData = [];
		var scheduleSlots = $scope.formData.timings.scheduleSlots;
		if(!scheduleSlots[$scope.tooltipDayName]) {
			scheduleSlots[$scope.tooltipDayName] = [];
		}
		scheduleSlots[$scope.tooltipDayName].push({
			startTime: $scope.tooltipStartTime,
			endTime: $scope.tooltipEndTime,
			numOfSeats: $scope.tooltipNumOfSeats,
			pricePerHour: $scope.tooltipPricePerHour
		})
		clearTooltipData();
		console.log($scope.formData.timings)
	}
	function saveSlot(){
		mapScheduler();
		showPopup = false;
		$('.toolTip').hide();
	}

	function clearTooltipData () {
		$scope.tooltipStartTime = '';
		$scope.tooltipEndTime = '';
		$scope.tooltipDayName = '';
	}
	// function updateDate(event) {
	// 	console.log(event);
	// }
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
		$scope.bookSlot = bookSlot;
		$scope.saveSlot = saveSlot;
		//$scope.updateDate = updateDate;
		// Variables in $scope 
		$scope.statusMenuItems = AdminService.getStatusMenuItems();
		$scope.routes = AdminService.getRoutes();
		$scope.leftMenuItems = AdminService.getLeftMenuItems();
		$scope.serviceTypeList = AdminService.getServiceTypeList();
		$scope.priceUnits = AdminService.getPriceUnit();
		$scope.cityList = [];
		$scope.imageUrls = [];
		$scope.pageIndex = $scope.routes.indexOf($state.current.name) || 0;
		$scope.hideAddOnSave = false;
		$scope.dummyHours = generateTimeSlots()
		$scope.dummyDays = ["AllWeekday", "AllWeekend","Monday","Tuesday","Wednesday","Thusday", "Friday", "Saturday", "Sunday"]
		$scope.formData = {
			basicInfo: {},
			facilityAndTags: {facilities: [], associatedCategory: [], images: []},
			addOns: {addonList:[{saved: false}], savedAddonList: []},
			engineInfo: {rooms: true, seats: false, dedicated: true},
			configuration: {},
			timings: {scheduleSlots:{},dates:{}},
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
