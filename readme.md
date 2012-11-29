# Worum geht's?
Routing in JavaScript.

Damit kann man sich eine Nahverkehrsverbindung ausrechnen lassen, die als Website auch offline funktioniert.

Außerdem kann der Routing-Algorithmus weiterentwickelt werden, um auch Spezialfälle zu berücksichtigen. Z.B.

* schönste Strecken
* zuverlässigste Strecken oder
* nur Umsteigestationen, an denen der Fahrstuhl funktioniert

# Wie funktioniert's?

1. /preprocessor/ (node.js)
   * Die [GTFS](https://developers.google.com/transit/gtfs/reference)-Daten werden eingelesen.
   * Die Daten werden geprüft.
   * Es werden die Daten ermittelt, die für die nächsten 48 Stunden relevant sind.
   * Die relevanten Daten werden dann als JSON ausgegeben.
2. /webapp/ (HTML, CSS, JavaScript)
   * Hier wird dann auf der Basis des JSONs das Routing durchgeführt
   * Als Darstellung ist unter anderem eine Karte z.B. auf der Basis von Leaflet geplant.

# Installation

1. Repository holen
2. in /data/ die gewünschten GTFS-Daten entpacken (z.B. <http://datenfragen.de/openvbb/GTFS_VBB_Okt2012.zip>) und
3. in /preprocessor/convert.js das GTFS-Verzeichnis anpassen.
	