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

.factory('API', ['$http', '$q', function APIRequest($http, $q) {
  var ajaxUrl = '/WooAngular/build/wp/wp-admin/admin-ajax.php';

  return {
    getProductList: function() {
      var deferred = $q.defer();

      $http.get('/WooAngular/build/assets/products.json').success(function(data) {
        deferred.resolve(data);
      });

      return deferred.promise;
    },

    isLoggedIn: function() {
      var deferred = $q.defer();
      
      $http.get(ajaxUrl + '?action=isloggedin').success(function(data) {
        deferred.resolve(data);
      });

      return deferred.promise;
    },

    getCart: function() {
      var deferred = $q.defer();
      
      $http.get(ajaxUrl + '?action=getcart').success(function(data) {
        deferred.resolve(data);
      });

      return deferred.promise;
    },

    login: function(log, pwd, rememberme) {
      var deferred = $q.defer();

      

      return deferred.promise;
    }
  };
}])

.controller( 'AppCtrl', ['$scope', '$location', '$http', '$timeout', 'API', function AppCtrl ( $scope, $location, $http, $timeout, API ) {

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
      API.getCart().then(function(result) {
        if (!angular.isDefined($scope.user)) {
          $scope.user = {};
        }
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
        $scope.log = '';
        $scope.pwd = '';
      }
    });
  };

  $scope.logout = function() {
    delete $scope.user;
    $http.get('/WooAngular/build/wp/wp-admin/admin-ajax.php?action=logout');
  };

  // Check Auth post-render
  $timeout(function() {
    var promise = API.isLoggedIn();
    promise.then(function(result) {

      if (!angular.isDefined('error')) {
        $scope.user = result;
      }

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
