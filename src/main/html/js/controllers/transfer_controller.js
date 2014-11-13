app.controller('TransferCtrl', function($scope, $mdDialog, accounts) {

	$scope.transfer = {
			fromAccount: accounts.from,
			toAccount: accounts.to,
			amount: "",
			comment: "",
			fromNarrative: "",
			toNarrative: ""
	};
		
	$scope.ok = function() {
		$mdDialog.hide($scope.transfer);
	};

	$scope.cancel = function() {
		$mdDialog.cancel('cancel');
	};

});