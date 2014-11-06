var app = angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.about',
  'ngBoilerplate.product',
  'ngBoilerplate.archive',
  'ngBoilerplate.page',
  'ui.router',
  'HTML5ModeURLs',
  'ui.bootstrap'
])

.config( ['$stateProvider', '$urlRouterProvider', '$locationProvider', function myAppConfig ( $stateProvider, $urlRouterProvider, $locationProvider ) {
  $urlRouterProvider.otherwise( '/' );

  angular.forEach(categories, function(value) {
    if (value.taxonomy == "product_cat") {
      value.controller = 'ProductCtrl';
      value.templateUrl = 'product/product.tpl.html';
    } else if (value.taxonomy == "category") {
      value.controller = 'PageCtrl';
      value.templateUrl = 'page/page.tpl.html';
    }

    $stateProvider.state( value.slug + '-archive', {
      url: '/' + value.slug + '/',
      views: {
        "main": {
          controller: 'ArchiveCtrl',
          templateUrl: 'archive/archive.tpl.html'
        }
      },
      data:{ pageTitle: value.cat_name }
    });

    $stateProvider.state( value.slug, {
      url: '/' + value.slug + '/:name/',
      views: {
        "main": {
          controller: value.controller,
          templateUrl: value.templateUrl
        }
      },
      data:{ pageTitle: value.cat_name }
    });
  });
}])

.run(function run() {
  
})

.factory('API', ['$http', '$q', function APIRequest($http, $q) {
  var ajaxUrl = 'wp/wp-admin/admin-ajax.php';

  return {
    getProductList: function() {
      var deferred = $q.defer();

      $http.get('assets/products.json').success(function(data) {
        deferred.resolve(data);
      });

      return deferred.promise;
    },

    getPagesList: function() {
      var deferred = $q.defer();

      $http.get('assets/pages.json').success(function(data) {
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

      $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
      $http({
        method: 'POST',
        url: ajaxUrl,
        params: {
          action: 'login',
          log: log,
          pwd: pwd,
          rememberme: rememberme
        }
      }).success(function(data) {
        deferred.resolve(data);
      });

      return deferred.promise;
    },

    logout: function() {
      var deferred = $q.defer();

      $http.get('wp/wp-admin/admin-ajax.php?action=logout');

      return deferred.promise;
    },

    addToCart: function(product, variation) {
      var deferred = $q.defer();

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
        url: ajaxUrl,
        params: data
      }).success(function(data) {
        deferred.resolve(data);
      });

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
    API.addToCart(product, variation).then(function(result) {
      API.getCart().then(function(result) {
        if (!angular.isDefined($scope.user)) {
          $scope.user = {};
        }
        $scope.user.cart = result;
      });
    });
  };

  $scope.submitLogin = function() {
    API.login($scope.log, $scope.pwd, $scope.rememberme).then(function(result) {
      if (angular.isDefined(result.id)) {
        $scope.user = result;
        $scope.log = '';
        $scope.pwd = '';
      }
    });
  };

  $scope.logout = function() {
    API.logout().then(function(result) {
      delete $scope.user;
    });
  };

  // Check Auth post-render
  $timeout(function() {
    API.isLoggedIn().then(function(result) {

      if (!angular.isDefined(result.error)) {
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
