exports.GTFS = function (foldername) {
	var me = this;
	
	// Notwendige Dateien:
	var tables = {
		'agency': readCSV(folder+'agency.txt'),
		'calendar_dates': readCSV(folder+'calendar_dates.txt'),
		'calendar': readCSV(folder+'calendar.txt'),
		'routes': readCSV(folder+'routes.txt'),
		'shapes': readCSV(folder+'shapes.txt'),
		'stop_times': readCSV(folder+'stop_times.txt'),
		'stops': readCSV(folder+'stops.txt'),
		'transfers': readCSV(folder+'transfers.txt'),
		'trips': readCSV(folder+'trips.txt')
	};
}