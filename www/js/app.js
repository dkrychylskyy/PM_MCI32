angular.module('starter', ['ionic','starter.controllers', 'starter.services', 'ionic-material', 'ui.router'])
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
        cordova.plugins.Keyboard.disableScroll(true)
      }
      if(window.StatusBar) {
        StatusBar.styleDefault()
      }
    })
  })
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('list', {
        url: '/list',
        templateUrl: 'templates/list.html',
        controller: 'ListCtrl'
      })

      .state('form', {
        url: '/form/{id}',
        templateUrl: 'templates/form.html',
        controller: 'FormCtrl',
        params: {
          id: {value: null},
        },
      })

      .state('reglages', {
        url: '/reglages',
        templateUrl: 'templates/reglages.html',
        controller: 'ReglagesCtrl'
      })

      .state('addImages', {
        url: '/addImages',
        templateUrl: 'templates/addImages.html',
        controller: 'AddImagesCtrl'
      })

      .state('slider',{
        url: '/slider',
        templateUrl: 'templates/slider.html',
        controller: 'SliderCtrl'
      })

      .state('emailParams', {
        url: '/emailParams',
        templateUrl: 'templates/params-email.html',
        controller: 'ParamsEmailCtrl'
      })

        .state('manifestParams', {
            url: '/manifestParams',
            templateUrl: 'templates/params-manifest.html',
            controller: 'ParamsManifestCtrl'
        })

        .state('formParams', {
            url: '/formParams',
            templateUrl: 'templates/params-form.html',
            controller: 'ParamsFormCtrl'
        })

        .state('invitParams', {
            url: '/invitParams',
            templateUrl: 'templates/params-invit.html',
            controller: 'ParamsInvitCtrl'
        })
        .state('remerciParams', {
            url: '/remerciParams',
            templateUrl: 'templates/params-remerci.html',
            controller: 'ParamsRemerciCtrl'
        })

      $urlRouterProvider.otherwise('/slider')
  })
