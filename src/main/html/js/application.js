angular.module('onlinebanking', ['onlinebankingServices', 'ui.bootstrap', 'ngRoute', 'ui.router', 'ngDragDrop', 'directive.g+signin', 'LocalStorageModule'])
	.config(['$stateProvider', '$routeProvider', '$urlRouterProvider', 
	   function($stateProvider, $routeProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/login"); 
		 
		$stateProvider
			.state('login', {
				url: "/login",
				views: {
					// the @ signifies that this view is in the rootview rather than a 
					// child view of accounts. (after the @ is the state name)
					
					"applicationview@": {
						templateUrl: "templates/login.html",
						controller: LoginCtrl						
					}
				}
			})
			.state('application', {
				url: "/app", 
				views: {
					// the @ signifies that this view is in the rootview rather than a 
					// child view of accounts. (after the @ is the state name)
					
					"applicationview@": {
						templateUrl: "templates/application.html",
						controller: function(UserService) {
							// see if there's an accesstoken in localstorage and recover it.
							var at = UserService.getAccessToken();
							if (at != '') {
								// see if there's a profile...
								var profile = UserService.getProfile();
								
								UserService.setProfile(profile);
								UserService.setAccessToken(at);
									
							}
						}
					},
					"headerview@application": {
						templateUrl: "templates/header.html",
						controller: HeaderCtrl						
					},
					"accountview@application": {
						templateUrl: "templates/account_list.html",
						controller: AccountListCtrl						
					},
					"mainview@application": {
						templateUrl: "templates/transaction_list.html",
        				controller: TransactionListCtrl	
					},
					"rightview@application": { 
						templateUrl: "templates/regular_transaction_list.html",
						controller: RegularTransactionListCtrl
					}
				}
			})
			.state("application.transactions", {
				// as this is a nested state (application.blah) then the 
				// following URL has the parent state URL prepended 
				// i.e. /app/accounts/...
				url: "/accounts/:accountName/transactions",
				views: {
					"mainview@application": {
						templateUrl: "templates/transaction_list.html",
        				controller: TransactionListCtrl	
					}
				}
			})
			.state("application.tags", {
				// as this is a nested state (application.blah) then the 
				// following URL has the parent state URL prepended 
				// i.e. /app/accounts/...
				url: "/tags/:tag",
				views: {
					"mainview@application": {
						templateUrl: "templates/transaction_list.html",
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
	// called when the application starts up.
	.run(function ($rootScope, $state, $stateParams, localStorageService) {
		localStorageService.setPrefix('onlinebanking');
		// make the route/template state available to everything
	    $rootScope.$state = $state;
	    $rootScope.$stateParams = $stateParams;
	})
	.factory('UserService', function($http, localStorageService) {
		var accessToken = localStorageService.get("accessToken");
		var profile = localStorageService.get("profile");
		var nextPayDate = "";
		return {
      		setProfile : function(p) {
      			profile = p;
      			localStorageService.set("profile", p);
      			var nextPayDateCron = profile.amp.payday.substr(2);
      			var cron = later.parse.cron(nextPayDateCron);
      			nextPayDate = later.schedule(cron).next(1);
      			console.log(nextPayDate);
      			
      		},
      		getProfile : function() {
      			return profile;
      		},
      		getPayDate : function() {
      			return nextPayDate;
      		},
      		setAccessToken : function(at) {
      			accessToken = at;
      			localStorageService.set("accessToken", at);
      			$http.defaults.headers.common['X-GPlus-AccessToken'] = at;
      		},
      		getAccessToken : function() {
      			return accessToken;
      		},
      		deleteAccessToken : function() {
      			accessToken = "";
      			localStorageService.remove("accessToken");
      			profile = {};
      			localStorageService.remove("profile");
      			delete $http.defaults.headers.common['X-GPlus-AccessToken'];	
      		}
      		
  		};
	})
	.directive('sparkline', function( /* dependencies */) {
			var margin = {top: 3, right: 4, bottom: 3, left: 2},
			    width = 200 - margin.left - margin.right,
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
									.attr("stroke", function(d, i) { return scope.accountbalance > 0 ? "steelblue" : "red"; });
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
		    
		    
		  };
		})
		.filter('to_trusted_html', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);

