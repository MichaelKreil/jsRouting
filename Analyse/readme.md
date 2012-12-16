Es gibt ja das Problem bei vielen GTFS Daten keine `frequencies.txt` verwendet wird. Heißt: Wenn eine Bahn auf einer Strecke täglich 1.000mal fährt, dann werden auch 1.000 Einträge in `trips.txt` eingetragen. Wenn diese Bahn 40 Stationen abfährt, dann gibt es sogar 40.000 Einträge `stop_times.txt`.

Ich habe den Hinweis bekommen, dass sich für die Analyse des Problems besonders die Berliner U7-Linie eignet. Sie ist auch der Spitzenreiter bei der Anzahl der `stop_times.txt`-Einträge.

Hier sind mal alle Verbindungen der U7:

![Timetable.png](https://raw.github.com/michomachine/jsRouting/master/Analyse/images/Timetable.png)

Nimmt man nur die durchgehenden Verbindungen in eine Richtung und lässt sie alle gleichzeitig zum Zeitpunkt 0 starten, so ergibt sich folgendes Bild:

![Abfahrtzeiten-U7](https://raw.github.com/michomachine/jsRouting/master/Analyse/images/Abfahrtzeiten-U7.png)

Wie man sieht, lassen sich die knapp 500 Verbindungen reduzieren auf 5 Gruppen.

Offene ist aber noch:

* Lassen sich in den Gruppen genügend Wiederholungen finden, um einen Takt zu ermitteln, der dann für die `frequencies.txt` verwendet werden kann?
* Gibt es einen effizienten Weg, Cluster und Wiederholungen zu berechnen, ohne dass man die komplette `stop_times.txt` in den Arbeitsspeicher laden muss?

Die Datenstruktur des VBB stößt mit 6 Mio. Einträge bereits an die Grenzen. Für den kompletten Fahrplan der Deutsche Bahn sähe ich keine Chance, ihn in einen "handelsüblichen" Arbeitsspeicher zu packen. Dann ist mir eine ineffiziente Lösung lieber, als eine ineffektive.