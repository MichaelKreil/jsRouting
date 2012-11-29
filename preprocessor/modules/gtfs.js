var fs = require('fs');
var path = require('path');

exports.GTFS = function (foldername) {
	var me = this;
	
	// Überprüfe mal die Daten, ob alles in Ordnung ist. 
	me.check = function () {
		
	}
	 
	// Parser brauchen wir, um die Textfelder in die entsprechenden Datenformate zu konvertieren.
	var parsers = {
		// parsed ein Datum von Format YYYYMMDD
		// Das Ergebnis ist eine fortlaufende Zahl an Tagen, wo bei gilt:
		// date % 7 == 0 ... für Montage
		date: function (text) {
			var date = new Date(text.substr(0,4), parseInt(text.substr(4,2))-1, text.substr(6,2));
			return Math.round(date / 86400000)+3;
		},
		integer: function (text) {
			return parseInt(text, 10)
		}
	}
	
	// Wendet eine Funktion auf ein Feld einer Tabelle an.
	var convertFields = function (table, fields, func) {
		for (var j = 0; j < fields.length; j++) {
			var field = fields[j];
			for (var i = 0; i < table.length; i++) {
				table[i][field] = func(table[i][field])
			}
		}
	} 
	
	// Schmeiß alles weg, was nicht an den angegebenen Datumsen stattfindet
	me.useOnly = function (minDate, maxDate) {
		// Welche Datumse sollen berücksichtigt werden?
		minDate = parsers.date(minDate);
		maxDate = parsers.date(maxDate);

		// Welche ServiceIds sollen berücksichtigt werden?
		var usedServiceIds = {};
		
		// Anhand von calendar
		for (var i = 0; i < tables.calendar.length; i++) {
			var entry = tables.calendar[i];
			if ((minDate <= entry.end_date) && (entry.start_date <= maxDate)) {
				var weekdays = [entry.monday, entry.tuesday, entry.wednesday, entry.thursday, entry.friday, entry.saturday, entry.sunday];
				for (var d = minDate; d <= maxDate; d++) {
					if ((entry.start_date <= d) && (d <= entry.end_date) && (weekdays[d % 7] > 0)) {
						usedServiceIds[entry.service_id] = true;
					}
				}
			}
		}
		
		// Jetzt alle Ausnahmen aus calendar_dates berücksichtigen
		if (tables.calendar_dates) {
			for (var i = 0; i < tables.calendar_dates.length; i++) {
				var entry = tables.calendar_dates[i];
				if ((minDate <= entry.date) && (entry.date <= maxDate)) {
					usedServiceIds[entry.service_id] = (entry.exception_type == 1); 
				} 
			}
		}
		
		// Damit jetzt trips filtern
		//console.log(usedServiceIds);
		
	}
	
	// Zum Schluss können wir erst die stop_times einlesen und alles als JSON ausgeben.
	me.export = function (filename) {
		//'stop_times':      readCSV(foldername + '/stop_times.txt', true),
	}
	
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
	
	// Jetzt die entsprechenden Felder konvertieren
	convertFields( tables.calendar, ['start_date','end_date'], parsers.date);
	convertFields( tables.calendar, ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], parsers.integer);
	
	if (tables.calendar_dates) {
		convertFields( tables.calendar_dates, ['date'], parsers.date);
		convertFields( tables.calendar_dates, ['exception_type'], parsers.integer);
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