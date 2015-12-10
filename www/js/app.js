angular.module('TimeManager', ['ionic','ui.router', 'chart.js', 'TimeManager.Services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.run(
  [ '$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ]
)

.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $stateProvider.state('home', {
        url: '',
        templateUrl: 'templates/tasks.html'
      });
      $stateProvider.state('tasks', {
        url: '/tasks',
        templateUrl: 'templates/tasks.html'
      });
      $stateProvider.state('categories', {
        url: '/categories',
        templateUrl: 'templates/categories.html'
      });
      $stateProvider.state('statistic', {
        url: '/statistic',
        templateUrl: 'templates/statistic.html'
      });
      $stateProvider.state('about', {
        url: '/about',
        templateUrl: 'templates/about.html'
      });
}])
