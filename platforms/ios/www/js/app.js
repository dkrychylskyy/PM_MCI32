angular.module('starter', ['ionic','starter.controllers', 'starter.services'])

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
      .state('slider', {
        url: '/slider',
        templateUrl: 'templates/slider.html',
        controller: 'sliderCtrl'
      })

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

      .state('email', {
        url: '/email',
        templateUrl: 'templates/email.html', //используем для информации о ходе отправки
        controller: 'emailCtrl',
        params: {
          to: "d.krychylskyy@gmail.com",
          subject: "Test email from Cordova",
          body: "Hello, it's work without attachements",
          isHtml: false
        }
      })

      .state('reglages', {
        url: '/reglages',
        templateUrl: 'templates/reglages.html',
        controller: 'reglagesCtrl'
      })

    $urlRouterProvider.otherwise('/list')
  })
