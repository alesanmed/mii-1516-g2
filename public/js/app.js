'use strict';

// Declare app level module which depends on filters, and services

var app = angular.module('acme_supermarket', 
			[
				'ngRoute',
				'ngResource',
				'ngCookies',
				'acme_supermarket.controllers',
				'acme_supermarket.filters',
				'acme_supermarket.services',
				'acme_supermarket.directives',
				'pascalprecht.translate'
			]
	);

app.config(['$routeProvider', '$locationProvider', '$controllerProvider', '$httpProvider', '$translateProvider',
	function ($routeProvider, $locationProvider, $controllerProvider, $httpProvider, $translateProvider) {
		app.registerCtrl = $controllerProvider.register;

		var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
			// Initialize a new promise
			var deferred = $q.defer();

			// Make an AJAX call to check if the user is logged in
			$http.get('/islogged').then(function success(response){
				// Authenticated
				if (response.data.success)
					deferred.resolve();

				// Not Authenticated
				else {
					$rootScope.loginFailed = true;
					$rootScope.loginFailedMessage = 'You need to log in.';
					//$timeout(function(){deferred.reject();}, 0);
					deferred.reject();
					$location.url('/signin');
				}
			}, function error(response) {
				$rootScope.loginFailed = true;
				$rootScope.loginFailedMessage = 'You need to log in.';
				deferred.reject();
				$location.url('/signin');
			});

			return deferred.promise;
		};

		$httpProvider.interceptors.push(function($q, $location) {
			return {
				response: function(response) {
					return response;
				},
				responseError: function(response) {
					if (response.status === 401)
					$location.url('/signin');
					return $q.reject(response);
				}
			};
		});

		$routeProvider.
		when('/home', {
			templateUrl: 'views/public/home/home.html',
			controller: 'HomeCtrl'
		}).
		when('/signin', {
			templateUrl: 'views/public/signin/signin.html',
			controller: 'SigninCtrl'
		}).
		when('/signup', {
			templateUrl: 'views/public/signup/signup.html',
			controller: 'SignupCtrl'
		}).
		when('/customer/products', {
			templateUrl: 'views/customer/protected/protected.html',
			controller: 'ProtectedCtrl',
			resolve: {
				loggedin: checkLoggedin
			}
		}).
		when('/products', {
			templateUrl: 'views/products/products.html',
			controller: 'ProductListCtrl'
		}).
		otherwise({
			redirectTo: '/home'
		});

		$locationProvider.html5Mode(true);

		$translateProvider.useCookieStorage();
		$translateProvider.useUrlLoader('/api/lang');
		$translateProvider.preferredLanguage('en');
	}
]);

app.directive('localeSelector', 
	function($translate) {
		return {
			restrict: 'A',
			replace: true,
			templateUrl: 'views/public/localeselector/locale-selector.html',
			link: function(scope, elem, attrs) {
				if($translate.use() == undefined) {
					scope.locale = $translate.proposedLanguage()
				} else {
					scope.locale = $translate.use();
				}

				scope.setLocale = function() {
					$translate.use(scope.locale);
				};
			}
		};
	}
);

app.filter("htmlSafe", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    };
}]);