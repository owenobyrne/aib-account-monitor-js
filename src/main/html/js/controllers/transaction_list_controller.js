function TransactionListCtrl($scope, $routeParams, $stateParams, Accounts, Transactions) {
	
	if ($stateParams.accountName != null) {
		$scope.transactions = Accounts.transactions({accountName: $stateParams.accountName});
		$scope.pendingtransactions = Accounts.pendingtransactions({accountName: $stateParams.accountName});
	} else {
		$scope.transactions = Transactions.transactions();
		$scope.pendingtransactions = Transactions.pendingtransactions();	
	}
	
	$scope.selectedTransactionId = "";
	
	$scope.sameDate = function(i) {
		if (i > 0 && $scope.transactions[i].transaction.transDate == $scope.transactions[i-1].transaction.transDate) {
			return true;
		} else {
			return false;
		}
	};
	
	$scope.editingTransaction = [];

	$scope.editTransaction = function(i) {
		$scope.editingTransaction[i] = true;
		console.log("editing " + $scope.transactions[i].transaction.narrative + "...");
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
		
	$scope.updateTransaction = function(i) {
		Transactions.update({transactionId: $scope.transactions[i].transaction.transId}, $scope.transactions[i]);
		$scope.editingTransaction[i] = false;
		console.log("updating " + $scope.transactions[i].transaction.transId + "...");
	};
	
	$scope.parseHashtags = function(comment) {
		if (!comment) { return ""; }
		return comment.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
			var tag = t.replace("#","%23");
			return t.link("/search?q="+tag);
		});
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
	
} 
	
//	   google.maps.event.addListener(map, "click", function (e) { 
//        document.form1.waypointLog.value = e.latLng.lat().toFixed(6) 
//        + ' |' + e.latLng.lng().toFixed(6); 
//	   }

 
//TransactionListCtrl.$inject = ['$scope', '$routeParams', '$stateParams', 'Accounts', 'Transactions'];
