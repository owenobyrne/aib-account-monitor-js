var SelectRegularTransactionCtrl = function($scope, $modalInstance, RegularTransactions) {

	$scope.regularTransactionsForAccount = RegularTransactions.all();
	
	
	$scope.assignRT = function(i) {
		$modalInstance.close($scope.regularTransactionsForAccount[i]);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

};