var TransferCtrl = function($scope, $modalInstance, accounts) {

	$scope.transfer = {
			fromAccount: accounts.from,
			toAccount: accounts.to,
			amount: "",
			comment: "",
			fromNarrative: "",
			toNarrative: ""
	};
		
	$scope.ok = function() {
		$modalInstance.close($scope.transfer);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

};