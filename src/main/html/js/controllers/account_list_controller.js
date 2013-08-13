function AccountListCtrl($scope, Accounts) {
	$scope.accounts = Accounts.all();
	$scope.sparklines = Accounts.sparklines();
	
	$scope.formatIBAN = function(iban) {
		if (!iban) { return ""; }
		
		return iban.substring(0, 4) + " " + 
		iban.substring(4, 8) + " " + 
		iban.substring(8, 12) + " " + 
		iban.substring(12, 16) + " " +
		iban.substring(16, 20) + " " + 
		iban.substring(20, 22); 
	};
}

//AccountListCtrl.$inject = ['$scope', 'Accounts'];

