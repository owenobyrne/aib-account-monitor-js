app.controller("SelectRegularTransactionCtrl", function($scope, $mdDialog, RegularTransactions) {

	$scope.regularTransactionsForAccount = RegularTransactions.all();
	
	
	$scope.assignRT = function(i) {
		$mdDialog.hide($scope.regularTransactionsForAccount[i]);
	};

	$scope.closeDialog = function() {
		$mdDialog.cancel('cancel');
	};

});