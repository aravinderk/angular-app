angular.module('AdminDirectiveModule', [])
	.directive('nwookDropdown', nwookDropdown)
	.directive('nwookFilterDropdown', nwookFilterDropdown);

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
