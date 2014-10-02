var app = angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.about',
  'ngBoilerplate.product',
  'ngBoilerplate.archive',
  'ui.router',
  'HTML5ModeURLs'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider, $locationProvider ) {
  $urlRouterProvider.otherwise( '/' );
})

.run( function run () {
})

.factory('productList', ['$http', '$q', function fetchProductList($http, $q) {

  var getData = function() {
    var deferred = $q.defer();
    
    $http.get('/WooAngular/build/assets/products.json').success(function(data) {
      deferred.resolve(data);
    });

    return deferred.promise;
  };

  return { getData: getData };
}])

.factory('getProducts', function($rootScope) {
  return $rootScope.products;
})

.controller( 'AppCtrl', ['$scope', '$location', '$http', '$rootScope', 'productList', function AppCtrl ( $scope, $location, $http, $rootScope, productList ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle;
    }
  });
}])

.filter('safeInput', ['$sce', function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
}]);


angular.module('HTML5ModeURLs', []).config(['$locationProvider', function($route) {
  $route.html5Mode(true).hashPrefix('!');
}]);
