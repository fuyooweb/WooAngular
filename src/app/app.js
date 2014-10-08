var app = angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.about',
  'ngBoilerplate.product',
  'ngBoilerplate.archive',
  'ui.router',
  'HTML5ModeURLs',
  'ui.bootstrap'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider, $locationProvider ) {
  $urlRouterProvider.otherwise( '/' );
})

.run(function run() {
  
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

.factory('isLoggedIn', ['$http', '$q', function isLoggedIn($http, $q) {

  var getData = function() {
    var deferred = $q.defer();
    
    $http.get('/WooAngular/build/wp/wp-admin/admin-ajax.php?action=isloggedin').success(function(data) {
      deferred.resolve(data);
    });

    return deferred.promise;
  };

  return { getData: getData };
}])

.factory('getCart', ['$http', '$q', function getCart($http, $q) {

  var getData = function() {
    var deferred = $q.defer();
    
    $http.get('/WooAngular/build/wp/wp-admin/admin-ajax.php?action=getcart').success(function(data) {
      deferred.resolve(data);
    });

    return deferred.promise;
  };

  return { getData: getData };
}])

.controller( 'AppCtrl', ['$scope', '$location', '$http', 'productList', 'isLoggedIn', '$timeout', 'getCart', function AppCtrl ( $scope, $location, $http, productList, isLoggedIn, $timeout, getCart ) {

  $scope.loaded = false;

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle;
    }
  });

  $scope.addToCart = function(product, variation) {
    var data = {
      action: 'addtocart',
      product_id: product.id,
      variation_id: variation
    };

    for (var i = 0; i < product.variations.length; i++) {
      if (product.variations[i].id == variation) {
        data.variation_name = product.variations[i].attributes[0].name;
        data.variation_value = product.variations[i].attributes[0].option;
      }
    }

    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $http({
      method: 'POST',
      url: '/WooAngular/build/wp/wp-admin/admin-ajax.php',
      params: data
    }).then(function(response) {
      getCart.getData().then(function(result) {
        $scope.user.cart = result;
        console.log($scope.user);
      });
    });
  };

  $scope.submitLogin = function() {
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $http({
      method: 'POST',
      url: '/WooAngular/build/wp/wp-admin/admin-ajax.php',
      params: {
        action: 'login',
        log: $scope.log,
        pwd: $scope.pwd,
        rememberme: $scope.rememberme
      }
    }).then(function(response) {
      if (angular.isDefined(response.data.id)) {
        $scope.user = response.data;
      }
    });
  };

  $scope.logout = function() {
    delete $scope.user;
    $http.get('/WooAngular/build/wp/wp-admin/admin-ajax.php?action=logout');
  };

  // Check Auth post-render
  $timeout(function() {
    var promise = isLoggedIn.getData();
    promise.then(function(result) {
      $scope.user = result;
      $scope.loaded = true;
    });
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
