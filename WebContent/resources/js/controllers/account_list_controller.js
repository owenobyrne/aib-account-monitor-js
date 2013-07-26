function AccountListCtrl($scope, Accounts) {
	$scope.accounts = Accounts.all();
}

//AccountListCtrl.$inject = ['$scope', 'Accounts'];

