angular.module('onlinebanking', ['onlinebankingServices', 'ngAtmosphere', 'ui.state', 'ngDragDrop'])
	.config(['$stateProvider', '$routeProvider', '$urlRouterProvider', 
	   function($stateProvider, $routeProvider, $urlRouterProvider) {
		
		$stateProvider
			.state('application', {
				// this is an abstract state. It runs, then falls through to the next state that matches.
				url: "", // root route i.e. /
				//abstract: true,
				views: {
					// the @ signifies that this view is in the rootview rather than a 
					// child view of accounts. (after the @ is the state name)
					
					"topview@": {
						templateUrl: "/templates/account_list.html",
						controller: AccountListCtrl						
					},
					"mainview@": {
						template: 'Something here'	
					},
					"rightview@": { 
						templateUrl: "/templates/regular_transaction_list.html",
						controller: RegularTransactionListCtrl
					}
				}
			})
			.state("application.transactions", {
				url: "/accounts/:accountName/transactions",
				views: {
					"mainview@": {
						templateUrl: "/templates/transaction_list.html",
        				controller: TransactionListCtrl	
					}
				}
			}); 
	}])
	.config(['$httpProvider', function($httpProvider) {
		// set up the base HTTP provider to do CORS
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
	])
	
	
	.directive('sparkline', function( /* dependencies */) {
			var margin = {top: 3, right: 3, bottom: 3, left: 3},
			    width = 180 - margin.left - margin.right,
			    height = 20 - margin.top - margin.bottom;

			var x = d3.scale.linear()
			    .range([0, width]);
	
			var y = d3.scale.linear()
			    .range([height, 0]);
	
			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");
	
			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left");
	
			var line = d3.svg.line()
			    .x(function(d, i) { return x(i); })
			    .y(function(d) { return y(d); });
	
			return {
				restrict : 'E', // the directive can be invoked only by using <my-directive> tag in the template
				scope : { // attributes bound to the scope of the directive
					data : '=',
					accountbalance : "="
				},
						link : function(scope, element, attrs) {
							var svg = d3
									.select(element[0])
									.append("svg")
									.attr("width",
											width + margin.left + margin.right)
									.attr("height",
											height + margin.top + margin.bottom)
									.append("g").attr(
											"transform",
											"translate(" + margin.left + ","
													+ margin.top + ")");

							scope.$watch('data', function (data, oldData) {
								if (!data) { return; } // don't try to draw the graph until the data arrives.
								
								x.domain(d3.extent(data, function(d, i) { return i; }));
								y.domain(d3.extent(data, function(d) { return d; }));
							
								svg.append("path")
									.datum(data)
									.attr("class", "line")
									.attr("d", line)
									.attr("stroke", function(d, i) { console.log(scope.accountbalance); return scope.accountbalance > 0 ? "steelblue" : "red"; });
							});

						}
			};
		})
		.directive('ngFocus',function($parse,$timeout){
		  return function(scope,element,attrs){
		    var ngFocusGet = $parse(attrs.ngFocus);
		    var ngFocusSet = ngFocusGet.assign;
		    if (!ngFocusSet) {
		      throw Error("Non assignable expression");
		    }
		    
		    var digesting = false;
		    
		    var abortFocusing = false;
		    var unwatch = scope.$watch(attrs.ngFocus,function(newVal){
		      if(newVal){
		        $timeout(function(){
		          element[0].focus();  
		        },0)
		      }
		      else {
		        $timeout(function(){
		          element[0].blur();
		        },0);
		      }
		    });
		    
		    
		    element.bind("blur",function(){
		      
		      if(abortFocusing) return;
		      
		      $timeout(function(){
		        ngFocusSet(scope,false);
		      },0);
		      
		    });
		    
		    
		    var timerStarted = false;
		    var focusCount = 0;
		    
		    function startTimer(){
		      $timeout(function(){
		        timerStarted = false;
		        if(focusCount > 3){
		          unwatch();
		          abortFocusing = true;
		          throw new Error("Aborting : ngFocus cannot be assigned to the same variable with multiple elements");
		        }
		      },200);
		    }
		    
		    element.bind("focus",function(){
		      
		      if(abortFocusing) return;
		      
		      if(!timerStarted){
		        timerStarted = true;
		        focusCount = 0;
		        startTimer();
		      }
		      focusCount++;
		      
		      $timeout(function(){
		        ngFocusSet(scope,true);
		      },0);
		      
		    });
		  };
		});

