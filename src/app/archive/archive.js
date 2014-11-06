/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'ngBoilerplate.archive', [
  'ui.router'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
/*.config(function config( $stateProvider ) {
  $stateProvider.state( 'torkad-chili-archive', {
    url: '/torkad-chili/',
    views: {
      "main": {
        controller: 'ArchiveCtrl',
        templateUrl: 'archive/archive.tpl.html'
      }
    },
    data:{ pageTitle: 'Torkad Chili' }
  });
})
.config(function config( $stateProvider ) {
  $stateProvider.state( 'chilipulver-archive', {
    url: '/chilipulver/',
    views: {
      "main": {
        controller: 'ArchiveCtrl',
        templateUrl: 'archive/archive.tpl.html'
      }
    },
    data:{ pageTitle: 'Chilipulver' }
  });
})
.config(function config( $stateProvider ) {
  $stateProvider.state( 'kryddor-archive', {
    url: '/kryddor/',
    views: {
      "main": {
        controller: 'ArchiveCtrl',
        templateUrl: 'archive/archive.tpl.html'
      }
    },
    data:{ pageTitle: 'Kryddor' }
  });
})
.config(function config( $stateProvider ) {
  $stateProvider.state( 'krossad-chili-archive', {
    url: '/krossad-chili/',
    views: {
      "main": {
        controller: 'ArchiveCtrl',
        templateUrl: 'archive/archive.tpl.html'
      }
    },
    data:{ pageTitle: 'Krossad Chili' }
  });
})
.config(function config( $stateProvider ) {
  $stateProvider.state( 'chilipaket-archive', {
    url: '/chilipaket/',
    views: {
      "main": {
        controller: 'ArchiveCtrl',
        templateUrl: 'archive/archive.tpl.html'
      }
    },
    data:{ pageTitle: 'Chilipaket' }
  });
})*/

/**
 * And of course we define a controller for our route.
 */
.controller( 'ArchiveCtrl', ['$scope', 'API', '$state', '$stateParams', function HomeController( $scope, API, $state, $stateParams ) {
  $scope.products = [];
  
  API.getProductList().then(function(result) {
    $scope.productList = result.products;
    for (var i = 0; i < $scope.productList.length; i++) {
      $scope.productList[i].permalink = $scope.productList[i].permalink.replace('/wp/produkt', '');
      $scope.productList[i].permalink = $scope.productList[i].permalink.replace('http://localhost/WooAngular/build', '');
      if ($scope.productList[i].permalink.indexOf($state.current.url) >= 0) {
        $scope.products.push($scope.productList[i]);
      }
    }
  });
}])

;
