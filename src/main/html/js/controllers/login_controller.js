function LoginCtrl($scope, $location, Login, UserService) {
	
	$scope.signinCallback = function(authResult) {
		console.log(authResult);
		if (authResult['access_token']) {
			// there's a very annoying trailing null...
//			var strJSON = Base64.decode(authResult['id_token'].split(".")[1]).slice(0, -1);
//			var id_token = JSON.parse(strJSON);
//			console.log(id_token);

			var loginDetails = {"accessToken": authResult['access_token']};
			UserService.setAccessToken(authResult['access_token']);
			console.log(loginDetails);
			Login.login(loginDetails, function(profile) {
				UserService.setProfile(profile);
				$scope.$state.go("application");
				
			});
	
			// need to force a nextTick() 
			// http://stackoverflow.com/questions/17039998/angular-not-making-http-requests-immediately
			$scope.$apply();
			
//			gapi.client.load('plus', 'v1', function() {
//				var request = gapi.client.plus.people.get({
//					'userId' : 'me'
//				});
//				request.execute(function(resp) {
//					console.log(resp);
//				});
//			});

		} else if (authResult['error']) {
			// User has not authorized the G+ App!
		}
	};
}

//LoginCtrl.$inject = ['$scope', '$location', 'Login', 'UserService'];

