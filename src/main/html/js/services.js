var serviceEndpoint = "http://payb.in/aibaccountmonitor/api";

angular.module('onlinebankingServices', ['ngResource'])
    .factory('Accounts', function($resource){
    	return $resource(serviceEndpoint + '/accounts/:sparkline:accountName/:transactionType/:accountNameTo', {}, {
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
    		transfer: {
    			method:'POST', 
    			params: {
    				accountName:"@accountName", 
    				transactionType:"transferto", 
    				accountNameTo:"@accountNameTo"
    				}, 
    			isArray:false
    		},
    		pendingtransactions: {
    			method:'GET', 
    			params: {accountName:"@accountName", transactionType:"pending"}, 
    			isArray:true
    		}

    		
    	});
    })
    .factory('RegularTransactions', function($resource){
		return $resource(serviceEndpoint + '/regulartransactions/:regularTransactionId', {}, {
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
		return $resource(serviceEndpoint + '/transactions/:transactionId:transactionType/:action', {}, {
			update: {
				method:'PUT',
				params: {transactionId:"@transactionId"}
			},
			updateCoords: {
				method:'PUT',
				params: {transactionId:"@transactionId", action: "coords"}
			},
			transactions: {
    			method:'GET', 
    			params: {transactionType:"posted"}, 
    			isArray:true
    		},
    		pendingtransactions: {
    			method:'GET', 
    			params: {transactionType:"pending"}, 
    			isArray:true
    		}
		});
    })
    .factory('Reports', function($resource){
		return $resource(serviceEndpoint + '/reports/:reportName', {}, {
			run: {
				method:'GET', 
				isArray:true
			}
		});
    })
    .factory('BankData', function($resource){
		return $resource(serviceEndpoint + '/bankdata/:action', {}, {
			run: {
				method:'GET', 
				isArray:true
			}
		});
    })
    .factory('Login', function($resource){
		return $resource(serviceEndpoint + '/login', {}, {
			login: {
				method:'POST', 
				isArray:false
			}
		});
    });