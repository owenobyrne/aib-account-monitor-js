function TransactionListCtrl($scope, $routeParams, $stateParams, Accounts, Transactions) {
	if ($stateParams.accountName != null) {
		$scope.transactions = Accounts.transactions({accountName: $stateParams.accountName});
		$scope.pendingtransactions = Accounts.pendingtransactions({accountName: $stateParams.accountName});
	} else {
		$scope.transactions = Transactions.transactions();
		$scope.pendingtransactions = Transactions.pendingtransactions();	
	}
	
	$scope.sameDate = function(i) {
		if (i > 0 && $scope.transactions[i].transaction.transDate == $scope.transactions[i-1].transaction.transDate) {
			return true;
		} else {
			return false;
		}
	};
	
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
	
//	   google.maps.event.addListener(map, "click", function (e) { 
//        document.form1.waypointLog.value = e.latLng.lat().toFixed(6) 
//        + ' |' + e.latLng.lng().toFixed(6); 
//	   }

 
//TransactionListCtrl.$inject = ['$scope', '$routeParams', '$stateParams', 'Accounts', 'Transactions'];
