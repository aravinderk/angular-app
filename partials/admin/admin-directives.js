angular.module('AdminDirectiveModule', [])
	.directive('nwookDropdown', nwookDropdown);

function nwookDropdown () {
	return {
		restrict: 'E',
		scope: {
			items: '=',
			id: '@',
			name: '@',
			required: '=',
			model: '='
		},
		controller: function ($scope) {
			$scope.change = function (e, item) {
				e.preventDefault();
				$scope.model = item;
			}
		},
		template: '<div class="dropdown nwook-dropdown">'+
					'<button class="dropdown-toggle" id="{{id}}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
						'<span>{{model}}</span>'+
						'<span class="caret"></span>'+
					'</button>'+
					'<ul class="dropdown-menu" aria-labelledby="{{id}}">'+
						'<li ng-repeat="item in items"><a href="#" ng-click="change($event, item)">{{item}}</a></li>'+
					'</ul>'+
				'</div>'+
				'<input type="text" name="{{name}}" ng-model="model" hidden ng-required="{{required}}" />'
	};
}
