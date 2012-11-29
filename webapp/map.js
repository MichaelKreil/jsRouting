function Map(container) {
    container.id = 'map';

    this.map = new L.Map('map').setView([52.52, 13.37], 17);

    new L.TileLayer(
        'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-streets/{z}/{x}/{y}.png',
        { attribution: 'Map tiles &copy; <a href="http://mapbox.com">MapBox</a>', maxZoom: 17 }
    ).addTo(this.map);

    this.layer = new L.LayerGroup();
    this.layer.addTo(this.map);

    this.map.on('zoomend', function() {
        var radius = this.map.getZoom() / 2 << 0;
        this.layer.eachLayer(function (marker) {
            marker.setRadius(radius);
        }.bind(this));
    }.bind(this));
}

Map.prototype.setData = function (data) {
    var bounds = [];
    this.map.removeLayer(this.layer);
    this.layer.clearLayers();
    data.forEach(function (poi) {
        bounds.push([poi.lat, poi.lon]);
        var marker = createMarker(poi);
        marker.on('click', function (e) {
        }.bind(this));
        marker.addTo(this.layer);
    }.bind(this));
    this.layer.addTo(this.map);
    this.map.fitBounds(bounds);
};

function createMarker (data) {
    return new L.CircleMarker(new L.LatLng(data.lat, data.lon), {
        clickable: false,
        radius: 2,
        fill: true,
        fillColor: '#333399',
        stroke: false,
        fillOpacity: 0.7
    });
}