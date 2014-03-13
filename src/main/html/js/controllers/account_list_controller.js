function AccountListCtrl($scope, Accounts) {
	
	$scope.accounts = Accounts.all();
	$scope.fromAccount = [];

	$scope.sparklines = Accounts.sparklines();
	
	$scope.fnfn = function(el) {
		console.log(el);
	};
	
	$scope.whatCanIAccept = function(index) {
		if ($scope.accounts[index].canTransferTo == true) {
			return ".canTransferFrom";
		} else {
			// can't transfer to this account - only accept a non-existent class.
			return ".cantAcceptTransfers";
		}
	};
	
	$scope.dropTransfer = function(event, ui) {
		// The dragged item is placed in the fromAccount array at the location 
		// it is dropped. .length-1 should be the dropped location.
		console.log("From " + $scope.fromAccount[$scope.fromAccount.length-1].name + 
				" to " + $scope.accounts[$scope.fromAccount.length-1].name);
				
		Accounts.transfer({
				accountName: $scope.fromAccount[$scope.fromAccount.length-1].name,
				accountNameTo: $scope.accounts[$scope.fromAccount.length-1].name
			}, {
				narrativeFrom: "testing api 2",
				narrativeTo: "testing api 2",
				amount: "4.00"
			}
		);
		
		$scope.fromAccount = [];

	};
	
	$scope.formatIBAN = function(iban) {
		if (!iban) { return ""; }
		
		return iban.substring(0, 4) + " " + 
		iban.substring(4, 8) + " " + 
		iban.substring(8, 12) + " " + 
		iban.substring(12, 16) + " " +
		iban.substring(16, 20) + " " + 
		iban.substring(20, 22); 
	};
	
	$scope.transfer = function() {
		Accounts.transfer({accountName:"OLD CASHSAVE-027", accountNameTo: "SAVINGS-275"}, {
			narrativeFrom: "testing api 2",
			narrativeTo: "testing api 2",
			amount: "4.00"
		});
	};	
}

//AccountListCtrl.$inject = ['$scope', 'Accounts'];

