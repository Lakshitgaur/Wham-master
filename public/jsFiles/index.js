var iconBase = 'https://maps.google.com/mapfiles/kml/';
var startLat="";
var startLong="";
var globalResponse="";
var currentPageCount=1;
var map;
var infoWindow;
var bounds="";
var currentlocation;
var Markers ='';
var page=1;
var listener="";

$("document").ready(function(){
    initMap();
   /*$.ajax({
       url:"https://maps.googleapis.com/maps/api/js?libraries=places&language=en&key=AIzaSyBtI7AN64cEY4OHkRyaPJd_RwiuDe_pA-o",
       success:initMap()
    });*/
});
function getMarkerDisp(obj,i){
    var listing="";
    var img;
    // alert(obj.id);
    if(obj.img != "#"){
        img =  "<img src="+obj.img+">" ;
    }else{
        img = "<img style='height: 40px ; width: 40px' src=images/no-image.png>" ;
    }
    if(obj.id == null){
        listing=obj.title;
    }else{
        listing+=
            "<a href=EventDetails.html?event="+obj.id +"  style='color: #676767' id="+obj.id+" class='listing'><div class='listImg col-lg-1 pull-left'>" +
            img +
            "</div>" + "<div class='col-lg-pull-3'> " +
            "<div class='listTitle'><p class='markerText' style='font-size: x-small ; text-align: center ;font-weight: bold'>"+obj.title +
            " | "+obj.add+
            "</p><p style='text-align: center ; font-size: x-small' class='listCity'>"+obj.city+"</p></div></div></div></a>";

    }

    return listing;
}


var map;
function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        document.getElementById('map').html("Geolocation is not supported by this browser.");
    }
}
function showPosition(position){
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: position.coords.latitude, lng: position.coords.longitude},
        zoom: 12
    });

    infowindow = new google.maps.InfoWindow({
        maxWidth: 200
    });

    var mypos ='{"lat":'+position.coords.latitude+',"lng":'+position.coords.longitude+',"title":"'+"Your Are Here !!!"+'","city":"","add":"","id":"#","img":"#"}';

    localStorage.setItem("mypos",mypos);

    var marker = new google.maps.Marker({
        position: {lat: position.coords.latitude, lng: position.coords.longitude},
        map: map,
        icon: iconBase + 'paddle/go-lv.png',
        title: 'You Are Here !'
    });

    google.maps.event.addListener(marker, 'click', (function (marker) {
        return function () {
            infowindow.setContent(getMarkerDisp(marker, 'You Are Here !'));
            infowindow.open(map, marker);
        }
    })(marker));
    console.log(mypos);
    var Markers ='';
    var keywords='';
    currentlocation=position.coords.latitude+","+position.coords.longitude;
    var date="This Week";
    bounds = new google.maps.LatLngBounds();

    $.ajax({
        /*url:"http://api.eventful.com/jsonp/events/search?&where="+currentlocation+"&within=5&units=mi&date="+date+"&app_key=hPRCcBGTQJrVwC6K",
         */
        url:"http://api.eventful.com/jsonp/events/search?keywords=&where="+currentlocation+"&within=5&units=mi&app_key=hPRCcBGTQJrVwC6K",
        dataType:'jsonp',
        contentType: 'charset=UTF-8',
        success: function(response){
            var pages=response.page_count;
            localStorage.setItem("page",1);
            // for(var p=0;p<pages;p++){
           // console.log(response.total_items);
            var events=response.events.event;
            globalResponse=response;
            for(var e in events){
                var event=events[e];
                var lat= event.latitude;
                var long=event.longitude;
                var title=event.title;
                var city=event.city_name;
                var add=event.venue_address;
                var event_id=event.id;
                var img="#";
                if(event.image != null){
                    img=event.image.thumb.url;
                }
                var url=event.url;
                Markers=Markers+'{"lat":'+lat+',"lng":'+long+',"title":"'+title.replace(/"/g,'')+'","city":"'+city+'","add":"'+add+'","id":"'+event_id+'","img":"'+img+'"},';
            }
            // }

            Markers=Markers.slice(0,Markers.length-1);

            Markers="["+Markers+"]";
            console.log(Markers);

            var obj=jQuery.parseJSON(Markers);
            populateListings(obj);


            //alert(obj.length);
            for(var i=0;i<obj.length;i++){

                var marker = new google.maps.Marker({
                    position:new google.maps.LatLng(obj[i].lat,obj[i].lng),
                    map:map,
                    animation: google.maps.Animation.DROP,
                    title: obj[i].title,
                    content: obj[i].title,
                    //icon: iconBase + 'info-i_maps.png'
                });

                google.maps.event.addListener(marker,'click',(function(marker,i){

                    return function(){
                        infowindow.setContent(getMarkerDisp(obj[i],i));
                        infowindow.open(map,marker);
                    }
                })(marker,i));


            }
            //extend the bounds to include each marker's position
            bounds.extend(marker.position);

            //now fit the map to the newly inclusive bounds
            map.fitBounds(bounds);

            //(optional) restore the zoom level after the map is done scaling
            var listener = google.maps.event.addListener(map, "idle", function () {
                map.setZoom(12);
                google.maps.event.removeListener(listener);
            });
        }
    });

    $("#search").click(function(){
        category=$("#cat").val();
        loc=$("#loc").val();
        console.log("In search "+category+" "+loc);
        showNewPositions(position);
    });


    function showNewPositions(position){
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: position.coords.latitude, lng: position.coords.longitude},
            zoom: 12
        });
        var category=$("#cat").val();
        var loc=$("#loc").val();

        bounds = new google.maps.LatLngBounds();
        var marker = new google.maps.Marker({
            position: {lat: position.coords.latitude, lng: position.coords.longitude},
            map: map,
            icon: iconBase + 'paddle/go-lv.png',
            title: 'You Are Here !'
        });
        var infowindow = new google.maps.InfoWindow({
            maxWidth:200
        });

        google.maps.event.addListener(marker, 'click', (function (marker) {
            return function () {
                infowindow.setContent(getMarkerDisp(marker, 'You Are Here !'));
                infowindow.open(map, marker);
            }
        })(marker));

        var mypos ='{"lat":'+position.coords.latitude+',"lng":'+position.coords.longitude+',"title":"'+"Your Are Here"+'","city":"","add":"","id":"#","img":"#"}';
        //var mypos = '{'+position.coords.latitude+','+ position.coords.longitude+',"Your Location"}';

        var keywords='';
        var currentlocation=position.coords.latitude+","+position.coords.longitude;
        console.log("currentLocation"+currentlocation);
       // console.log("Position"+position);
        var date="This Week";
        //console.log(location);
        if(loc == ""){
            console.log(loc);
            loc = currentlocation;
        }
        console.log(loc)
        //console.log("http://api.eventful.com/jsonp/events/search?keywords="+"deerhunter"+"&location="+"boston"+"&within=5&app_key=hPRCcBGTQJrVwC6K");
        $.ajax({
            url:"http://api.eventful.com/jsonp/events/search?&keywords="+category+"&location="+loc+"&where="+currentlocation+"&within=5&units=mi&date="+date+"&app_key=hPRCcBGTQJrVwC6K",

            // url:"http://api.eventful.com/jsonp/events/search?keywords="+"deerhunter"+"&location="+"boston"+"&within=5&app_key=hPRCcBGTQJrVwC6K",
            dataType:'jsonp',
            contentType: 'charset=UTF-8',
            success: function(response){

                var pages="";
                //for(var p=0;p<pages;p++){
                var events="";

                if (response.total_items == "0"){
                    $("#listings").html("No Events Found! Try Again.");
                }
               else if(response.total_items == "1"){
                    response.page_count;
                    localStorage.setItem("page",response.page_number);
                    events=response.events.event;
                    //   for(var e in events){
                    var Markers = "";
                    var event=events;
                    console.log(event);
                    var lat= event.latitude;
                    var long=event.longitude;
                    var title=event.title;
                    var city=event.city_name;
                    var add=event.venue_address;
                    var event_id=event.id;
                    var img="#";
                    if(event.image != null){
                        img=event.image.thumb.url;
                    }
                    var url=event.url;
                    Markers=Markers+'{"lat":'+lat+',"lng":'+long+',"title":"'+title.replace(/"/g,'')+'","city":"'+city+'","add":"'+add+'","id":"'+event_id+'","img":"'+img+'"},';
                    //   }
                    //  }
                    Markers=Markers.slice(0,Markers.length-1);
                    // Markers=Markers+mypos
                    Markers="["+Markers+"]";
                    console.log(Markers);

                    //var obj=Markers;
                    var obj=jQuery.parseJSON(Markers);
                    populateNewListings(obj);
                    //alert(obj.length);
                    for(var i=0;i<obj.length;i++){
                        //   alert(obj[i].lat+"  "+obj[i].lng+" "+obj[i].title+ marker);
                        var marker = new google.maps.Marker({
                            position:new google.maps.LatLng(obj[i].lat,obj[i].lng),
                            map:map,
                            title: obj[i].title,
                            content: obj[i].title,
                            animation: google.maps.Animation.DROP,
                        });


                        google.maps.event.addListener(marker,'click',(function(marker,i){
                            return function(){
                                infowindow.setContent(getMarkerDisp(obj[i],i));
                                infowindow.open(map,marker);
                            }
                        })(marker,i));
                    }

                    //extend the bounds to include each marker's position
                    bounds.extend(marker.position);

                    //now fit the map to the newly inclusive bounds
                    map.fitBounds(bounds);

                    //(optional) restore the zoom level after the map is done scaling
                    var listener = google.maps.event.addListener(map, "idle", function () {
                        map.setZoom(12);
                        google.maps.event.removeListener(listener);
                    });
                    $("#moreResults").attr("disabled","disabled");
                }else{
                    response.page_count;
                    localStorage.setItem("page",response.page_number);
                    events=response.events.event;
                    console.log(events)
                    $("#moreResults").removeAttr("disabled");

                    globalResponse= response;
                    var Markers = "";
                    for(var e in events){
                        var event=events[e];
                        console.log(event);
                        var lat= event.latitude;
                        var long=event.longitude;
                        var title=event.title;
                        var city=event.city_name;
                        var add=event.venue_address;
                        var event_id=event.id;
                        var img="#";
                        if(event.image != null){
                            img=event.image.thumb.url;
                        }
                        var url=event.url;
                        Markers=Markers+'{"lat":'+lat+',"lng":'+long+',"title":"'+title.replace(/"/g,'')+'","city":"'+city+'","add":"'+add+'","id":"'+event_id+'","img":"'+img+'"},';
                    }
                    //  }
                    Markers=Markers.slice(0,Markers.length-1);
                    // Markers=Markers+mypos
                    Markers="["+Markers+"]";
                    console.log(Markers);

                    //var obj=Markers;
                    var obj=jQuery.parseJSON(Markers);
                    populateNewListings(obj);
                    //alert(obj.length);
                    for(var i=0;i<obj.length;i++){
                        //   alert(obj[i].lat+"  "+obj[i].lng+" "+obj[i].title+ marker);
                        var marker = new google.maps.Marker({
                            position:new google.maps.LatLng(obj[i].lat,obj[i].lng),
                            map:map,
                            title: obj[i].title,
                            content: obj[i].title,
                            animation: google.maps.Animation.DROP,
                        });


                        google.maps.event.addListener(marker,'click',(function(marker,i){
                            return function(){
                                infowindow.setContent(getMarkerDisp(obj[i],i));
                                infowindow.open(map,marker);
                            }
                        })(marker,i));
                    }

                    //extend the bounds to include each marker's position
                    bounds.extend(marker.position);

                    //now fit the map to the newly inclusive bounds
                    map.fitBounds(bounds);

                    //(optional) restore the zoom level after the map is done scaling
                    var listener = google.maps.event.addListener(map, "idle", function () {
                        map.setZoom(12);
                        google.maps.event.removeListener(listener);
                    });
                }

            }
        });
    }
}

function moreResults(){
    if(parseInt(globalResponse.total_items)<=10){
        $("#moreResults").attr("disabled","disabled");
    }else{
        //var totalItems=globalResponse.total_items;
        var page= parseInt(localStorage.getItem("page"))+parseInt("1");
        var page_count=globalResponse.page_count;
        //currentPageCount=currentPageCount+1;
        console.log("Last Page:: "+page);
        if(currentPageCount<=page){

            $("#moreResults").removeAttr("disabled");

            var category=$("#cat").val();
            var loc=$("#loc").val();
            console.log(page);
            localStorage.setItem("page",page);
            console.log("http://api.eventful.com/jsonp/events/search?&keywords=" + category + "&location=" + loc + "&where=" + currentlocation + "&within=5&units=mi&app_key=hPRCcBGTQJrVwC6K&page_number=" + localStorage.getItem("page"));

            $.ajax({
                url: "http://api.eventful.com/jsonp/events/search?&keywords=" + category + "&location=" + loc + "&where=" + currentlocation + "&within=5&units=mi&app_key=hPRCcBGTQJrVwC6K&page_number=" + localStorage.getItem("page"),
                dataType: 'jsonp',
                contentType: 'charset=UTF-8',
                success: function (response) {
                    if(response.total_items != "0"){
                        globalResponse=response;
                        /* console.log(response);
                         console.log(response.total_items);*/
                        var pages = response.page_number;
                        //for(var p=0;p<pages;p++){
                        var events = response.events.event;
                        var Markers="";
                        for(var e in events){
                            var event=events[e];
                            // console.log(event);
                            var lat= event.latitude;
                            var long=event.longitude;
                            var title=event.title;
                            var city=event.city_name;
                            var add=event.venue_address;
                            var event_id=event.id;
                            var img="#";
                            if(event.image != null){
                                img=event.image.thumb.url;
                            }
                            var url=event.url;
                            Markers=Markers+'{"lat":'+lat+',"lng":'+long+',"title":"'+title.replace(/"/g,'')+'","city":"'+city+'","add":"'+add+'","id":"'+event_id+'","img":"'+img+'"},';
                        }
                        //  }
                        Markers=Markers.slice(0,Markers.length-1);
                        // Markers=Markers+mypos
                        Markers="["+Markers+"]";
                        console.log(Markers);


                        var obj=jQuery.parseJSON(Markers);
                        populateListings(obj);

                        for(var i=0;i<obj.length;i++){

                            var marker = new google.maps.Marker({
                                position:new google.maps.LatLng(obj[i].lat,obj[i].lng),
                                map:map,
                                animation: google.maps.Animation.DROP,
                                title: obj[i].title,
                                content: obj[i].title,
                                //icon: iconBase + 'info-i_maps.png'
                            });

                            google.maps.event.addListener(marker,'click',(function(marker,i){

                                return function(){
                                    infowindow.setContent(getMarkerDisp(obj[i],i));
                                    infowindow.open(map,marker);
                                }
                            })(marker,i));


                        }
                        //extend the bounds to include each marker's position
                        bounds.extend(marker.position);

                        //now fit the map to the newly inclusive bounds
                        map.fitBounds(bounds);

                        //(optional) restore the zoom level after the map is done scaling
                        listener = google.maps.event.addListener(map, "idle", function () {
                            map.setZoom(12);
                            google.maps.event.removeListener(listener);
                        });
                    }

                }
            });

        }

    }
}


$(document).ready(function(){
    $('.listing').click(function(){
        //alert('in jquery')
        var contentId =$(this).attr('id');
        alert(contentId);
        $.ajax({
            url: "http://api.eventful.com/jsonp/events/get?id="+id+"&app_key=hPRCcBGTQJrVwC6K",
            dataType: 'jsonp',
            contentType: 'charset=UTF-8',
            success: function (response) {
                alert(response);
            }
        });
    });
});

function populateListings(obj){
    var listing=$("#listings").html();
    console.log(obj)
    for(var i=0;i<obj.length;i++){
        var img;
        var eventTitle = "";
        var eventAdd = "";
        console.log(obj[i].add.length);
        if (obj[i].add.length > 10){
            eventAdd = obj[i].add.substring(0,10) + "...";

        }else{
            eventAdd = obj[i].add ;
        }

        if (obj[i].title.length > 20){
            eventTitle = obj[i].title.substring(0,20) + "...";

        }else{
            eventTitle = obj[i].title ;
        }
        if(obj[i].img != "#"){
            img =  "<img src="+obj[i].img+">" ;
        }else{
            img = "<img style='height: 40px ; width: 40px ;' src=images/no-image.png>" ;
        }
        listing+= "<div style='border-bottom: 1px solid white; padding-top: 10px;' id=list"+i+">"+
            "<a href=EventDetails.html?event="+obj[i].id +"  style='color: #676767' id="+obj[i].id+" ><div class='listImg col-lg-1 pull-left'>" +
            img +
            "</div>" + "<div class='col-lg-pull-3'> " +
            "<div class='listTitle'><p style='font-size: x-small ; text-align: center ;font-weight: bold'>"+eventTitle  +
            " | "+eventAdd+
            "</p><p style='text-align: center ; font-size: x-small' class='listCity'>"+obj[i].city+"</p></div></div></div></a></div>";
    }
    $("#listings").html(listing);
}

function populateNewListings(obj){
    var listing="";
    console.log(obj)
    for(var i=0;i<obj.length;i++){
        var img;
        var eventTitle = "";
        var eventAdd = "";
        console.log(obj[i].add.length);
        if (obj[i].add.length > 10){
            eventAdd = obj[i].add.substring(0,10) + "...";

        }else{
            eventAdd = obj[i].add ;
        }

        if (obj[i].title.length > 20){
            eventTitle = obj[i].title.substring(0,20) + "...";

        }else{
            eventTitle = obj[i].title ;
        }
        if(obj[i].img != "#"){
            img =  "<img src="+obj[i].img+">" ;
        }else{
            img = "<img style='height: 40px ; width: 40px ;' src=images/no-image.png>" ;
        }
        listing+= "<div style='border-bottom: 1px solid white; padding-top: 10px;' id=list"+i+">"+
            "<a href=EventDetails.html?event="+obj[i].id +"  style='color: #676767' id="+obj[i].id+" ><div class='listImg col-lg-1 pull-left'>" +
            img +
            "</div>" + "<div class='col-lg-pull-3'> " +
            "<div class='listTitle'><p style='font-size: x-small ; text-align: center ;font-weight: bold'>"+eventTitle  +
            " | "+eventAdd+
            "</p><p style='text-align: center ; font-size: x-small' class='listCity'>"+obj[i].city+"</p></div></div></div></a></div>";
    }
    $("#listings").html(listing);
}
