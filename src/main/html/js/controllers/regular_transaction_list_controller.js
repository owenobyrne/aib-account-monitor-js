function RegularTransactionListCtrl($scope, $routeParams, $stateParams, $q, UserService, Accounts, RegularTransactions, Reports, BankData, atmosphere) {
	$scope.editingRT = [];

	$scope.editRT = function(i) {
		$scope.editingRT[i] = true;
		console.log("editing " + $scope.regularTransactions[i].narrative + "...");
	};

	$scope.updateRT = function(i) {
		
		RegularTransactions.update({regularTransactionId: $scope.regularTransactions[i].id}, $scope.regularTransactions[i]);
		//$scope.regularTransactions[i].update();
		$scope.editingRT[i] = false;
		console.log("updating " + $scope.regularTransactions[i].id + "...");
	};
	
	var request = new $.atmosphere.AtmosphereRequest();
    request.transport = "websocket";
    request.url = "http://payb.in/aibaccountmonitor/websockets/aibam/transactions";
    request.contentType = "application/json";
    request.fallbackTransport = "polling";
    request.trackMessageLength = true;
    request.headers = {"X-GPlus-AccessToken": UserService.getAccessToken()};
    request.enableXDR = true;
    request.readResponsesHeaders = false;
	
	atmosphere.init(request);
	atmosphere.debug(true);
	atmosphere.on(undefined, function(data) {
		console.log(data.narrative);
		// need to use $apply() here as the event is happening outside Angular - in a XHR callback.
		$scope.$apply(function() {
			$scope.ws = data.narrative;
        });
	});
	
	$scope.regularTransactions = RegularTransactions.all();
	//$scope.upcomingRegularTransactions = Reports.run({reportName:"regularTransactionsBeforeNextPayDay"});
	$scope.remainingBalance = 0;
	
	Reports.run({reportName:"regularTransactionsBeforeNextPayDay"}, function(rt) {
		$scope.upcomingRegularTransactions = rt;
		
		Accounts.details({accountName: "CURRENT-358"}, function(account) { 
			$scope.billsAccount = account;
			var rb = account.balance;
			
			rt.forEach(function(t) {
				rb = rb - t.amount;
			});
			
			$scope.remainingBalance = rb;
		});
	});
	
	$scope.beforeNextPayDay = function(rt) {
		return rt.nextDate < "2013-09-20 06:00:00";
	};
	
	$scope.refreshFromAIB = function() {
		BankData.run({action:"refreshDataFromAIB"});
	};
	$scope.transfer = function() {
		Accounts.transfer({accountName:"OLD CASHSAVE-027", accountNameTo: "SAVINGS-275"}, {
			narrativeFrom: "testing api 2",
			narrativeTo: "testing api 2",
			amount: "4.00"
		});
	};	
	
	$scope.dueDate = function(rt) {
		//moment().format();
		var cron = later.parse.cron(rt.cron.substring(2));
		var dueDate = later.schedule(cron).next(1);
		return moment(dueDate).from(moment());
	};
	
}
 
//RegularTransactionListCtrl.$inject = ['$scope', '$routeParams', '$stateParams', '$q', 'UserService', 'Accounts', 'RegularTransactions', 'Reports', 'BankData', 'atmosphere'];