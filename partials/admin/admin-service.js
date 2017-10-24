angular.module('AdminServiceModule', []).factory('AdminService', AdminService);

function AdminService(){
    var service = {
        statusMenuItems: [
            {text: 'Basic Info'},
			{text: 'Facility & Tags'},
			{text: 'Add-ons'},
			{text: 'Engine Info'},
			{text: 'Configuration'},
			{text: 'Timings'},
			{text: 'Policies'},
			{text: 'Promotions'},
			{text: 'Complete'}
        ],
        leftMenuItems: [
            {icon: '../../images/plus-sign.png', title: 'Add a space', helpText: 'Add a new space'},
            {icon: '../../images/wrench.png', title: 'Manage spaces', helpText: 'Edit and update space details'},
            {icon: '../../images/pause-btn.png', title: 'Activate/deactivate spaces', helpText: 'Temporarly start/pause listings'},
            {icon: '../../images/ProhibitionSign.png', title: 'Blacklisted spaces', helpText: 'Edit & update blocked spaces'},
            {icon: '../../images/Rupee-symbol.png', title: 'Pricing', helpText: 'View and change pricing'},
            {icon: '../../images/dollor-sign.png', title: 'Revenue by space', helpText: 'Veiw sales data by space'},
            {icon: '../../images/tag.png', title: 'Add tags by spaces', helpText: 'Associate facilities to a space'}
        ],
        routes: [
            'admin.basicInfo',
            'admin.facilityTags',
            'admin.addons',
            'admin.engineInfo',
            'admin.configuration',
            'admin.timings',
            'admin.policies',
            'admin.promotions',
            'admin.complete'
        ],
        getCities: function () {
            return [
                'Hyderabad',
                'Chennai',
                'Mumbai',
                'Pune',
                'bangalore',
                'Delhi'
            ];
        },
        getStates: function () {
            return [
                'Andhrapradesh',
                'Telangana',
                'Delhi',
                'karnataka',
                'Maharastra',
                'Tamilnadu'
            ];
        }
    }
    
    return service;
}
