function HeaderCtrl($scope, UserService, $modal, $location) {
	
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
	          // the success callback will happen "outside" angular, 
	          // so wrap it in $scope.$apply to make angular aware of it.
	          $scope.$apply(function() {
	        	  UserService.deleteAccessToken();
		          $scope.$state.go("login"); 
	          });
	          
	        },
	        error: function(e) {
	          console.log(e);
	        }
	      });
	};
	
	
}

//HeaderCtrl.$inject = ['$scope', 'UserService', '$location'];

