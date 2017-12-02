angular.module('AdminServiceModule', []).factory('AdminService', AdminService);

AdminService.$inject = ['$http'];

function AdminService($http){

    var service = {
        getStatusMenuItems: getStatusMenuItems,
        getRoutes: getRoutes,
        getLeftMenuItems: getLeftMenuItems,
        getCities: getCities,
        getStates: getStates,
        saveAsDraft: saveAsDraft,
        getAddressList: getAddressList,
        getPlaceDetails: getPlaceDetails,
        getAssociatedCategoryList: getAssociatedCategoryList,
        getServiceTypeList: getServiceTypeList,
        getPriceUnit: getPriceUnit,
        getMonths: getMonths,
        getDays: getDays,
        getDiscountUnit: getDiscountUnit,
        getAddOnList: getAddOnList
    }

    function getStatusMenuItems () {
        return [
            {title: 'Basic Info'},
			{title: 'Facility & Tags'},
			{title: 'Add-ons'},
			{title: 'Engine Info'},
			{title: 'Configuration'},
			{title: 'ITR'},
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

    function getLeftMenuItems () {
        return [
            {icon: '../../images/plus-sign.png', title: 'Add a space', helpText: 'Add a new space'},
            {icon: '../../images/wrench.png', title: 'Manage spaces', helpText: 'Edit and update space details'},
            {icon: '../../images/pause-btn.png', title: 'Activate/deactivate spaces', helpText: 'Temporarly start/pause listings'},
            {icon: '../../images/ProhibitionSign.png', title: 'Blacklisted spaces', helpText: 'Edit & update blocked spaces'},
            {icon: '../../images/Rupee-symbol.png', title: 'Pricing', helpText: 'View and change pricing'},
            {icon: '../../images/dollor-sign.png', title: 'Revenue by space', helpText: 'Veiw sales data by space'},
            {icon: '../../images/tag.png', title: 'Add tags by spaces', helpText: 'Associate facilities to a space'}
        ]
    }

    function getServiceTypeList () {
        return [
            {id: 'free', name: 'Free'},
            {id: 'paid', name: 'Paid'}
        ]
    }

    function getPriceUnit () {
        return [
            {id: 'unit', name: '/Unit'},
            {id: 'hour', name: '/Hour'}
        ]
    }
    function getAddOnList () {
        return [
            {id: 'water', name: 'Water'},
            {id: 'coffee', name: 'Coffee'}
        ]
    }
    
    function getDiscountUnit () {
        return [
            {id: 'Rs', name: '/Rs'},
            {id: 'USD', name: '/USD'}
        ]
    }
    
    function getMonths () {
        return [
            {id:'select', name: 'Select'},
            {id: 'jan', name: 'January'},
            {id: 'feb', name: 'Feb'},
            {id: 'mar', name: 'March'},
            {id: 'apr', name: 'April'},
            {id: 'may', name: 'May'},
            {id: 'jun', name: 'June'},
            {id: 'jul', name: 'July'},
            {id: 'aug', name: 'August'},
            {id: 'sep', name: 'September'},
            {id: 'oct', name: 'October'},
            {id: 'nov', name: 'November'},
            {id: 'dec', name: 'December'}
        ]
    }
    function getDays () {
        return [
            {id:'select', name: 'Select'},
            {id: 'mon', name:'Monday'},
            {id: 'tue', name:'Tuesday'},
            {id: 'wed', name:'Wednesday'},
            {id: 'thus', name:'Thusday'},
            {id: 'fri', name:'Friday'},
            {id: 'sat', name:'Saturday'},
            {id: 'sun', name:'Sunday'}
        ]
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
