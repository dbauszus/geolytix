var southWest = L.latLng(51.35, -0.4),
    northEast = L.latLng(51.65, 0.2),
    bounds = L.latLngBounds(southWest, northEast);

const map_geodata = L.map('map_geodata', {
    scrollWheelZoom: false,
    zoomControl: false,
    maxBounds: bounds,
    minZoom: 12,
    maxZoom: 17
}).setView([51.50, -0.1], 13);

const geodata__btnZoomIn = $('.geodata__content > .btnZoomIn');
geodata__btnZoomIn.click(function() {
    map_geodata.setZoom(map_geodata.getZoom() + 1);
});

const geodata__btnZoomOut = $('.geodata__content > .btnZoomOut');
geodata__btnZoomOut.click(function() {
    map_geodata.setZoom(map_geodata.getZoom() - 1);
});

var currentDataset = 'seamless_locales';
$('.geodata__content > .btnFullScreen').click(function() {
    window.location = '/map?' + currentDataset;
});


const geodataScrollyFirst = $('.geodata__scrolly > div').first();
const geodataPricing = $('.geodata__pricing');
const geodataFAQ = $('.geodata__faq');

function selectGeodata(_this, _i){
    _this.siblings().removeClass('selected');
    _this.addClass('selected');
    currentDataset = _this.attr('id');
    removeLayer();
    map_geodata.off('mousemove');
    map_geodata.off('click');
    geodataScrollyFirst.animate({'marginTop': 619 * -_i});
    currentDataset == 'pricing' ? geodataPricing.show() : geodataPricing.hide();
    currentDataset == 'faq' ? geodataFAQ.show() : geodataFAQ.hide();
}

function removeLayer(){
    map_geodata.eachLayer(function (layer) {
        map_geodata.removeLayer(layer);
    });
}

var xhr,
    layerHover,
    featureHover;

const seamless_locales = $('#seamless_locales');
seamless_locales.click(function() {
    selectGeodata($(this),0);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);

    var layer = new L.NonTiledLayer.WMS("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        version: '1.3',
        opacity: 1.0,
        layers: 'seamless_locales',
        format: 'image/png',
        transparent: true,
        pane: 'tilePane',
        zIndex: 3,
        styles: 'seamless_locales'
    }).addTo(map_geodata);

    map_geodata.on('mousemove', function (e) {
        hoverSelect(e, map_geodata, layer, document.getElementById('seamless_locales_info'))
    });
});

seamless_locales.trigger('click');


$('#retail_points').click(function() {
    selectGeodata($(this),1);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);

    var cqlFilterArray = ["brand='asda'","brand='morrisons'","brand='sainsburys'","brand='tesco'"],
        cqlFilter = cqlFilterArray.join(' OR ');

    var layer = L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        version: '1.3',
        layers: 'retailpoints',
        format: 'image/png',
        transparent: true,
        styles: 'retailpoints',
        CQL_FILTER: cqlFilter
    }).addTo(map_geodata);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map_geodata);

    map_geodata.on('click', function(e){clickSelect(e, map_geodata, layer, cqlFilter)});

    var selectBtn = $('.retail_points .legend span');
    selectBtn.click(function(){
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            cqlFilterArray.push("brand='" + $(this).attr('id') + "'");
        } else {
            cqlFilterArray.splice($.inArray("brand='" + $(this).attr('id') + "'", cqlFilterArray),1);
        }

        cqlFilter = cqlFilterArray.join(' OR ');

        removeLayer();

        L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);

        if (cqlFilter.length > 0) {
            L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
                version: '1.3',
                layers: 'retailpoints',
                format: 'image/png',
                transparent: true,
                styles: 'retailpoints',
                CQL_FILTER: cqlFilter
            }).addTo(map_geodata);
        }

        L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map_geodata);
    });

});


$('#retail_places').click(function() {
    selectGeodata($(this), 2);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'retailplaces_point',
        format: 'image/png',
        transparent: true,
        styles: 'retailplaces_point',
        maxZoom: 12
    }).addTo(map_geodata);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'retailplaces_outline',
        format: 'image/png',
        transparent: true,
        styles: 'retailplaces_outline',
        minZoom: 13,
        maxZoom: 15
    }).addTo(map_geodata);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'retailplaces_shopping',
        format: 'image/png',
        transparent: true,
        styles: 'retailplaces_shopping',
        minZoom: 14,
        maxZoom: 17
    }).addTo(map_geodata);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'retailplaces_build',
        format: 'image/png',
        transparent: true,
        styles: 'retailplaces_build',
        minZoom: 14,
        maxZoom: 17
    }).addTo(map_geodata);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'retailplaces_pitch',
        format: 'image/png',
        transparent: true,
        styles: 'retailplaces_pitch',
        minZoom: 16,
        maxZoom: 17
    }).addTo(map_geodata);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map_geodata);
});


$('#public_transport').click(function() {
    selectGeodata($(this), 3);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'transport_bus',
        format: 'image/png',
        transparent: true,
        styles: 'transport_bus'
    }).addTo(map_geodata);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'transport_rail',
        format: 'image/png',
        transparent: true,
        styles: 'transport_rail'
    }).addTo(map_geodata);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'transport_tube',
        format: 'image/png',
        transparent: true,
        styles: 'transport_tube'
    }).addTo(map_geodata);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map_geodata);
});


$('#postal_geom').click(function() {
    selectGeodata($(this), 4);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'postal_district',
        format: 'image/png',
        transparent: true,
        styles: 'postal_district_nolabel',
        minZoom: 14,
        maxZoom: 14
    }).addTo(map_geodata);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'postal_sector',
        format: 'image/png',
        transparent: true,
        styles: 'postal_sector_nolabel',
        minZoom: 15,
        maxZoom: 15
    }).addTo(map_geodata);

    new L.NonTiledLayer.WMS("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        opacity: 1.0,
        layers: 'postal_area',
        format: 'image/png',
        transparent: true,
        pane: 'tilePane',
        zIndex: 3,
        styles: 'postal_area',
        maxZoom: 14
    }).addTo(map_geodata);

    new L.NonTiledLayer.WMS("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        opacity: 1.0,
        layers: 'postal_district',
        format: 'image/png',
        transparent: true,
        pane: 'tilePane',
        zIndex: 3,
        styles: 'postal_district',
        minZoom: 15,
        maxZoom: 15
    }).addTo(map_geodata);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'postal_code',
        format: 'image/png',
        transparent: true,
        styles: 'postal_code',
        minZoom: 17
    }).addTo(map_geodata);

    new L.NonTiledLayer.WMS("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        opacity: 1.0,
        layers: 'postal_sector',
        format: 'image/png',
        transparent: true,
        pane: 'tilePane',
        zIndex: 3,
        styles: 'postal_sector',
        minZoom: 16
    }).addTo(map_geodata);
});


$('#town_suburbs').click(function() {
    selectGeodata($(this), 5);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);

    var layer = new L.NonTiledLayer.WMS("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        version: '1.3',
        opacity: 1.0,
        layers: 'town_suburb',
        format: 'image/png',
        transparent: true,
        pane: 'tilePane',
        zIndex: 3,
        styles: 'town_suburb'
    }).addTo(map_geodata);

    map_geodata.on('mousemove', function(e){hoverSelect(e, map_geodata, layer, document.getElementById('town_suburb_info'))});

});


$('#education').click(function() {
    selectGeodata($(this), 6);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'university_building',
        format: 'image/png',
        transparent: true,
        styles: 'university_building'
    }).addTo(map_geodata);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map_geodata);
});


$('#work_places').click(function() {
    selectGeodata($(this), 7);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
});


$('#poi').click(function() {
    selectGeodata($(this), 8);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);

    var cqlFilterArray = ["poi_type='carpark'"],
        cqlFilter = cqlFilterArray[0];

    var layer = L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        version: '1.3',
        layers: 'poi',
        format: 'image/png',
        transparent: true,
        styles: 'poi',
        CQL_FILTER: cqlFilter
    }).addTo(map_geodata);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map_geodata);


    map_geodata.on('click', function(e){clickSelect(e, map_geodata, layer, cqlFilter)});


    var poiBtn = $('.poi .legend span');
    poiBtn.click(function(){
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            cqlFilterArray.push("poi_type='" + $(this).attr('id') + "'");
        } else {
            cqlFilterArray.splice($.inArray("poi_type='" + $(this).attr('id') + "'", cqlFilterArray),1);
        }

        cqlFilter = cqlFilterArray.join(' OR ');

        removeLayer();

        L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);

        if (cqlFilter.length > 0) {
            L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
                layers: 'poi',
                format: 'image/png',
                transparent: true,
                styles: 'poi',
                CQL_FILTER: cqlFilter
            }).addTo(map_geodata);
        }

        L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map_geodata);
    });
});


$('#residential').click(function() {
    selectGeodata($(this), 9);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
});


$('#uk_admin').click(function() {
    selectGeodata($(this), 10);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'admin_uk_oa',
        format: 'image/png',
        transparent: true,
        styles: 'admin_uk_oa',
        minZoom: 15
    }).addTo(map_geodata);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'admin_uk_soa',
        format: 'image/png',
        transparent: true,
        styles: 'admin_uk_soa',
        minZoom: 14
    }).addTo(map_geodata);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'admin_uk_msoa',
        format: 'image/png',
        transparent: true,
        styles: 'admin_uk_msoa',
        minZoom: 13,
        maxZoom: 15
    }).addTo(map_geodata);

    new L.NonTiledLayer.WMS("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        opacity: 1.0,
        layers: 'admin_uk_lad',
        format: 'image/png',
        transparent: true,
        pane: 'tilePane',
        zIndex: 3,
        styles: 'admin_uk_lad',
        minZoom: 12,
        maxZoom: 14
    }).addTo(map_geodata);
});


$('#property').click(function() {
    selectGeodata($(this), 11);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
});


$('#road_network').click(function() {
    selectGeodata($(this), 12);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);

    L.tileLayer.wms("https://gsx.geolytix.net/geoserver/geolytix/wms", {
        layers: 'osm_roads',
        format: 'image/png',
        transparent: true,
        styles: 'osm_roads'
    }).addTo(map_geodata);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png').addTo(map_geodata);
});


$('#media_com').click(function() {
    selectGeodata($(this), 13);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
});


$('#physical').click(function() {
    selectGeodata($(this), 14);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png').addTo(map_geodata);
});


$('#pricing').click(function() {
    selectGeodata($(this), 15);


});


$('#faq').click(function() {
    selectGeodata($(this), 15);


});


function hoverSelect(e, map, layer, infoTable) {
    var pHover = turf.point([e.latlng.lng, e.latlng.lat]);
    if (!featureHover || !turf.inside(pHover, featureHover)) {
        wmsGetHoverFeatureInfo(
            getFeatureInfoUrl(
                map,
                layer,
                e.latlng,
                {
                    'propertyName': 'geoj,infoj'
                }
            ),
            infoTable)
    }
}


function clickSelect(e, map, layer, cqlFilter) {
    wmsGetClickFeatureInfo(
        getFeatureInfoUrl(
            map,
            layer,
            e.latlng,
            {
                'propertyName': 'latlonj,infoj',
                'CQL_FILTER': cqlFilter
            }
        )
    )
}

const proj_4326 = proj4.Proj('EPSG:4326');
const proj_3857 = proj4.Proj('EPSG:3857');
function getFeatureInfoUrl(map, layer, latlng, params) {
    var url = layer._wmsUrl || layer._url,
        point = map.latLngToContainerPoint(latlng, map.getZoom()),
        size = map.getSize(),
        bounds = map.getBounds(),
        sw = proj4.transform(proj_4326, proj_3857, proj4.toPoint([bounds.getWest(), bounds.getSouth()])),
        ne = proj4.transform(proj_4326, proj_3857, proj4.toPoint([bounds.getEast(), bounds.getNorth()])),
        defaultParams = {
            request: 'GetFeatureInfo',
            service: 'WMS',
            srs: layer._crs.code,
            version: layer._wmsVersion,
            bbox: [sw.x, sw.y, ne.x, ne.y],
            height: size.y,
            width: size.x,
            layers: layer.options.layers,
            query_layers: layer.options.layers,
            info_format: 'application/json'
        };
    params = L.Util.extend(defaultParams, params || {});
    params[params.version === '1.3' ? 'i' : 'x'] = point.x;
    params[params.version === '1.3' ? 'j' : 'y'] = point.y;
    return url + L.Util.getParamString(params, url, true);
}

function wmsGetHoverFeatureInfo(url, infoTable){
    if (xhr) xhr.abort();
    xhr = $.ajax({
        url: url,
        success: function (data) {
            createHoverFeature(data.features[0].properties.geoj);
            populateInfoTable(JSON.parse(data.features[0].properties.infoj), infoTable);
        }
    });
}

function createHoverFeature(geom) {
    if (layerHover) map_geodata.removeLayer(layerHover);
    featureHover = {
        'type': 'Feature',
        'properties': {},
        'geometry': JSON.parse(geom)
    };
    layerHover = L.geoJson(featureHover, {
        style: function () {
            return {
                color: '#079e00',
                fillOpacity: 0.1
            };
        }
    }).addTo(map_geodata);
}

function populateInfoTable(infoj, infoTable){
    infoTable.innerHTML = '';
    var r = infoTable.insertRow(infoTable.rows.length);
    r.insertCell(0).innerHTML = 'Info';
    Object.keys(infoj).map(function(Okey) {
        if (infoj[Okey]) {
            r = infoTable.insertRow(infoTable.rows.length);
            r.insertCell(0).innerHTML = Okey;
            r.insertCell(1).innerHTML = infoj[Okey];
        }
    })
}




function wmsGetClickFeatureInfo(url){
    if (xhr) xhr.abort();
    xhr = $.ajax({
        url: url,
        success: function (data) {
            if (data.features.length > 0) {
                var infoj = JSON.parse(data.features[0].properties.infoj);
                if (infoj){
                    L.popup()
                        .setLatLng(JSON.parse(data.features[0].properties.latlonj))
                        .setContent(buildHtmlTable(infoj))
                        .openOn(map_geodata);
                }
            }
        }
    });
}

function buildHtmlTable(infoj) {
    var table = document.createElement('table');
    Object.keys(infoj).map(function(Okey) {
        if (infoj[Okey]) {
            var r = table.insertRow(table.rows.length);
            r.insertCell(0).innerHTML = Okey;
            r.insertCell(1).innerHTML = infoj[Okey];
        }
    });
    return table;
}
