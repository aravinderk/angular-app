angular.module('AdminDirectiveModule', [])
	.directive('nwookDropdown', nwookDropdown)
	.directive('nwookFilterDropdown', nwookFilterDropdown)
	.directive('nwookCounter', nwookCounter)
	.directive('nwookInputDropdown', nwookInputDropdown);

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
				$scope.model = item.id;
			}
		},
		template: '<div class="dropdown nwook-dropdown">'+
					'<button class="dropdown-toggle" id="{{id}}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
						'<span>{{model}}</span>'+
						'<span class="caret"></span>'+
					'</button>'+
					'<ul class="dropdown-menu" aria-labelledby="{{id}}">'+
						'<li ng-repeat="item in items"><a href="#" ng-click="change($event, item)">{{item.name}}</a></li>'+
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
							'{{item.name}} <span class="tag-close" ng-click="removeTag(item)">X</span>'+
						'</span>'+	
						'<input type="text" ng-model="searchStr" />'+
						'<span class="caret"></span>'+
					'</div>'+
					'<ul class="dropdown-menu" aria-labelledby="{{id}}">'+
						'<li ng-repeat="item in items | filter: searchStr" ng-class="{\'disabled\': model.indexOf(item) > -1}"><a href="#" ng-click="change($event, item)">{{item.name}}</a></li>'+
					'</ul>'+
				'</div>'+
				'<input type="text" name="{{name}}" ng-model="model" hidden ng-required="{{required}}" />'
	};
}

function nwookCounter () {
	return {
		restrict: 'E',
		scope: {
			id: '@',
			name: '@',
			unit: '@',
			min: '=',
			max: '=',
			defaultVal: '=',
			step: '=',
			model: '='
		},
		controller: function ($scope) {
			$scope.model = $scope.defaultVal || $scope.min || 0;
			$scope.step = $scope.step || 1;
			$scope.change = function (increase) {
				if (increase && ($scope.model < $scope.max || $scope.max === undefined)) {
					$scope.model = $scope.model + $scope.step;
				} else if (!increase && ($scope.model > $scope.min || $scope.min === undefined)) {
					$scope.model = $scope.model - $scope.step;
				}
			}
		},
		template: '<div class="counterWrapper" id="{{id}}">'+
					'<div class="first" ng-click="change(flase)" ng-class="{\'disabled\': model == min}">-</div>'+
					'<div class="mid">'+
						'<span>{{model}}</span>'+
						'<span>&nbsp;{{unit}}</span>'+
					'</div>'+
					'<div class="last" ng-click="change(true)" ng-class="{\'disabled\': model == max}">+</div>'+
				'</div>'
	};
}

function nwookInputDropdown () {
	return {
		restrict: 'E',
		scope: {
			id: '@',
			inputName: '@',
			dropdownName: '@',
			inputModel: '=',
			dropdownModel: '=',
			dropdownItems: '=',
			required: '='
		},
		controller: function ($scope) {
			$scope.change = function (e, item) {
				e.preventDefault();
				$scope.dropdownModel = item;
			}
		},
		template: '<div class="nwook-input-dropdown">'+
					'<input type="text" name="{{inputName}}" ng-model="inputModel" />'+
					'<div class="dropdown nwook-dropdown">'+
						'<button class="dropdown-toggle" id="{{id}}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
							'<span>{{dropdownModel}}</span>'+
							'<span class="caret"></span>'+
						'</button>'+
						'<ul class="dropdown-menu" aria-labelledby="{{id}}">'+
							'<li ng-repeat="item in dropdownItems"><a href="#" ng-click="change($event, item)">{{item}}</a></li>'+
						'</ul>'+
					'</div>'+
					'<input type="text" name="{{dropdownName}}" ng-model="dropdownModel" hidden ng-required="{{required}}" />'+
				'</div>'
	};
}
