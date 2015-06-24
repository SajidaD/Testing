// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    // if(window.cordova && window.cordova.plugins.Keyboard) {
      // cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    // }
    // if(window.StatusBar) {
      // StatusBar.styleDefault();
    // }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('items', {
        url: '/items',
        templateUrl: 'templates/items.html',
        controller: 'ItemsCtrl',
        resolve: {
            // items: function(DatasyncAdapter) {
//                 return DatasyncAdapter.getAdapter('TODO.Item').fetch();
//             }
        }
    })
    
    .state('IssueInformation', {
    	
        url:'/IssueInformation',
        abstract: true,
        templateUrl: 'templates/IssueInformation.html',
        controller: 'IssueInformationCtrl'
    })
    .state('Details', {
        url:'/Details',
        templateUrl: 'templates/Details.html',
        controller: 'DetailsCtrl'
    })
    .state('SpareParts', {

        url:'/SpareParts',
        templateUrl: 'templates/SpareParts.html',
        controller: 'SparePartsCtrl'
    })
    .state('Directions', {

        url:'/Directions',
        templateUrl: 'templates/Directions.html',
        controller: 'DirectionsCtrl'
    })
    .state('create', {
        url: '/create',
        templateUrl: 'templates/create.html',
        controller: 'CreateCtrl',
        resolve: {
            item: function($stateParams, DatasyncAdapter) {
                return DatasyncAdapter.getAdapter('TODO.Item').fetch();
            },
            categories: function(DatasyncAdapter) {
                return DatasyncAdapter.getAdapter('TODO.Category').fetch();
            }
        }
    })
    .state('create.general', {
        url: '/create.general',
        templateUrl: 'templates/create.general.html'
    })
    .state('create.categories', {
        url: '/create.categories',
        templateUrl: 'templates/create.categories.html'
    })
    //Amrat
    .state('tabs', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html",
        controller: 'HomeTabCtrl'
    })
    .state('tabs.Details', {
        url: "/Details",
        views: {
            'Details-tab': {
                templateUrl: "templates/Details.html",
                controller: 'DetailsCtrl'
            }
        }
    })
    .state('tabs.SpareParts', {
        url: "/SpareParts",
        views: {
            'SpareParts-tab': {
                templateUrl: "templates/SpareParts.html",
                controller: 'SparePartsCtrl'
            }
        }
    })
    .state('tabs.Directions', {
        url: "/Directions",
        views: {
            'Directions-tab': {
                templateUrl: "templates/Directions.html",
                controller: 'DirectionsCtrl'
            }
        }
    });


        //Amrat

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('items');
});
