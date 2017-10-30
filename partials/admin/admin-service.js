angular.module('AdminServiceModule', []).factory('AdminService', AdminService);

AdminService.$inject = ['$http'];

function AdminService($http){

    var service = {
        getStatusMenuItems: getStatusMenuItems,
        getRoutes: getRoutes,
        getCities: getCities,
        getStates: getStates,
        saveAsDraft: saveAsDraft,
        getAddressList: getAddressList,
        getPlaceDetails: getPlaceDetails,
        getAssociatedCategoryList: getAssociatedCategoryList
    }

    function getStatusMenuItems () {
        return [
            {title: 'Basic Info'},
			{title: 'Facility & Tags'},
			{title: 'Add-ons'},
			{title: 'Engine Info'},
			{title: 'Configuration'},
			{title: 'Timings'},
			{title: 'Policies'},
			{title: 'Promotions'},
			{title: 'Complete!'}
        ];
    }

    function getRoutes () {
        return [
            'admin.basicInfo',
            'admin.facilityTags',
            'admin.addons',
            'admin.engineInfo',
            'admin.configuration',
            'admin.timings',
            'admin.policies',
            'admin.promotions',
            'admin.complete'
        ];
    }

    function getCities () {
        return $http({
            method: 'GET',
            url: 'data/cities.json',
        }).then(function(res) {  // Success
            return  res.data;    
        }, function(response) { // Failure
            
        });
    }

    function getStates () {
        return $http({
            method: 'GET',
            url: 'data/states.json',
        }).then(function(res) {  // Success
            return  res.data;    
        }, function(response) { // Failure
            
        });
    }

    function getAssociatedCategoryList () {
        return $http({
            method: 'GET',
            url: 'data/categories.json',
        }).then(function(res) {  // Success
            return  res.data;    
        }, function(response) { // Failure
            
        });
    }

    function saveAsDraft (formData) {
        return $http({
            method: 'POST',
            url: '/someUrl',
            data: formData
        }).then(function(data) { // Success
            return  data;    
        }, function(response) { // Failure
            
        });
    }

    function getAddressList (searchStr) {
        return $http({
            method: 'GET',
            url: 'data/placesList.json',
            // url: GOOGLE_API_SEARCH_URL,
            params: {
                'input': searchStr,
                'types': 'geocode',
                'key': GOOGLE_API_KEY
            }
        }).then(function(res) { // Success
            var data = [];
            if(res && res.data && res.data.predictions) {
                res.data.predictions.forEach(function(item) {
                    data.push({
                        'name': item.description,
                        'id': item.place_id
                    });
                });
            }
            return data;    
        }, function(response) { // Failure
            console.log('failure', response);
        });
    }

    function getPlaceDetails (placeId) {
        return $http({
            method: 'GET',
            url: 'data/placeDetails.json',
            //url: GOOGLE_API_PLACE_DETAILS_URL,
            params: {
                'placeid': placeId,
                'key': GOOGLE_API_KEY
            }
        }).then(function(res) { // Success
            var data = {};
            if(res && res.data && res.data.result && res.data.result.geometry && res.data.result.geometry.location) {
                data = res.data.result.geometry.location;
            }
            return data;     
        }, function(response) { // Failure
            
        });
    }
    
    return service;
}
