function RegularTransactionListCtrl($scope, $routeParams, $stateParams, $q, UserService, Accounts, RegularTransactions, Reports, BankData) {
	$scope.editingRT = [];
	$scope.nextPayDay = UserService.getPayDate();
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
	
	
	var socket = new SockJS('/aibaccountmonitor/websockets/portfolio');
    var stompClient = Stomp.over(socket);
    stompClient.connect({}, function(frame) {
        console.log('Connected ');
        console.log(frame);
        
        stompClient.subscribe("/greeting", function(message) {
        	console.log(message.body);
        });
        
        
    }, function(error) {
        console.log("STOMP protocol error " + error);
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
				if (t.account == account.name) { rb = rb - t.amount; }
			});
			
			$scope.remainingBalance = rb;
		});
	});
	
	$scope.beforeNextPayDay = function(rt) {
		return new Date(rt.nextDate) < UserService.getPayDate();
	};
	
	$scope.refreshFromAIB = function() {
		BankData.run({action:"refreshDataFromAIB"});
	};
	
	
	$scope.dueDate = function(rt) {
		//moment().format();
		//var cron = later.parse.cron(rt.cron.substring(2));
		//var dueDate = later.schedule(cron).next(1);
		return moment(rt.nextDate).from(moment());
	};
	
}
 
//RegularTransactionListCtrl.$inject = ['$scope', '$routeParams', '$stateParams', '$q', 'UserService', 'Accounts', 'RegularTransactions', 'Reports', 'BankData', 'atmosphere'];