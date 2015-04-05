console.log('>>>INSTALL' +  "\n");

require('./server/global.js');
couchdb.onConnect(function(db) {
   console.log('CONNECT TO COUCHDB', db);

   db.dropDatabase('spaceinvaders', function(err,res) {
       db.createDatabase('spaceinvaders', function(err, res) {
           if (!err) {
               console.log('DATABASE CREATED');
           }

           var designDoc;

           designDoc = {
               _id: '_design/highscores',

               language: 'javascript',

               views: {
                   'by_score': {
                       map: function(doc) {
                           if (doc.type === 'score' && typeof doc.twitterInfo !== 'undefined') {
                               emit([doc.score], doc);
                           }
                       }.toString()
                   }
               }
           };

           db.insert('spaceinvaders', designDoc, function(err, res) {
               console.log('ERRRES', err, res);
           });

           designDoc = {
               _id: '_design/games',

               language: 'javascript',

               views: {
                   'by_playerid': {
                       map: function(doc) {
                           if (doc.type === 'game' && typeof doc.user !== 'undefined' && !doc.deleted) {
                               emit([doc.user.id], doc);
                           }
                       }.toString()
                   },
                   'by_location': {
                       map: function(doc) {
                           if (doc.type === 'game' && typeof doc.user !== 'undefined' && typeof doc.location !== 'undefined' && !doc.deleted) {
                               emit([doc.location.latitude, doc.location.longitude], doc);
                           }
                       }.toString()
                   }
               }
           };

           db.insert('spaceinvaders', designDoc, function(err, res) {
               console.log('ERRRES', err, res);
           });
       });
   });


});