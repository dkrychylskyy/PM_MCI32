angular.module('starter.controllers', ['ngCordova'])

  .controller('ListCtrl', function ($scope,$ionicPlatform, $state, NotesDataService) {
    $scope.$on('$ionicView.enter', function(e) {
      NotesDataService.getAll(function(data){
        $scope.itemsList = data
      })
    })

    $scope.gotoEdit = function(idNote){
      $state.go('form', {id: idNote})
    }
  })

  .controller('FormCtrl', function ($scope, $stateParams, $ionicPopup, $state, NotesDataService) {
    $scope.$on('$ionicView.enter', function(e) {
      initForm()
    })

    function initForm(){
      if($stateParams.id){
        NotesDataService.getById($stateParams.id, function(item){
          $scope.noteForm = item
        })
      } else {
        $scope.noteForm = {}
      }
    }
    function onSaveSuccess(){
      $state.go('list')
    }
    $scope.saveNote = function(){

      if(!$scope.noteForm.id){
        NotesDataService.createNote($scope.noteForm).then(onSaveSuccess)
      } else {
        NotesDataService.updateNote($scope.noteForm).then(onSaveSuccess)
      }
    }

    $scope.confirmDelete = function(idNote) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Supprimer une note',
        template: 'êtes vous sûr de vouloir supprimer ?'
      })

      confirmPopup.then(function(res) {
        if(res) {
          NotesDataService.deleteNote(idNote).then(onSaveSuccess)
        }
      })
    }
  })

.controller ('emailCtrl', function ($scope, $cordovaEmailComposer,$ionicPlatform, $state, ContactsService) {
  $scope.sendEmail = function () {
    ContactsService.createEmail()
  }
})

.controller('createCSVCtrl',function ($scope, NotesDataService) {

})

.controller('reglagesCtrl', function ($scope, $state, NotesDataService, $cordovaFile, ContactsService, $cordovaImagePicker) {
    $scope.crAndSaveCSV = function () {
      NotesDataService.getAll(function (data) {
        ContactsService.createFile(data);
      });
    },

  $scope.rmFile = function ($scope, ContactsService) {
    ContactsService.delFile()
  },

    $scope.getImageSaveContact = function ($scope, $cordovaImagePicker, $ionicPlatform) {
      var option = {
        maximumImagesCount: 5,
        width: 800,
        height: 800,
        quality: 100
      };
      $cordovaImagePicker.getPictures(option).then(function (results) {
        for (var i =0; i < results.length; i++){
          console.log("Image URL: ",result[i]);
        }
      }, function (error) {
        console.log('Error: ', + JSON.stringify(error));
      });
    }
})


