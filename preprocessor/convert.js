var gtfs = require('./modules/gtfs').GTFS('../data/GTFS_VBB_Okt2012');

gtfs.useOnly('20121129', '20121130');

gtfs.export('../webapp/data/gtfs.js');