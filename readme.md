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

# Welche Probleme gibt es noch?

Es scheint bei vielen Nahverkehrs-GTFS-Datensätzen (nicht nur beim VBB) das Problem zu geben, dass die GTFS-Daten nicht gut strukturiert sind. Bis jetzt sind beim VBB-Datensatz bekannt:
* Die calendar.txt enthält etwa 1.800 Fahrplangültigkeiten, die jedoch immer auf Null gesetzt sind. Heißt, alle angegebenen Fahrpläne gelten nie. Die calendar_dates.txt enthält jedoch knapp 32.000 Ausnahmen davon. Jede Ausnahme bedeutet, dass an einem Tag der Fahrplan doch gilt. Das könnte man natürlich deutlich effizienter in der calendar.txt abbilden.
* Die Taktungen auf einer Route wird eigentlich in der frequencies.txt beschrieben. Da keine frequencies.txt angegeben ist, wird jede einzelne Fahrt gespeichert. Deswegen ist die stop_times.txt mit 6 Mio. Einträgen und 250MB auch so groß!
* Der Fahrplan vieler Unternehmen ist vermutlich sekundengenau (z.B. für U-Bahnen). Angegeben wird er jedoch in Minuten. Dadurch kommt es zu Rundungsfehlern! Bedeutet: Manchmal benötigt eine U-Bahn zwischen zwei Stationen 1 Minute und manchmal benötigt sie auf der gleichen Strecke 2 Minuten. Dadurch lässt sich auf den ersten Blick kein "regulär getakteter Fahrplan" erzeugen

# Installation

1. Repository holen
2. in /data/ die gewünschten GTFS-Daten entpacken (z.B. <http://datenfragen.de/openvbb/GTFS_VBB_Okt2012.zip>) und
3. in /preprocessor/convert.js das GTFS-Verzeichnis anpassen.
	