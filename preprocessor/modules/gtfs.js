var fs = require('fs');
var path = require('path');

exports.GTFS = function (foldername) {
	var me = this;

	// Lese GTFS-Daten:
	var tables = {
		'agency':          readCSV(foldername + '/agency.txt', true),
		'calendar_dates':  readCSV(foldername + '/calendar_dates.txt'),
		'calendar':        readCSV(foldername + '/calendar.txt', true),
		'fare_attributes': readCSV(foldername + '/fare_attributes.txt'),
		'fare_rules':      readCSV(foldername + '/fare_rules.txt'),
		'feed_info':       readCSV(foldername + '/feed_info.txt'),
		'frequencies':     readCSV(foldername + '/frequencies.txt'),
		'routes':          readCSV(foldername + '/routes.txt', true),
		'shapes':          readCSV(foldername + '/shapes.txt'),
		'stop_times':      readCSV(foldername + '/stop_times.txt', true),
		'stops':           readCSV(foldername + '/stops.txt', true),
		'transfers':       readCSV(foldername + '/transfers.txt'),
		'trips':           readCSV(foldername + '/trips.txt', true)
	};
}

function parseCSVLine(line) {
	// Da gibt es bestimmt noch Foo mit Kommata in Gänsefüßchen :/
	return line.split(',');
}

function readCSV(filename, required) {
	filename = path.normalize(filename);
	if (fs.existsSync(filename)) {

		// Datei lesen
		var file = fs.readFileSync(filename, 'utf-8');

		// In Zeilen zerlegen
		file = file.replace(/[\n\r]+/g, '\r');
		var lines = file.split('\r');

		// Zeilen parsen
		for (var i = 0; i < lines.length; i++) lines[i] = parseCSVLine(lines[i]);

		// Kopfzeile extrahieren;
		var head = lines.shift();

		// Zeilen werden zu Objekten
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			var object = {};
			for (var j = 0; j < head.length; j++) {
				object[head[j]] = line[j].replace(/^"|"$/g, '');
			}
			lines[i] = object;
		}

		return {
			head:head,
			lines:lines
		};
	} else {
		if (required) {
			console.error('"'+filename+'" is required but not found.')
		}
		return undefined;
	}
}
