function AccountListCtrl($scope, Accounts) {
	$scope.accounts = Accounts.all();
	$scope.sparklines = Accounts.sparklines();
}

//AccountListCtrl.$inject = ['$scope', 'Accounts'];

