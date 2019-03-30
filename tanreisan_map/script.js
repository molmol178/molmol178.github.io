function xhrSuccess() { 
    this.callback.apply(this, this.arguments); 
}

function xhrError() { 
    console.error(this.statusText); 
}

function loadJson(filePath, callback){
    var req = new XMLHttpRequest();
    req.callback = callback;
    req.arguments = Array.prototype.slice.call(arguments, 2);
    req.onload = xhrSuccess;
    req.onerror = xhrError;
    req.open("GET", filePath, true);
    req.send(null);
}


function parseJson(message, ymap){
    console.log(message);
    var data = JSON.parse(this.responseText);
    var len = Object.keys(data).length;
    var markers = [];
    var marker;
    for(var i = 1; i <= len; i++){
        var item = data[i].edge_media_preview_like.count;
        if (item < 300 && item >= 0){
            marker =  addMarker(marker, data[i], 'src/pin_purple.png');
        }else if (item < 400 && item >= 300){
            marker = addMarker(marker, data[i], 'src/pin_blue.png');
        }else if (item < 600 && item >= 400){
            marker = addMarker(marker, data[i], 'src/pin_sky.png');
        }else if (item < 800 && item >= 600){
            marker = addMarker(marker, data[i], 'src/pin_pink.png');
        }else {
            marker = addMarker(marker, data[i], 'src/pin_red.png');
        }
        markers.push(marker);
    }
    ymap.addFeatures(markers);
}


function addMarker(marker, data, pin_color){
    marker = new Y.Marker(
        new Y.LatLng(data.geocode.lat, data.geocode.lng)
        , {icon: new Y.Icon(pin_color)}
        , {title: data.shopname}
    );
    marker.bindInfoWindow('\
        <img src='+ data.display_url +' width=50%><br>\
        2019/3/25時点でのtanreisanのLike数：'+ data.edge_media_preview_like.count + '<br><br>\
        '+ data.shopname + '<br>\
        <a href="https://www.instagram.com/p/' + data.shortcode + '">tanreisanの投稿へ</a><br>\
        <a href="https://www.google.com/maps?q=loc:' + data.geocode.lat+ ','+ data.geocode.lng + '">google mapで表示</a><br>\
         ');
    return marker;
}

window.onload = function(){

    var ymap = new Y.Map("map",{
        configure:{
            doubleClickZoom : true,
            scrollWheelZoom : true,
            singleClickPan : true,
            dragging : true
        }
    }
    );
    ymap.addControl(new Y.LayerSetControl());
    ymap.addControl(new Y.SliderZoomControlVertical());
    ymap.addControl(new Y.HomeControl());
     
    ymap.drawMap(new Y.LatLng(35.6719483, 139.7413908), 15, Y.LayerSetId.NORMAL);
    // });
    loadJson("src/add_shopname_tanreisan.json", parseJson, "success to load json \n\n\n", ymap);

}