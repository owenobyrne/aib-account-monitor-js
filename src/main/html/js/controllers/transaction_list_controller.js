function TransactionListCtrl($scope, $routeParams, $stateParams, Accounts, Transactions) {
	$scope.transactions = Accounts.transactions({accountName: $stateParams.accountName});
	$scope.pendingtransactions = Accounts.pendingtransactions({accountName: $stateParams.accountName});
	
	$scope.editingTransaction = [];

	$scope.editTransaction = function(i) {
		$scope.editingTransaction[i] = true;
		console.log("editing " + $scope.transactions[i].transaction.narrative + "...");
	};

	$scope.updateTransaction = function(i) {
		Transactions.update({transactionId: $scope.transactions[i].transaction.transId}, $scope.transactions[i]);
		$scope.editingTransaction[i] = false;
		console.log("updating " + $scope.transactions[i].transaction.transId + "...");
	};
	
	$scope.parseHashtags = function(comment) {
		if (!comment) { return ""; }
		return comment.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
			var tag = t.replace("#","%23");
			return t.link("/search?q="+tag);
		});
	};
}
 
//TransactionListCtrl.$inject = ['$scope', '$routeParams', '$stateParams', 'Accounts', 'Transactions'];
