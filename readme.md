# Worum geht's?
Routine in JavaScript.

Damit kann man sich eine Verkehrsverbindung ausrechnen lassen, die als Website auch offline funktioniert.

Außerdem kann der Routing-Algorithmus weiterentwickelt werden, um auch Spezialfälle zu berücksichtigen. Z.B.

* schönste Strecken
* zuverlässigste Strecken oder
* nur Umsteigestationen, an denen der Fahrstuhl funktioniert

# Wie funktioniert's?

1. /preprocessor/ (node.js)
	a. Die GTFS-Daten werden eingelesen.
	b. Die Daten werden geprüft.
	c. Es werden die Daten ermittelt, die für die nächsten 48 Stunden relevant sind.
	d. Die relevanten Daten werden dann als JSON ausgegeben.
2. /webapp/
	a. Hier wird dann auf der Basis des JSONs das Routing durchgeführt
	b. Als Darstellung ist unter anderem eine Karte z.B. auf der Basis von Leaflet geplant.