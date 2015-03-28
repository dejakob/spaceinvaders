GLOBAL.rootpath = require('path').dirname(require.main.filename);
GLOBAL.totalLevelCount = require('fs').readdirSync(GLOBAL.rootpath + '/server/spacelogic/levels').length;

//Add awesome stuff to prototypes
require(GLOBAL.rootpath + '/server/string.js');