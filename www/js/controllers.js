angular.module('starter.controllers', ['ngCordova'])

    .controller('ListCtrl', function ($scope, $ionicPlatform, $timeout, $state, NotesDataService, $cordovaFile, $ionicPopup, ContactsService, $cordovaImagePicker, $cordovaEmailComposer, ionicMaterialMotion, ionicMaterialInk) {
        $scope.$on('$ionicView.enter', function (e) {
            NotesDataService.getAll(function (data) {
                $scope.disabledButton = false;
                $scope.itemsList = data
                for (i = 0; i < data.length; i++){
                    if (!data[i].dateToCall == ''){
                        data[i].dateToCall = new Date(data[i].dateToCall)
                    }
                    if (!data[i].timeToCall == ''){
                        data[i].timeToCall = new Date(data[i].timeToCall)
                    }
                }
                if (data.length == 0) {
                    $scope.disabledButton = true;
                }
            })
        })

        $scope.gotoEdit = function (idNote) {
            $state.go('form', {id: idNote})
        }

        $scope.sendContacts = function () {
            $ionicPlatform.ready(function () {
                NotesDataService.getContactsForCSV(function (data) {
                    ContactsService.createFile(data);
                })
                ContactsService.createEmail()
            })
        }

        $scope.deleteAllContacts = function () {
            var confirmPopup = $ionicPopup.confirm({
                cssClass: 'popupConfirmAttention',
                title: 'ATTENTION!!!',
                okType: 'button-assertive',
                cancelText: 'Annuler',
                cancelType: 'button-balanced',
                template: '<h4 class="text-center">êtes vous sûr de vouloir supprimer toutes les contacts?</h4>',
                okText: 'Oui'
            });
            // to activate ink on modal
            $timeout(function () {
                ionicMaterialInk.displayEffect();
            }, 0);

            confirmPopup.then(function (res) {
                if (res) {
                    NotesDataService.deleteAllNotes().then($state.reload('list'))
                    $scope.disabledButton = true;
                }
            })
        }
    })

    .controller('FormCtrl', function ($scope, $stateParams, $ionicPopup, $state, NotesDataService) {
        $scope.$on('$ionicView.enter', function (e) {

            initForm();
        })

        //for moment-picker. Not used
        // $scope.minDateMoment = moment().subtract(1, 'day');
        // $scope.minDateString = moment().subtract(0, 'day').format('YYYY-MM-DD hh:mm');

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
                    divers: '',
                    manifest: '',
                    dateToCall: '',
                    timeToCall: new Date(1970, 0, 1, 09)
                };
                NotesDataService.getManifest(function (data) {
                    $scope.noteForm.manifest = data[0].manifest;
                })
            }
        }

        function onSaveSuccess() {
            $state.go('slider');
            var alertPopup = $ionicPopup.alert({
                title: '<h3>Merci de votre confiance</h3>',
                okType: 'button-balanced'

            })
            alertPopup.then(function (res) {
                if (res) {
                    $state.go('slider');
                }
            })
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
                title: 'ATTENTION!!!',
                template: '<h4 class="text-center">êtes vous sûr de vouloir supprimer la note ?</h4>',
                cssClass: 'popupConfirmAttention',
                okType: 'button-assertive',
                cancelText: 'Annuler',
                cancelType: 'button-balanced'
            })

            confirmPopup.then(function (res) {
                if (res) {
                    NotesDataService.deleteNote(idNote).then(onSaveSuccess)
                }
            })
        }
    })

    .controller('ReglagesCtrl', function ($scope, $state, NotesDataService, $cordovaFile, $ionicPlatform, $ionicPopup,ContactsService, $cordovaImagePicker, $cordovaEmailComposer, ionicMaterialMotion, ionicMaterialInk) {
        $scope.$on('$ionicView.enter', function () {
            $ionicPlatform.ready(function () {
                $scope.formEmail = NotesDataService.getEmail(function (data) {
                    $scope.currentEmail = data[0].email;
                });
                $scope.formManifest = NotesDataService.getManifest(function (data) {
                    $scope.currentManifest = data[0].manifest;
                });
                NotesDataService.getAll(function (data) {
                    $scope.numberOfContacts = data.length
                })

            })
        })
        ionicMaterialInk.displayEffect();

        // set minimum date to yesterday
        $scope.minDateMoment = moment().subtract(1, 'day');
        $scope.minDateString = moment().subtract(0, 'day').format('YYYY-MM-DD');
    })

    .controller('AddImagesCtrl', function ($scope, $cordovaDevice, $stateParams, $cordovaImagePicker, $cordovaFile, $ionicPlatform, AddImageFromPicker, FileService) {
        $scope.$on('$ionicView.enter', function () {
            $ionicPlatform.ready(function () {
                $scope.images = FileService.images();
                $scope.$apply();
            });
            $scope.addFromPicker = function () {
                AddImageFromPicker.saveMediaPicker();
            }
            $scope.deleteAllImages = function () {
                window.localStorage.clear();
                $scope.images = FileService.images();
                $scope.$apply();
            }
        })
    })

    .controller('SliderCtrl', function ($scope, $cordovaDevice, $stateParams, $state, $ionicPlatform, $cordovaImagePicker, AddImageFromPicker, FileService, ionicMaterialMotion, ionicMaterialInk) {
        $scope.$on('$ionicView.enter', function () {
            $ionicPlatform.ready(function () {
                var images = FileService.images();
                $scope.numberOfSlides = images.length;
                $scope.images = images;
                $scope.lastImg = images[images.length - 1];
                $scope.$apply();
                $scope.sliderOptions = {
                    onInit: function (swiper) {
                        $scope.swiper = swiper;
                    }
                }
            })
        })
        ionicMaterialInk.displayEffect();
    })

    .controller('ParamsEmailCtrl', function ($scope, $state, $stateParams, $ionicPlatform, NotesDataService, $cordovaFile, ContactsService, $cordovaImagePicker, $cordovaEmailComposer, ionicMaterialMotion, ionicMaterialInk) {
        $scope.$on('$ionicView.enter', function () {
            $ionicPlatform.ready(function () {
                $scope.formEmail = NotesDataService.getEmail(function (data) {
                    $scope.formEmail.address = data[0].email;
                });

                $scope.formEmail = {address: ''};

                $scope.addEmail = function () {
                    NotesDataService.createEmail($scope.formEmail.address);
                    $state.go('reglages');

                }
            })
        })
    })

    .controller('ParamsManifestCtrl', function ($scope, $state, $stateParams, $ionicPlatform, NotesDataService, $cordovaFile, ContactsService, $cordovaImagePicker, $cordovaEmailComposer, ionicMaterialMotion, ionicMaterialInk) {
        $scope.$on('$ionicView.enter', function () {
            $ionicPlatform.ready(function () {
                $scope.formManifest = NotesDataService.getManifest(function (data) {
                    $scope.formManifest.text = data[0].manifest;
                });

                $scope.formManifest = {text: ''};

                $scope.addManifest = function () {
                    NotesDataService.createManifest($scope.formManifest.text);
                    console.log($scope.formManifest.text);
                    $state.go('reglages');

                }
            })
        })
    })
