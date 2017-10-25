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
                {id:'Hyderabad',name:'Hyderabad'},
                {id:'Chennai',name:'Chennai'},
                {id:'Mumbai',name:'Mumbai'},
                {id:'Pune',name:'Pune'},
                {id:'bangalore',name:'bangalore'},
                {id:'Delhi',name:'Delhi'}
            ];
        },
        getStates: function () {
            return [
                {id:'Andhrapradesh',name:'Andhrapradesh'},
                {id:'Telangana',name:'Telangana'},
                {id:'Delhi',name:'Delhi'},
                {id:'karnataka',name:'karnataka'},
                {id:'Maharastra',name:'Maharastra'},
                {id:'Tamilnadu',name:'Tamilnadu'}
            ];
        },
        getCategoryList: function () {
            return [
                 {id:'category 1',name:'category 1'},
                 {id:'category 2',name:'category 2'},
                 {id:'category 3',name:'category 3'},
                 {id:'category 4',name:'category 4'}
            ]
        },
        getServiceType: function(){
            return[
                {id:'Free',name:'Free'},
                {id:'Paid',name:'Paid'}
            ]

        }
    }
    
    return service;
}
