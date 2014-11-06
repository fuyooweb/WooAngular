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
angular.module( 'ngBoilerplate.page', [
  'ui.router'
])

.run(function run() {
  
})

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config( [ '$stateProvider', function config( $stateProvider ) {
  /*API.getPagesList().then(function(result) {
    console.log(result);
  });*/

/*$http.get('/WooAngular/build/assets/pages.json').success(function(data) {
    console.log(data);
  });*/
  /*angular.forEach(result, function(page) {
      var state = {
        url: '/' + page.post_name,
        views: {
          "main": {
            controller: 'PageCtrl',
            templateUrl: 'page/page.tpl.html'
          }
        },
        data: { pagetitle: page.post_title }
      };
      $stateProvider.state(page.post_name, state);
    });*/

  /*var cachedPages = [{
    name: 'kontakt',
    state: {
      url: '/kontakt',
      views: {
        "main": {
          controller: 'PageCtrl',
          templateUrl: 'page/page.tpl.html'
        }
      },
      data: { pageTitle: 'Kontakt' }
    }
  }];

  angular.forEach(cachedPages, function(page) {
    $stateProvider.state(page.name, page.state);
  });*/
}])

/**
 * And of course we define a controller for our route.
 */
.controller( 'PageCtrl', ['$scope', 'API', '$stateParams', function PageController( $scope, API, $stateParams ) {

  /*API.getProductList().then(function(result) {
    $scope.productList = result.products;
    for (var i = 0; i < $scope.productList.length; i++) {
      $scope.productList[i].permalink = $scope.productList[i].permalink.replace('https://www.chilikungen.se/produkt', '/WooAngular/build');
      if ($scope.productList[i].permalink.indexOf($stateParams.name) >= 0) {
        $scope.product = $scope.productList[i];
      }
    }
  });*/
}])

;
