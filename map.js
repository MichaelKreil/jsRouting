function Map(container) {
    container.id = 'map';

    this.map = new L.Map('map').setView([52.52, 13.37], 17);

    new L.TileLayer(
        'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-streets/{z}/{x}/{y}.png',
        { attribution: 'Map tiles &copy; <a href="http://mapbox.com">MapBox</a>', maxZoom: 17 }
    ).addTo(this.map);

    this.layer = new L.LayerGroup();
    this.layer.addTo(this.map);
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

function createMarker (data, isBig) {
    // stop - props:    stop_id,stop_code,stop_name,stop_desc,stop_lat,stop_lon,zone_id,stop_url,location_type,parent_station


    if (isBig) {
        var icon = new L.DivIcon({
            className: 'marker',
            html: '<div class="label-small">' +
                '<div class="icon16" style="background-color:#333399;"></div>' +
                '<div class="text">' + ellipsis(data.stop_name, 35) + '</div>' +
            '</div>',
            iconSize: [50, 50],
            iconAnchor: [25, 25]
        });
        return new L.Marker(new L.LatLng(data.stop_lat, data.stop_lon), { icon: icon });
    }

    return new L.CircleMarker(new L.LatLng(data.stop_lat, data.stop_lon), {
        clickable: true,
        size: 50,
        fill: true,
        fillColor: '#333399',
        stroke: false,
        fillOpacity: 0.8
    });
}