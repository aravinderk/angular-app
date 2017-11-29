angular.module('nwookManager', ['ui.router', 'AdminModule'])

.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/admin/basic-info');
    
    $stateProvider
        .state('admin', {
            url: '/admin',
            templateUrl: './partials/admin/templates/admin.html',
            controller: 'AdminController'
        })
        .state('admin.basicInfo', {
            url: '/basic-info',
            templateUrl: './partials/admin/templates/basicInfo.html'
        })
        .state('admin.facilityTags', {
            url: '/facility-tags',
            templateUrl: './partials/admin/templates/facilityTags.html'
        })
        .state('admin.addons', {
            url: '/addons',
            templateUrl: './partials/admin/templates/addons.html'
        })
        .state('admin.engineInfo', {
            url: '/engine-info',
            templateUrl: './partials/admin/templates/engineInfo.html'
        })
        .state('admin.enableAddon', {
            url: '/enableAddon',
            templateUrl: './partials/admin/templates/enableAddon.html'
        })
        .state('admin.timings', {
            url: '/timings',
            templateUrl: './partials/admin/templates/timings.html'
        })
        .state('admin.policies', {
            url: '/policies',
            templateUrl: './partials/admin/templates/policies.html'
        })
        .state('admin.promotions', {
            url: '/promotions',
            templateUrl: './partials/admin/templates/promotions.html'
        })
        .state('admin.complete', {
            url: '/complete',
            templateUrl: './partials/admin/templates/complete.html'
        })
});
