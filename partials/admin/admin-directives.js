angular.module('AdminDirectiveModule', [])
	.directive('nwookDropdown', nwookDropdown);
//AdminController.$inject = ['$scope', 'AdminService', '$state'];

function nwookDropdown () {
	return {
		restrict: 'E',
		scope: {
			items: '=',
			id: '@',
			name: '@',
			required: '=',
			model: '=',
			onchange: '&'
		},
		controller: function ($scope, $timeout) {
			$scope.selectedVal = '';
			$scope.change = function (e, item) {
				e.preventDefault();
				$scope.selectedVal = item.name
				$scope.model = item.id;
				$scope.onchange && $timeout($scope.onchange);
			}
		},
		template: '<div class="dropdown nwook-dropdown">'+
					'<button class="dropdown-toggle" id="{{id}}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
						'<span>{{ model && selectedVal}}</span>'+
						'<span class="caret"></span>'+
					'</button>'+
					'<ul class="dropdown-menu" aria-labelledby="{{id}}">'+
						'<li ng-repeat="item in items"><a href="#" ng-click="change($event, item)">{{item.name}}</a></li>'+
					'</ul>'+
				'</div>'+
				'<input type="text" name="{{name}}" ng-model="model" hidden ng-required="{{required}}" />'
	};
}
