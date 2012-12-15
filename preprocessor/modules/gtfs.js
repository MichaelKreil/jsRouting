var fs = require('fs');
var path = require('path');

exports.GTFS = function (foldername) {
	var me = this;
	me.foldername = foldername;

	// Welche Ids sollen berücksichtigt werden?
	var usedServiceIds = {};
	var usedRouteIds = {};
	var usedTripIds = {};
	
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
		time: function (text) {
			var value = text.split(':');
			return parseInt(value[0], 10)*3600 + parseInt(value[1], 10)*60 + parseInt(value[2], 10);
		},
		integer: function (text) {
			return parseInt(text, 10)
		},
		number: function (text) {
			return parseFloat(text)
		},
		text: function (text) {
			text = text.replace(/^\s*|\s*$/g, '');
			if (text.substr(0,1) == '"') {
				text = text.substr(1, text.length - 2);
			} 
			return text
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
	
	var mapFields = function(table, fields) {
		var result = [];
		for (var i = 0; i < table.length; i++) {
			var entry = table[i];
			var o = {};
			for (var old in fields) {
				o[fields[old]] = entry[old];
			}
			result.push(o);
		}
		return result;
	} 
	
	// Schmeiß alles weg, was nicht an den angegebenen Datumsen stattfindet
	me.useOnly = function (minDate, maxDate) {
		// Welche Datumse sollen berücksichtigt werden?
		minDate = parsers.date(minDate);
		maxDate = parsers.date(maxDate);

		// Welche ServiceIds sollen berücksichtigt werden?
		usedServiceIds = {};
		usedRouteIds = {};
		usedTripIds = {};
		
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
		for (var i = 0; i < tables.calendar_dates.length; i++) {
			var entry = tables.calendar_dates[i];
			if ((minDate <= entry.date) && (entry.date <= maxDate)) {
				usedServiceIds[entry.service_id] = (entry.exception_type == 1); 
			} 
		}
		
		// Damit jetzt calendar_dates filtern
		log('calendar_dates filtern', 1);
		var t = tables.calendar_dates;
		tables.calendar_dates = [];
		for (var i = 0; i < t.length; i++) {
			var entry = t[i];
			if ((minDate <= entry.date) && (entry.date <= maxDate) && (usedServiceIds[entry.service_id])) {
				tables.calendar_dates.push(entry);
			}
		}
		
		// Welche trips werden verwendet?
		log('trips filtern', 1);
		var t = tables.trips;
		tables.trips = [];
		for (var i = 0; i < t.length; i++) {
			var entry = t[i];
			if (usedServiceIds[entry.service_id]) {
				usedRouteIds[entry.route_id] = true;
				usedTripIds[entry.trip_id] = true;
				tables.trips.push(entry);
			}
		}
		
		// Welche Routen werden verwendet
		log('routes filtern', 1);
		var t = tables.routes;
		tables.routes = [];
		for (var i = 0; i < t.length; i++) {
			var entry = t[i];
			if (usedRouteIds[entry.route_id]) {
				tables.routes.push(entry);
			}
		}
		
		// Jetzt erst stop_times importieren
		log('stop_times importieren', 1);
		var lines = readCSV(foldername + '/stop_times.txt', true, true);
		var stop_times = [];
		var head = parseCSVLine(lines[0]);
		var tripIdIndex;
		
		for (var i = 0; i < head.length; i++) {
			if (head[i] == 'trip_id') tripIdIndex = i;
		}
		
		for (var i = 1; i < lines.length; i++) {
			entry = parseCSVLine(lines[i]);
			if (usedTripIds[entry[tripIdIndex]]) {
				stop_times.push(entry);
			}
			if (i % 300000 == 0) {
				log((100*i/lines.length).toFixed(1) + '% untersucht, davon ' + (100*stop_times.length/i).toFixed(1) + '% genutzt', 2);
			}
		}
		
		delete lines;
		
		// Zeilen werden zu Objekten
		var n = 0;
		var temp = [head];
		for (var i = 0; i < stop_times.length; i++) {
			var line = stop_times[i];
			if (line != '') {
				var obj = {};
				for (var j = 0; j < head.length; j++) {
					obj[head[j]] = line[j];
				}
				stop_times[n] = obj;
				n++;
				if (obj.stop_id == '9170001') {
					temp.push(line);
				}
			}
		}
		
		// ungenutzte Zeilen entfernen
		stop_times.length = n;
		
		fs.writeFileSync('temp.csv', temp.join('\r'), 'utf8');
		
		
		//'stop_times':      readCSV(foldername + '/stop_times.txt', true),
	}
	
	// Zum Schluss können wir erst die stop_times einlesen und alles als JSON ausgeben.
	me.export = function (filename) {
		log('Export "'+filename+'"', 0);
		
		var result = {};
		
		result.stops = mapFields(tables.stops, {
			'stop_name':'name',
			'stop_lat':'lat',
			'stop_lon':'lon'
		});
		
		//result = JSON.stringify(result, null, '\t');
		result = JSON.stringify(result);
		result = 'var gtfs = '+result;
		fs.writeFileSync(filename, result, 'utf8');
	}
	
	// Lese GTFS-Daten ... alle, außer "stop_times" ... denn die ist so fett, dass sie später geparsed wird.
	var tables = {
		'agency':          readCSV(foldername + '/agency.txt',         true),
		'calendar_dates':  readCSV(foldername + '/calendar_dates.txt'      ),
		'calendar':        readCSV(foldername + '/calendar.txt',       true),
		'fare_attributes': readCSV(foldername + '/fare_attributes.txt'     ),
		'fare_rules':      readCSV(foldername + '/fare_rules.txt'          ),
		'feed_info':       readCSV(foldername + '/feed_info.txt'           ),
		'frequencies':     readCSV(foldername + '/frequencies.txt'         ),
		'routes':          readCSV(foldername + '/routes.txt',         true),
		'shapes':          readCSV(foldername + '/shapes.txt'              ),
		'stops':           readCSV(foldername + '/stops.txt',          true),
		'transfers':       readCSV(foldername + '/transfers.txt'           ),
		'trips':           readCSV(foldername + '/trips.txt',          true)
	};
	
	// Jetzt die entsprechenden Felder konvertieren
	log('Felder konvertieren', 1);
	convertFields( tables.calendar, ['start_date','end_date'], parsers.date);
	convertFields( tables.calendar, ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], parsers.integer);
	
	convertFields( tables.stops, ['stop_lat', 'stop_lon'], parsers.number);
	convertFields( tables.stops, ['stop_name'], parsers.text);
	
	convertFields( tables.trips, ['trip_headsign','trip_short_name'], parsers.text);
	
	if (tables.calendar_dates) {
		convertFields( tables.calendar_dates, ['date'], parsers.date);
		convertFields( tables.calendar_dates, ['exception_type'], parsers.integer);
	}
	
	return me;
}

function parseCSVLine(line) {
	if (line.indexOf('"') < 0) {
		return line.split(',');
	} else {
		// Shit, Gänsefüßchen!!EINSELF!!
		// Jetzt muss die Zeile per Hand entpopelt werden.
		var fields = [];
		var inString = false;
		var s = '';
		for (var i = 0; i < line.length; i++) {
			var c = line.charAt(i);
			if (inString) {
				switch (c) {
					case '\\': // Ignorier mal
					break;
					case '"': // Feld zuende
						inString = false;
					break;
					default:
						s += c;
				}
			} else {
				switch (c) {
					case ',':
						fields.push(s);
						s = '';
					break;
					case '"':
						inString = true;
					break;
					default:
						s += c;
				}
			}
		}
		fields.push(s);
		return fields;
	}
}

function readCSV(filename, required, dontParseLines) {
	filename = path.normalize(filename);
	if (fs.existsSync(filename)) {
		
		// Datei lesen
		log('Lese "'+filename+'"', 1);
		var file = fs.readFileSync(filename, 'utf-8');
		
		// In Zeilen zerlegen
		log('Zerlege in Zeilen', 2);
		file = file.replace(/[\n\r]+/g, '\r');
		var lines = file.split('\r');
		
		if (!dontParseLines) {
			// Kopfzeile extrahieren;
			var head = parseCSVLine(lines.shift());
			
			// Zeilen parsen
			log('Zeilen parsen', 2);
			var n = 0;
			for (var i = 0; i < lines.length; i++) {
				var line = lines[i];
				
				if (line != '') {
					line = parseCSVLine(line);
					
					var obj = {};
					for (var j = 0; j < head.length; j++) {
						obj[head[j]] = line[j];
					}
					lines[n] = obj;
					n++;
					
					if (n % 100000 == 0) {
						log('Zeile Nr.'+n, 3);
					}
				}
			}
			
			// ungenutzte Zeilen entfernen
			lines.length = n;
		}
		
		return lines;
	} else {
		if (required) {
			log('"'+filename+'" is required but not found.', 0)
		}
		return undefined;
	}
}

var tabs = '                              ';
function log(msg, level) {
	console.log(tabs.substr(0,level*3) + msg);
}