angular.module('starter.controllers', ['ngCordova'])

  .controller('ListCtrl', function ($scope, $ionicPlatform, $state, NotesDataService) {
    $scope.$on('$ionicView.enter', function (e) {
      NotesDataService.getAll(function (data) {
        $scope.itemsList = data
      })
    })

    $scope.gotoEdit = function (idNote) {
      $state.go('form', {id: idNote})
    }
  })

  .controller('FormCtrl', function ($scope, $stateParams, $ionicPopup, $state, NotesDataService) {
    $scope.$on('$ionicView.enter', function (e) {
      initForm()
    })

    function initForm() {
      if ($stateParams.id) {
        NotesDataService.getById($stateParams.id, function (item) {
          $scope.noteForm = item
        })
      } else {
        $scope.noteForm = {
          nom: '',
          prenom: '',
          codePostale: '',
          ville: '',
          email: '',
          portable: '',
          divers: ''
        };
      }
    }

    function onSaveSuccess() {
      $state.go('slider')
    }

    $scope.saveNote = function () {

      if (!$scope.noteForm.id) {
        NotesDataService.createNote($scope.noteForm).then(onSaveSuccess)
      } else {
        NotesDataService.updateNote($scope.noteForm).then(onSaveSuccess)
      }
    }

    $scope.confirmDelete = function (idNote) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Supprimer une note',
        template: 'êtes vous sûr de vouloir supprimer ?'
      })

      confirmPopup.then(function (res) {
        if (res) {
          NotesDataService.deleteNote(idNote).then(onSaveSuccess)
        }
      })
    }
  })

  .controller('ReglagesCtrl', function ($scope, $state, NotesDataService, $cordovaFile, ContactsService, $cordovaImagePicker, $cordovaEmailComposer, ionicMaterialMotion, ionicMaterialInk) {

    //
    // $scope.crAndSaveCSV = function () {
    //   NotesDataService.getAll(function (data) {
    //     ContactsService.createFile(data);
    //   });
    // }
    //
    // $scope.sendEmail = function () {
    //   ContactsService.createEmail()
    // }
    //
    // $scope.getImageSaveContact = function () {
    //   ImagesManagerService.getImages(function (data) {
    //     $scope.imgList = data;
    //   });
    // }
    ionicMaterialInk.displayEffect();
  })

  .controller('AddImagesCtrl', function ($scope, $cordovaDevice, $cordovaImagePicker, $cordovaFile, $ionicPlatform, AddImageFromPicker, FileService) {
    $scope.$on('$ionicView.enter', function () {
      $ionicPlatform.ready(function () {
        $scope.images = FileService.images();
        $scope.$apply();
      });
      $scope.addFromPicker = function () {
        AddImageFromPicker.saveMediaPicker();
      }
      $scope.clearData = function () {
        window.localStorage.clear();
        $state.go('addImages');

      }
    })
  })

  .controller('SliderCtrl', function ($scope, $cordovaDevice, $stateParams, $state, $ionicPlatform, $cordovaImagePicker, AddImageFromPicker, FileService, ionicMaterialMotion, ionicMaterialInk) {
    $scope.$on('$ionicView.enter', function () {
      $ionicPlatform.ready(function () {

        ///////// adding images frm imagePicker dirrect//////////////
        // var images = [];
        // function getImageTest () {
        //   return $cordovaImagePicker.getPictures().then(function (results) {
        //     for (var i = 0; i < results.length; i++) {
        //       images.push(results[i]);
        //     }
        //   })
        // }
        // getImageTest();

        var images = FileService.images();
        $scope.numberOfSlides = images.length;
        $scope.images = images;
        $scope.$apply();

        ///////// slider swiper///////
        // var mySwiper = new Swiper('.swiper-container', {
        //   initialSlide: 0,
        //   direction: 'horizontal', //or vertical
        //   speed: 400, //0.4s transition
        //   spaceBetween: 0
        // });


        // mySwiper.appendSlide('<div class="swiper-slide">' +
        //   '<h3>J\'espère que ça vous plaît.</h3>' +
        //   '<p>' +
        //   '<a href="#/form/" class="button button-block button-stable">Oui</a>' +
        //   '</p>' +
        //   '</div>');
        //////// end slider swiper//////

        ////////slider 2////////
        $scope.data = {};
        $scope.data.images = images;
        var setupSlider = function () {
          //some options to pass to our slider
          $scope.data.sliderOptions = {
            initialSlide: 0,
            direction: 'horizontal', //or vertical
            speed: 400 //0.3s transition
          };
          $scope.$apply();
        };
        setupSlider();
      })
    })
  })

  .controller('ParamsEmailCtrl', function ($scope, $state, NotesDataService, $cordovaFile, ContactsService, $cordovaImagePicker, $cordovaEmailComposer, ionicMaterialMotion, ionicMaterialInk) {
    $scope.$on('$ionicView.enter', function (e) {
      initForm()
    })
    function initForm() {
      $scope.formEmail = {
        address: '',
        subject: ''
      }
    }
   $scope.sendContacts = function () {
     var address = $scope.formEmail.address;
     var manifest = $scope.formEmail.manifest;

     if(!address){
       alert('no email');
     } else {
        NotesDataService.getAll(function (data) {
          ContactsService.createFile(data);
        });
        ContactsService.createEmail(address, manifest)
      }
     }
     console.log('address', address);
     console.log('manifest', manifest);

  })
