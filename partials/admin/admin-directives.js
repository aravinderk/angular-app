angular.module('AdminDirectiveModule', [])
	.directive('nwookDropdown', nwookDropdown)
	.directive('nwookFilterDropdown', nwookFilterDropdown)

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

function nwookFilterDropdown () {
	return {
		restrict: 'E',
		scope: {
			items: '=',
			id: '@',
			name: '@',
			required: '=',
			model: '=model'
		},
		controller: function ($scope) {
			$scope.selectedItems = [];
			$scope.change = function (e, item) {
				e.preventDefault();
				if($scope.model.indexOf(item) <= -1){
					$scope.selectedItems.push(item);
				}
				$scope.model = $scope.selectedItems;
			}

			$scope.removeTag = function (item) {
				var index = $scope.selectedItems.indexOf(item);
				$scope.selectedItems.splice(index, 1);
				$scope.model = $scope.selectedItems;
			}
		},
		template: '<div class="dropdown nwook-dropdown">'+
					'<div class="dropdown-toggle" id="{{id}}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
						'<span class="dropdown-tag" ng-repeat="item in model">'+
							'{{item}} <span class="tag-close" ng-click="removeTag(item)">X</span>'+
						'</span>'+	
						'<input type="text" ng-model="searchStr" />'+
						'<span class="caret"></span>'+
					'</div>'+
					'<ul class="dropdown-menu" aria-labelledby="{{id}}">'+
						'<li ng-repeat="item in items | filter: searchStr" ng-class="{\'disabled\': model.indexOf(item) > -1}"><a href="#" ng-click="change($event, item)">{{item}}</a></li>'+
					'</ul>'+
				'</div>'+
				'<input type="text" name="{{name}}" ng-model="model" hidden ng-required="{{required}}" />'
	};
}
