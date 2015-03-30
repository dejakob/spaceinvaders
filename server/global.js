GLOBAL.rootpath = require('path').dirname(require.main.filename);
GLOBAL.totalLevelCount = require('fs').readdirSync(GLOBAL.rootpath + '/server/spacelogic/levels').length;

GLOBAL.couchdb = require('./services/couchdb.js');
GLOBAL.serverPort = 8003;

//Add awesome stuff to prototypes
require(GLOBAL.rootpath + '/server/string.js');