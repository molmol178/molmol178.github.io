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
        // console.log("show json \n\n\n" + data[i].geocode.lng);
        marker = new Y.Marker(new Y.LatLng(data[i].geocode.lat, data[i].geocode.lng),{title: data[i].shopname});
        marker.bindInfoWindow('<img src='+ data[i].display_url +' width=20%><br>tanreisanのLike数：'+ data[i].edge_media_preview_like.count + '<br><pre>' + data[i].text + '</pre>');
        marker.bind('click', markerClicked(data[i]));
        markers.push(marker);
    }
    ymap.addFeatures(markers);
}

function markerClicked(data){
    // alert(data.shopname);
    // todo: マーカーを押したときの動作をどうするか．テキストを含めるとパソコンじゃないと見れない．店名と画像だけだすとか．モーダルウィンドウを仕込んどくとか．スマホでみたときでもうまく見れるようにしたい．
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
     
    navigator.geolocation.watchPosition(function(position){
     
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var latlng = new Y.LatLng(lat, lng);

        ymap.drawMap(latlng, 15, Y.LayerSetId.NORMAL);
    });
    loadJson("src/add_shopname_tanreisan.json", parseJson, "success to load json \n\n\n", ymap);
}
