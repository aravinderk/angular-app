angular.module('AdminDirectiveModule', [])
	.directive('nwookDropdown', nwookDropdown)
	.directive('nwookFilterDropdown', nwookFilterDropdown)
	.directive('nwookCounter', nwookCounter)
	.directive('nwookInputDropdown', nwookInputDropdown)
	.directive('nwookSelectableButton', nwookSelectableButton);

function nwookDropdown () {
	return {
		restrict: 'E',
		scope: {
			items: '=',
			id: '@',
			name: '@',
			required: '=',
			model: '=',
			onchange: '&',
			defaultvalue : '@',
			disabled: '='
		},
		controller: function ($scope, $timeout) {
			$scope.selectedVal = $scope.defaultvalue || '';
			$scope.model = $scope.defaultvalue || '';
			$scope.change = function (e, item) {
				e.preventDefault();
				$scope.selectedVal = item.name
				$scope.model = item.id;
				$scope.onchange && $timeout($scope.onchange);
			},
			$scope.disableDropdown = function(){
				var disClass = 'disabled'
				if(!$scope.disabled){
					disClass = ''
				}
				return disClass
			}

		},
		template: '<div class="dropdown nwook-dropdown">'+
					'<button class="dropdown-toggle" type="button" id="{{id}}" ng-class="disableDropdown()" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
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
				if($scope.model.indexOf(item.id) <= -1){
					$scope.selectedItems.push(item);
				}
				updateModel(); // Update form data
				$scope.searchStr = ''; //Empty search string in input
				angular.element(e.target).closest('.nwook-dropdown').find('input[type=text]').focus(); // focus search input
			}

			$scope.handleInputChange = function (e) {
				var _this = angular.element(e.target);
				var dropdown_btn = _this.closest('.dropdown-toggle');
				var dropdown = _this.closest('.nwook-dropdown');
				if(e.keyCode == '40') {
					dropdown.find('ul li:first-child').find('a').focus();   // focus first element in dropdown when pressing down arrow in search input
				} else if($scope.searchStr && $scope.searchStr.trim() && !dropdown.hasClass('open')){
					dropdown_btn.click();
				} else if (!$scope.searchStr && dropdown.hasClass('open')) {
					dropdown_btn.click();
				}
			}

			$scope.handleKeydown = function (e) {
				if(e.keyCode == '8' && !$scope.searchStr && $scope.selectedItems.length > 0) {
					$scope.selectedItems.pop();  // removing selected tag when pressing back button.
					updateModel();
				}
			}

			$scope.removeTag = function (e, item) {   // To remove selected tag when clicking on close icon.
				var index = $scope.selectedItems.indexOf(item.id);
				$scope.selectedItems.splice(index, 1);
				updateModel();
				e.stopPropagation();
			}

			function updateModel () {	// Updating model
				var selectedItemIds = [];
				$scope.selectedItems.forEach(function(category){
					selectedItemIds.push(category.id);
				});
				$scope.model = selectedItemIds;
			}
		},
		template: '<div class="dropdown nwook-dropdown">'+
					'<div class="dropdown-toggle" id="{{id}}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
						'<span class="dropdown-tag" ng-repeat="item in selectedItems">'+
							'{{item.name}} <span class="tag-close" ng-click="removeTag($event, item)">X</span>'+
						'</span>'+	
						'<input type="text" ng-model="searchStr" ng-keyup="handleInputChange($event)" ng-keydown="handleKeydown($event)" />'+
						'<span class="caret"></span>'+
					'</div>'+
					'<ul class="dropdown-menu" aria-labelledby="{{id}}">'+
						'<li ng-repeat="item in items | filter: searchStr" ng-class="{\'disabled\': model.indexOf(item.id) > -1}"><a href="#" ng-click="change($event, item)">{{item.name}}</a></li>'+
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
			required: '=',
			onchange: '&'
		},
		controller: function ($scope, $timeout) {
			$scope.selectedVal = $scope.dropdownItems[$scope.dropdownModel] || '';
			$scope.change = function (e, item) {
				e.preventDefault();
				$scope.selectedVal = item.name
				$scope.dropdownModel = item.id;
				$scope.onchange && $timeout($scope.onchange);
			}
		},
		template: '<div class="nwook-input-dropdown">'+
					'<input type="text" name="{{inputName}}" ng-model="inputModel" ng-required="{{required}}" />'+
					'<div class="dropdown nwook-dropdown">'+
						'<button class="dropdown-toggle" id="{{id}}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
							'<span>{{selectedVal}}</span>'+
							'<span class="caret"></span>'+
						'</button>'+
						'<ul class="dropdown-menu" aria-labelledby="{{id}}">'+
							'<li ng-repeat="item in dropdownItems"><a href="#" ng-click="change($event, item)">{{item.name}}</a></li>'+
						'</ul>'+
					'</div>'+
					'<input type="text" name="{{dropdownName}}" ng-model="dropdownModel" hidden ng-required="{{required}}" />'+
				'</div>'
	};
}

function nwookSelectableButton () {
	return {
		restrict: 'E',
		scope: {
			id: '@',
			name: '@',
			model: '=',
			required: '=',
			onclick: '&',
			text: '@'
		},
		controller: function ($scope, $timeout) {
			$scope.model = $scope.model || false;
			$scope.change = function () {
				$scope.model = !$scope.model;
			}
		},
		template: '<div class="nwook-selectable-button" ng-class="{\'selected\': model}">'+
					'<button type="button" ng-click="change()">{{text}}</button>'+
					'<input type="checkbox" name="{{name}}" ng-model="model" hidden ng-required="{{required}}" />'+
				'</div>'
	};
}
