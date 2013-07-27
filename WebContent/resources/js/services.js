var serviceEndpoint = "http://payb.in/";

angular.module('onlinebankingServices', ['ngResource'])
    .factory('Accounts', function($resource){
    	return $resource(serviceEndpoint + 'api/accounts/:sparkline:accountName/:transactionType', {}, {
    		all: {
    			method:'GET', 
    			params: {accountName:""}, 
    			isArray:true
    		},
    		sparklines: {
    			method:'GET', 
    			params: {sparkline:"sparklines"}, 
    			isArray:false
    		},
    		details: {
    			method:'GET', 
    			isArray:false
    		},
    		transactions: {
    			method:'GET', 
    			params: {accountName:"@accountName", transactionType:"transactions"}, 
    			isArray:true
    		},
    		pendingtransactions: {
    			method:'GET', 
    			params: {accountName:"@accountName", transactionType:"pending"}, 
    			isArray:true
    		}

    		
    	});
    })
    .factory('RegularTransactions', function($resource){
		return $resource(serviceEndpoint + 'api/regulartransactions/:regularTransactionId', {}, {
			all: {
				method:'GET', 
				params: {regularTransactionId:""}, 
				isArray:true
			},
			update: {
				method:'PUT',
				params: {regularTransactionId:"@regularTransactionId"}
			}
		});
    })
    .factory('Transactions', function($resource){
		return $resource(serviceEndpoint + 'api/transactions/:transactionId', {}, {
			update: {
				method:'PUT',
				params: {transactionId:"@transactionId"}
			}
		});
    })
    .factory('Reports', function($resource){
		return $resource(serviceEndpoint + 'api/reports/:reportName', {}, {
			run: {
				method:'GET', 
				isArray:true
			}
		});
    })
    .factory('BankData', function($resource){
		return $resource(serviceEndpoint + 'api/bankdata/:action', {}, {
			run: {
				method:'GET', 
				isArray:true
			}
		});
    });