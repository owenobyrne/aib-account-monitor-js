angular.module('onlinebanking', ['onlinebankingServices', 'ngAtmosphere', 'ui.state']).
	config(['$stateProvider', '$routeProvider', '$urlRouterProvider', 
	   function($stateProvider, $routeProvider, $urlRouterProvider) {
		
		$stateProvider
			.state('accounts', {
				// this is an abstract state. It runs, then falls through to the next state that matches.
				url: "", // root route i.e. /
				abstract: true,
				views: {
					"accounts@": {
						templateUrl: "/resources/templates/account_list.html",
						controller: AccountListCtrl						
					},
					"regulartransactions@": { 
						// the @ signifies that this view is in the rootview rather than a 
						// child view of accounts. (after the @ is the state name)
						templateUrl: "/resources/templates/regular_transaction_list.html",
						controller: RegularTransactionListCtrl
					}
				}
			})
			.state('accounts.list', { 
				// because the parent state (accounts) is abstract, and this state is the 
				// empty url, it will also be run when you call /
				url: '', 
				template: 'Something here',
			})
			
			.state("accounts.transactions", {
				url: "/accounts/:accountName/transactions",
				views: {
					"": {
						templateUrl: "/resources/templates/transaction_list.html",
        				controller: TransactionListCtrl	
					}
				}
			}); 
	}]).
	config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
	]);

