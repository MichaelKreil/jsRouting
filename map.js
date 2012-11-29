function Map(container) {
    container.id = 'map';

    this.map = new L.Map('map').setView([52.52, 13.37], 17);

    new L.TileLayer(
        'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-streets/{z}/{x}/{y}.png',
        { attribution: 'Map tiles &copy; <a href="http://mapbox.com">MapBox</a>', maxZoom: 17 }
    ).addTo(this.map);

    this.layer = new L.LayerGroup();
    this.layer.addTo(this.map);

    this.selectedMarker = null;
}

Map.prototype.setData = function (data) {
    var bounds = [];
    this.layer.clearLayers();
// removelayer
    data.forEach(function (poi) {
        bounds.push([poi.lat, poi.lon]);
        var marker = new Marker(poi);
        marker.on('click', function (e) {
            this.deactivateAllMarkers();
            marker.activate();
            this.selectedMarker = marker;
        }.bind(this));
        marker.addTo(this.layer);
    }.bind(this));

// addlayer

    if (this.selectedMarker) {
        this.selectedMarker.activate();
    }

    bounds.push([favData[i].lat, favData[i].lon]);
    this.map.fitBounds(bounds);
};

Map.prototype.deactivateAllMarkers = function () {
    if (this.selectedMarker) {
        this.selectedMarker.deactivate();
        this.selectedMarker = null;
    }
};


function Marker (data, isBig) {
    var marker;

    if (isBig) {
        var icon = new L.DivIcon({
            className: 'marker',
            html: '<div class="label-small">' +
                '<div class="icon16" style="background-color#333399;"></div>' +
                '<div class="text">' + ellipsis(data.name, 35) + '</div>' +
            '</div>',
            iconSize: [50, 50],
            iconAnchor: [25, 25]
        });
        marker = new L.Marker(new L.LatLng(data.lat, data.lon), { icon: icon });
    } else {
        marker = new L.SquareMarker(new L.LatLng(data.lat, data.lon), {
            clickable: true,
            size: 50,
            fill: true,
            fillColor: data.color,
            stroke: false,
            fillOpacity: 0.8
        });
    }

    marker.on('click', function () {
    });

    marker.addTo(layer);

    this.marker = marker;

    return marker;
}

Marker.prototype.activate = function () {
    var m = this.marker;
    m.setZIndexOffset && m.setZIndexOffset(1000);
    m._icon && m._icon.classList.add('active');
};

Marker.prototype.deactivate = function () {
    var m = this.marker;
    m.setZIndexOffset && m.setZIndexOffset(0);
    m._icon && m._icon.classList.remove('active');
};
