console.log('>>>INSTALL' +  "\n");

require('./server/global.js');
couchdb.onConnect(function(db) {
   console.log('CONNECT TO COUCHDB', db);
   db.createDatabase('spaceinvaders', function(err, res) {
       if (!err) {
           console.log('DATABASE CREATED');
       }

       var designDoc = {
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
       })
   });
});