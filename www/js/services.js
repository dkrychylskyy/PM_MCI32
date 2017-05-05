angular.module('starter.services', ['ngCordova'])

    .factory('NotesDataService', function ($cordovaSQLite, $ionicPlatform) {
        var db, dbName = "CONTACTS_DB"

        function useWebSql() {
            db = window.openDatabase(dbName, "1.0", "Contacts database", 200000)
            console.info('Using webSql')
        }

        function useSqlLite() {
            db = $cordovaSQLite.openDB({name: dbName, location: 1})
            console.info('Using SQLITE')
        }

        function initDatabase() {
            $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS T_CONTACTS (id integer primary key, nom, prenom, codePostale, ville, email, portable, divers, manifest, createdDate DATATIME)')
                .then(function (res) {

                }, onErrorQuery);
            $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS T_EMAILS (id integer primary key, email)')
                .then(function (res) {

                }, onErrorQuery);
            $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS T_MANIFESTS (id integer primary key, manifest)')
                .then(function (res) {

                }, onErrorQuery)
        }

        $ionicPlatform.ready(function () {
            if (window.cordova) {
                useSqlLite()
            } else {
                useWebSql()
            }

            initDatabase()
        })

        function onErrorQuery(err) {
            console.error(err)
        }

        return {
            createNote: function (note) {
                var manifest = "";
                return $cordovaSQLite.execute(db, 'INSERT INTO T_CONTACTS (nom, prenom, codePostale, ville, email, portable, divers, manifest, createdDate) VALUES(?, ?, ?, ?, ? ,?, ?, ?, datetime("now", "localtime"))', [note.nom, note.prenom, note.codePostale, note.ville, note.email, note.portable, note.divers, note.manifest])
            },
            updateNote: function (note) {
                return $cordovaSQLite.execute(db, 'UPDATE T_CONTACTS set nom = ?, prenom = ?, codePostale = ?, ville = ?, email = ?, portable = ?, divers = ?, manifest = ? where id = ?', [note.nom, note.prenom, note.codePostale, note.ville, note.email, note.portable, note.divers, note.manifest, note.id])
            },
            getAll: function (callback) {
                $ionicPlatform.ready(function () {
                    $cordovaSQLite.execute(db, 'SELECT * FROM T_CONTACTS').then(function (results) {
                        var data = []

                        for (i = 0, max = results.rows.length; i < max; i++) {
                            data.push(results.rows.item(i))
                        }

                        callback(data)
                    }, onErrorQuery)
                })
            },

            getContactsForCSV: function (callback) {
                $ionicPlatform.ready(function () {
                    $cordovaSQLite.execute(db, 'SELECT manifest, createdDate, nom, prenom, email, portable, ville, codePostale, divers ' +
                        'FROM T_CONTACTS ORDER BY createdDate DESC, manifest ASC  ').then(function (results) {
                        var data = []

                        for (i = 0, max = results.rows.length; i < max; i++) {
                            data.push(results.rows.item(i))
                        }

                        callback(data)
                    }, onErrorQuery)
                })
            },

            deleteNote: function (id) {
                return $cordovaSQLite.execute(db, 'DELETE FROM T_CONTACTS where id = ?', [id])
            },

            deleteAllNotes: function () {
                return $cordovaSQLite.execute(db, 'DELETE FROM T_CONTACTS')
            },

            getById: function (id, callback) {
                $ionicPlatform.ready(function () {
                    $cordovaSQLite.execute(db, 'SELECT * FROM T_CONTACTS where id = ?', [id]).then(function (results) {
                        callback(results.rows.item(0))
                    })
                })
            },

            createEmail: function (email) {
                return $cordovaSQLite.execute(db, 'INSERT INTO T_EMAILS (email) VALUES (?)', [email]);
            },

            createManifest: function (manifest) {
                return $cordovaSQLite.execute(db, 'INSERT INTO T_MANIFESTS (manifest) VALUES (?)', [manifest]);
            },

            getEmail: function (callback) {
                $ionicPlatform.ready(function () {
                    $cordovaSQLite.execute(db, 'SELECT * FROM T_EMAILS WHERE ID = (SELECT MAX(ID) FROM T_EMAILS)').then(function (results) {
                        var data = []

                        for (i = 0, max = results.rows.length; i < max; i++) {
                            data.push(results.rows.item(i))
                        }

                        callback(data)
                    }, onErrorQuery)
                })
            },
            getManifest: function (callback) {
                $ionicPlatform.ready(function () {
                    $cordovaSQLite.execute(db, 'SELECT * FROM T_MANIFESTS WHERE ID = (SELECT MAX(ID) FROM T_MANIFESTS)').then(function (results) {
                        var data = []

                        for (i = 0, max = results.rows.length; i < max; i++) {
                            data.push(results.rows.item(i))
                        }

                        callback(data)
                    }, onErrorQuery)
                })
            }
        }
    })
    .factory('ContactsService', function ($ionicPlatform, $cordovaEmailComposer, $cordovaSQLite, $cordovaFile, NotesDataService) {

        // disable for testing in browser
        // $ionicPlatform.ready(function () {
        //   initCordovaEmailComposer();
        // })
        //
        // function initCordovaEmailComposer() {
        //   $cordovaEmailComposer.isAvailable().then(function () {
        //     //is available
        //   }, function () {
        //     //not available
        //     alert('Il vous faut regler boit mail');
        //   })
        // }

        return {

            createFile: function (data) {

                document.addEventListener('deviceready', function () {

                    var fileContacts = data;
                    if (!fileContacts == null || fileContacts.length) {
                        fileForSend = convertArrayToCSV({data: fileContacts});
                    } else {
                        // alert ("fileContacts not ready", fileContacts);
                    }

                    function convertArrayToCSV(args) {
                        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

                        data = args.data || null;
                        if (data == null || !data.length) {
                            return null;
                        }

                        columnDelimiter = args.columnDelimiter || ';';
                        lineDelimiter = args.lineDelimiter || '\n';

                        keys = Object.keys(data[0]);

                        result = '';
                        result += keys.join(columnDelimiter);
                        result += lineDelimiter;

                        data.forEach(function (item) {
                            ctr = 0;
                            keys.forEach(function (key) {
                                if (ctr > 0) result += columnDelimiter;
                                result += item[key];
                                ctr++;
                            });
                            result += lineDelimiter
                        });
                        return result
                    }

                    var fileForSend;

                    var fileName = 'contacts.csv';
                    var fileText = fileForSend;
                    var filePath = cordova.file.dataDirectory;


                    //check file
                    $cordovaFile.checkFile(filePath, fileName).then(function (success) {
                        // alert("file exist");
                        // if file existdelete and create new file
                        $cordovaFile.removeFile(filePath, fileName).then(function (success) {
                            // alert('file deleted');
                            //write new file
                            $cordovaFile.writeFile(filePath, fileName, fileText, true).then(function (success) {
                                // alert('file ' + fileName + ' created ' + filePath);
                            }, function (error) {
                                alert(error)
                            })
                        }, function (error) {
                            // alert('file not deleted')
                        })
                    }, function (error) {
                        // alert("file not exist", filePath);

                        //write new file
                        $cordovaFile.writeFile(cordova.file.externalDataDirectory, fileName, fileText, true).then(function (success) {
                            // alert("file created " + fileName);
                        }, function (error) {
                            // error
                        });

                    });
                })
            },

            // createEmail: function (filePath) {
            createEmail: function () {

                NotesDataService.getEmail(function (data) {
                    var address = data[0].email
                    // NotesDataService.getManifest(function (data) {
                    //     var manifest = data[0].manifest
                        var email = {
                            to: address,
                            attachments: [
                                cordova.file.externalDataDirectory + "/contacts.csv",
                            ],
                            subject: 'Vos contacts Presentation Manager',
                            body: "",
                            isHtml: true
                        };


                        $cordovaEmailComposer.open(email).then(null, function () {
                        });
                    })

                // })

            },
        }
    })
    .factory('FileService', function () {
        var images;
        var IMAGE_STORAGE_KEY = 'dav-images';

        function getImages() {
            var img = window.localStorage.getItem(IMAGE_STORAGE_KEY);
            if (img) {
                images = JSON.parse(img);
            } else {
                images = [];
            }
            return images;
        };

        function addImage(img) {
            images.push(img);
            window.localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
        };

        return {
            storeImage: addImage,
            images: getImages
        }
    })
    .factory('AddImageFromPicker', function (FileService, $cordovaFile, $cordovaImagePicker) {

        return {
            saveMediaPicker: function () {
                var options = {
                    maximumImagesCount: 1
                };
                $cordovaImagePicker.getPictures(options).then(function (results) {
                    for (var i = 0; i < results.length; i++) {
                        FileService.storeImage(results[i]);
                    }
                });
            }
        }
    })
