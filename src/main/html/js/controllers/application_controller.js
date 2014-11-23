function ApplicationCtrl($scope, $rootScope, $timeout, Accounts) {
	$scope.accountsToPositions = {};
	$rootScope.activeAccount = "";
	
	Accounts.all(function(accounts) {
		var i=0;
		accounts.forEach(function(a) {
			$scope.accountsToPositions[a.name] = i++;
		});
	});
	
	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
				
		switch(toState.name) {
			case "application.transactions": 				
				var top = 80 + (88 * $scope.accountsToPositions[toParams.accountName]);
				$timeout(function() { 
					$rootScope.activeAccount = toParams.accountName;
					$("#arrow").css("top", top + "px").css("opacity", "1"); 
				});
				break;
				
			default:
				$timeout(function() { 
					$rootScope.activeAccount = "";
					$("#arrow").css("top", "0px").css("opacity", "0");
				});
		}
		
		console.log(fromState.name + " -> " + toState.name);
		
	});
	
	

}