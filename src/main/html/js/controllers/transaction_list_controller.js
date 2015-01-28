function TransactionListCtrl($scope, $routeParams, $stateParams, $mdDialog, Accounts, Transactions, RegularTransactions, UserService, Reports) {
	$scope.open = [];
	$scope.transactions = [];
	$scope.nextPayDay = UserService.getPayDate();
	
	$scope.regularTransactions = RegularTransactions.all();
	$scope.regularTransactionsForThisAccount = [];
	$scope.remainingBalance = 0;
	$scope.totalUpcoming = 0;
	$scope.percentUsed = 0;
	
	Reports.run({reportName:"regularTransactionsBeforeNextPayDay"}, function(rt) {
		$scope.upcomingRegularTransactions = rt;
		
		var accountToCheck = $stateParams.accountName ? $stateParams.accountName : "CURRENT-358";
		Accounts.details({accountName: accountToCheck}, function(account) { 
			$scope.billsAccount = account;
			
			rt.forEach(function(t) {
				if (t.account == account.name) { 
					$scope.regularTransactionsForThisAccount.push(t);
					$scope.totalUpcoming += t.amount;
				}
			});
			
			$scope.remainingBalance = account.balance - $scope.totalUpcoming;
			$scope.percentUsed = ($scope.totalUpcoming / account.balance) * 100;
		});
	});
	
	
	if ($stateParams.accountName != null) {
		Accounts.transactions({accountName: $stateParams.accountName}, function(trans) {
			var i=0;
			
			trans.forEach(function(t) {
				// if it's a transfer in, get the outbound transfer and push it onto the stack of transactions first.
				if ((t.transaction.transferTransId != null) &&  (!t.transaction.isDR)) {
					$scope.transactions.push({});
					console.log("need t0 get trans " + t.transaction.transferTransId);
					getTransferTransaction(t.transaction.transferTransId, i);
					i++;
				}
			
				$scope.transactions.push(t);
				i++;
			
				// if it's a transfer out, get the other side and push it onto the transactions stack afterwards.
				if ((t.transaction.transferTransId != null) &&  (t.transaction.isDR)) {
					$scope.transactions.push({});
					console.log("need t0 get trans " + t.transaction.transferTransId);
					getTransferTransaction(t.transaction.transferTransId, i);
					i++;
				}
			});
		});
		
		$scope.pendingtransactions = Accounts.pendingtransactions({accountName: $stateParams.accountName});
	} else if ($stateParams.tag != null) {
		$scope.transactions = Transactions.taggedtransactions({tag: $stateParams.tag});
		$scope.pendingtransactions = [];		
	} else {
		$scope.transactions = Transactions.transactions();
		$scope.pendingtransactions = Transactions.pendingtransactions();	
	}
	
	var getTransferTransaction = function(transId, i) {
		Transactions.get({transactionId: transId}, function(t) {
			t.injected = true;
			$scope.transactions[i] = t;
		});
	}
	
	$scope.selectedTransactionId = "";
	
	$scope.beforeNextPayDay = function(rt) {
		return new Date(rt.nextDate) < UserService.getPayDate();
	};
	
	$scope.isOpen = function(i) {
		return ($scope.open[i] == null ? false : true);
	};
	
	$scope.sameDate = function(i) {
		// only continue if the transactions array has been resolved.
		if ($scope.transactions.$resolved && i > 0 && $scope.transactions[i].transaction.transDate == $scope.transactions[i-1].transaction.transDate) {
			return true;
		} else {
			return false;
		}
	};
	
	$scope.editingTransaction = [];

	$scope.editTransaction = function(i) {
		$scope.editingTransaction[i] = true;
		scrollPage(2, 0, 50);
		console.log("editing " + $scope.transactions[i].transaction.narrative + "...");
	};
	
	scrollPage = function(scrollBy, sofar, until) {
		window.scrollBy(0,scrollBy);
		if (Math.abs(sofar) + Math.abs(scrollBy) < Math.abs(until)) {
			setTimeout('scrollPage(' + scrollBy + ', ' + (scrollBy + sofar) + ', ' + until + ')',3);
		}
	}
	
	$scope.updateTransaction = function(i) {
		Transactions.update({transactionId: $scope.transactions[i].transaction.transId}, $scope.transactions[i]);
		$scope.editingTransaction[i] = false;
		scrollPage(-5, 0, -50);
		console.log("updating " + $scope.transactions[i].transaction.transId + "...");
	};
	
	$scope.transType = function(transaction) {
		if (!$scope.transactions.$resolved) { return; }
		
		if (transaction.transaction.narrative.indexOf("VDP") > -1) {
			return "card";
		} else if (transaction.transaction.narrative.indexOf("VDC") > -1) {
			return "tap";
		} else if (transaction.transaction.narrative.indexOf("VDP") > -1) {
			return "card";
		} else if (transaction.transaction.amount == 0) {
			return "info";
		} else if (transaction.transaction.transferTransId != null) {
			if (transaction.transaction.isDR) {
				return "transfer-out";				
			} else {
				return "transfer-in";
			}
		} else if (transaction.transaction.narrative.indexOf("Realex Financial S") > -1) {
			return "salary";
		} else if (transaction.transaction.narrative.match(/500\d\d\d/)) {
			return "cheque";
		} else if (transaction.regularTransaction != null) {
			return "regular";
		} else if ((transaction.transaction.narrative.indexOf("VDA") > -1) || (transaction.transaction.narrative.indexOf("ATM") > -1)) {
			return "atm";
		} 
		
		return "";
	};
	
	$scope.moveMap = function(i) {
		$scope.selectedTransactionId = i;
		console.log($scope.transactions[i].transaction.gps_coords);
		var b = Base64.decodeToHex($scope.transactions[i].transaction.gps_coords);
		console.log(b);
		console.log($scope.convertHexToDouble(b.substr(18, 16)) + ", "+ $scope.convertHexToDouble(b.substr(34, 16)));
		
		if ($scope.convertHexToDouble(b.substr(18, 16)) == 0) {
			map.setZoom(9);
			map.panTo(new google.maps.LatLng(53.100620879214304, -6.23199462890625));
			
		} else {
			map.setZoom(14);
			// alter the latitude to compensate for the translucent overlay div.
			map.panTo(new google.maps.LatLng($scope.convertHexToDouble(b.substr(18, 16)) - 0.008, $scope.convertHexToDouble(b.substr(34, 16))));
				
		}
		//console.log(my_double);  // 293.03173828125
		//var gps = (new wkb.Factory()).parseWKB(buf);
		
		//console.log("map " + gps);
	};
	
	$scope.mapClickHandler = function(event) {
		console.log(event);
		$scope.$apply(function() {
			var gps = {lat: event.latLng.ob, lon: event.latLng.pb };
			Transactions.updateCoords(
				{ transactionId: $scope.transactions[$scope.selectedTransactionId].transaction.transId },
				gps
			);
		});
	};
	

	$scope.parseHashTagsAndURLs = function(comment) {
		if (!comment) { return ""; }
		
		comment = comment.replace(/(\b(?:(https?|ftp):\/\/)?((?:www\d{0,3}\.)?([a-z0-9.-]+\.(?:[a-z]{2,4}|museum|travel)(?:\/[^\/\s]+)*))\b)/i, function(t) {
			return t.link(t);
		});
		
		comment = comment.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
			var tag = t.replace("#","");
			return t.link("#/app/tags/"+tag);
		});
		
		return comment;
	};

	$scope.convertHexToDouble = function(hex) {
		var buffer = new ArrayBuffer(8);
		var bytes = new Uint8Array(buffer);
		var doubles = new Float64Array(buffer); 
		
		for (var i = 0; i < hex.length; i += 2) {
		    bytes[i/2] = parseInt("0x" + hex.substr(i, 2), 16);
		}

		return doubles[0];
	};
	
	$scope.markAsRegularTransaction = function($event, i) {
		
		var selectRegularTransactionDialog = $mdDialog.show({
		      targetEvent: $event,
		      templateUrl: 'templates/select_regular_transaction.html',
		      controller: 'SelectRegularTransactionCtrl',
		      resolve: { 
		    	  account: function () {
		            return $scope.transactions[i].transaction.account;
		    	  }
	      	}
	    });
		
		selectRegularTransactionDialog.then(function (regularTransaction) {
			Transactions.markAsRegularTransaction({transactionId: $scope.transactions[i].transaction.transId}, regularTransaction);
			console.log(regularTransaction);
	    }, function () {
	      console.log('Dialog dismissed at: ' + new Date());
	    });
		
		/*
		var selectRegularTransactionModal = $modal.open({
		      templateUrl: 'templates/select_regular_transaction.html',
		      controller: SelectRegularTransactionCtrl,
		      resolve: {
		          account: function () {
		            return $scope.transactions[i].transaction.account;
		          }
	          }
		     
		 });
		
		selectRegularTransactionModal.result.then(function (regularTransaction) {
			Transactions.markAsRegularTransaction({transactionId: $scope.transactions[i].transaction.transId}, regularTransaction);
			console.log(regularTransaction);
	    }, function () {
	      console.log('Modal dismissed at: ' + new Date());
	    });
	    
	    */
	};
	
} 
	
//	   google.maps.event.addListener(map, "click", function (e) { 
//        document.form1.waypointLog.value = e.latLng.lat().toFixed(6) 
//        + ' |' + e.latLng.lng().toFixed(6); 
//	   }

 
//TransactionListCtrl.$inject = ['$scope', '$routeParams', '$stateParams', 'Accounts', 'Transactions'];
