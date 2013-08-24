function HeaderCtrl($scope, UserService, $location) {
	
	$scope.profile = UserService.getProfile();
	
	$scope.disconnect = function() {
		// Revoke the access token.
	      $.ajax({
	        type: 'GET',
	        url: 'https://accounts.google.com/o/oauth2/revoke?token=' +
	            UserService.getAccessToken(),
	        async: false,
	        contentType: 'application/json',
	        dataType: 'jsonp',
	        success: function(result) {
	          console.log('revoke response: ' + result);
	          UserService.deleteAccessToken();
	          $scope.$state.go("login");
	       
	          // need to force a nextTick() 
	          // http://stackoverflow.com/questions/17039998/angular-not-making-http-requests-immediately
	          $scope.$apply();
				
	          
	        },
	        error: function(e) {
	          console.log(e);
	        }
	      });
	};
	
	
}

//HeaderCtrl.$inject = ['$scope', 'UserService', '$location'];

