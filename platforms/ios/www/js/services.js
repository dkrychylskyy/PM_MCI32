angular.module('starter.services', ['ngCordova'])

  .factory('NotesDataService', function ($cordovaSQLite, $ionicPlatform) {
    var db, dbName = "CONTACTS_DB"

    function useWebSql() {
      db = window.openDatabase(dbName, "1.0", "Contacts database", 200000)
      console.info('Using webSql')
    }

    function useSqlLite() {
      db = $cordovaSQLite.openDB({name: dbName, location : 1})
      console.info('Using SQLITE')
    }

    function initDatabase(){
      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS T_CONTACTS (id integer primary key, nom, prenom, codePostale, ville, email, portable)')
        .then(function(res){

        }, onErrorQuery)
    }

    $ionicPlatform.ready(function () {
      if(window.cordova){
        useSqlLite()
      } else {
        useWebSql()
      }

      initDatabase()
    })

    function onErrorQuery(err){
      console.error(err)
    }

    return {
      createNote: function (note) {
        return $cordovaSQLite.execute(db, 'INSERT INTO T_CONTACTS (nom, prenom, codePostale, ville, email, portable) VALUES(?, ?, ?, ? ,? ,?)', [note.nom, note.prenom, note.codePostale, note.ville, note.email, note.portable])
      },
      updateNote: function(note){
        return $cordovaSQLite.execute(db, 'UPDATE T_CONTACTS set nom = ?, prenom = ?, codePostale = ?, ville = ?, email = ?, portable = ? where id = ?', [note.nom, note.prenom, note.codePostale, note.ville, note.email, note.portable, note.id])
      },
      getAll: function(callback){
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

      deleteNote: function(id){
        return $cordovaSQLite.execute(db, 'DELETE FROM T_CONTACTS where id = ?', [id])
      },

      getById: function(id, callback){
        $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, 'SELECT * FROM T_CONTACTS where id = ?', [id]).then(function (results) {
            callback(results.rows.item(0))
          })
        })
      }
    }
  })

.factory('ContactsService',function ($ionicPlatform, $cordovaEmailComposer, $cordovaSQLite, $cordovaFile, NotesDataService) {

  $ionicPlatform.ready(function () {
    initCordovaEmailComposer();
  })

  function initCordovaEmailComposer() {
    $cordovaEmailComposer.isAvailable().then(function () {
      //is available
      alert('avaible');
    }, function () {
      //not available
      alert('not available');
    })
  }

  return {

    createFile: function (data) {

      document.addEventListener('deviceready', function () {

        var fileContacts = data;
      //   getContacts(fileContacts);
      //   function getContacts(fileContacts) {
      //     NotesDataService.getAll(function (data) {
      //    for (var i = 0; i < data.length; i++){
      //      fileContacts.push(data[i]);
      //    }
      //   });
      // }
        if (!fileContacts == null || fileContacts.length){
          fileForSend = convertArrayToCSV({data: fileContacts});
        }  else {
          alert ("fileContacts not ready", fileContacts);
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


        //CHECK file
        $cordovaFile.checkFile(filePath, fileName).then(function (success) {
          alert("file exist");
          // if file exist DELETE and create
          $cordovaFile.removeFile(filePath, fileName).then(function (success) {
            alert('file deleted');
            //WRITE NEW FILE
            $cordovaFile.writeFile(filePath, fileName, fileText, true).then(function (success) {
              alert('file ' + fileName + ' created ' + filePath);
            }, function (error) {
              alert(error)
            })
          }, function(error){
            alert('file not deleted')
          })
        }, function (error) {
          alert("file not exist", filePath);

          //WRITE NEW FILE
          $cordovaFile.writeFile(cordova.file.externalDataDirectory, fileName, fileText, true).then(function (success) {
            alert("file created " + fileName);
          }, function (error) {
            // error
          });

        });
      })
    },

    createEmail: function (filePath) {
      var email = {
        to: 'd.krychylskyy@gmail.com',
        attachments: [
          cordova.file.externalDataDirectory + "/contacts.csv",
        ],
        subject: 'Cordova Icons',
        body: "Hello, mon ami",
        isHtml: true
      };


      $cordovaEmailComposer.open(email).then(null, function () {
      });
    },
  }
})
