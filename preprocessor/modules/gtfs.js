var fs = require('fs');
var path = require('path');

exports.GTFS = function (foldername) {
	var me = this;
	
	// Lese GTFS-Daten ... alle, außer "stop_times" ... denn die ist so fett, dass sie später geparsed wird.
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
		'stops':           readCSV(foldername + '/stops.txt', true),
		'transfers':       readCSV(foldername + '/transfers.txt'),
		'trips':           readCSV(foldername + '/trips.txt', true)
	};
	
	// Überprüfe mal die Daten, ob alles in Ordnung ist. 
	me.check = function () {
		
	}
	
	// Schmeiß alles weg, was nicht an den angegebenen Datumsen stattfindet
	me.useOnly = function (dates) {
		
	}
	
	// Zum Schluss können wir erst die stop_times einlesen und alles als JSON ausgeben.
	me.export = function (filename) {
		//'stop_times':      readCSV(foldername + '/stop_times.txt', true),
	}
	
	return me;
}

function parseCSVLine(line) {
	// Da gibt es bestimmt noch Foo mit Kommata in Strings zwischen Gänsefüßchen :/
	return line.split(',');
}

function readCSV(filename, required) {
	filename = path.normalize(filename);
	if (fs.existsSync(filename)) {
		console.log('Lese "'+filename+'"');
		
		// Datei lesen
		var file = fs.readFileSync(filename, 'utf-8');
		
		// In Zeilen zerlegen
		file = file.replace(/[\n\r]+/g, '\r');
		var lines = file.split('\r');
		
		// Zeilen parsen
		for (var i = 0; i < lines.length; i++) {
			lines[i] = parseCSVLine(lines[i]);
		}
		
		// Kopfzeile extrahieren;
		var head = lines.shift();
		
		// Zeilen werden zu Objekten
		var n = 0;
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			if (line != '') {
				var obj = {};
				for (var j = 0; j < head.length; j++) {
					obj[head[j]] = line[j];
				}
				lines[n] = obj;
				n++;
			}
		}
		
		// ungenutzte Zeilen entfernen
		lines.length = n;
		
		return lines;
	} else {
		if (required) {
			console.error('"'+filename+'" is required but not found.')
		}
		return undefined;
	}
}