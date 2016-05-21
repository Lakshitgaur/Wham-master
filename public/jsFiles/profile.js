/**
 * Created by Vikas  on 11/17/2015.
 */
var userPreferences = {};
var prefString = "";
var userPreferencesList = [];
var newuserPreferences = [];
var user = localStorage.getItem('currentUser');
var newPref=[];
var keywords = '';
var dislikes="";
var dislikesList=[];
var likesList="";
var likesArray=[];
var globalResponse="";
var currentPageCount=1;
var map;
var infoWindow;
var bounds="";

var Markers ='';
var page=1;
var listener="";
var currentlocation="";

$("document").ready(function(){
    localStorage.setItem("page",1);
    if(user==null){
        window.location.href="/";
    }else{
        user = JSON.parse(user);
        var username = {
            username : user.userName
        }
        newuserPreferences = user.preferences;
        console.log(newuserPreferences);
        setLikesDislikes(username);


        /*dislikes= localStorage.getItem("dislikes");
        likesList=localStorage.getItem("likes");*/


    }

    initMap();


});

/*var iconBase = 'https://maps.google.com/mapfiles/kml/';*/

var iconBase = 'http://maps.google.com/mapfiles/kml/';

var iconBase1 = 'http://maps.google.com/mapfiles/kml/shapes/';


var category;
var loc;
var func=showPosition;

// Show Preferences Modal
$("document").ready(function (){
    var user=localStorage.getItem('currentUser');
    if(user==null){
        window.location.href ='/';
    }
    else{

        var user=localStorage.getItem('currentUser');
        user = JSON.parse(user);
        console.log(user.userName);

        var username = {
            username : user.userName
        };

        $.ajax({
            url : '/getPreferences',
            data : username,
            type : 'POST',

            success : function(response){
                console.log(response);

                dislikes=response.dislikes;

                if(response.preferences.length == 0) {
                    $('#myModal').on('shown.bs.modal', function () {
                        $('#myInput').focus();
                    });
                    $('#myModal').modal('show');
                }else{
                    $("#myModal").modal('hide');
                    for(var i=0 ;i< response.preferences.length ;i++){
                        keywords += response.preferences[i] + " || ";
                    }
                    keywords = keywords.slice(0,-3);
                    console.log("Onload ->" + keywords);

                }
            }
        });
    }
});

/*Getting Likes*/
// Getting Likes
function getEventLikes(){
    console.log("Inside Likes");
    var user=localStorage.getItem('currentUser');
    user = JSON.parse(user);
    console.log(user);
    var username = {
        username : user.userName
    }
    $.ajax({
        type : 'POST',
        url : '/getLikes',
        data : username,
        success : function (response){
            var res=response.likes;
            if(response == "failed" || res.length==0){
                $.toaster({ priority : 'success', message : 'No Event Likes Yet.',timeout : 2500})
            }else{
                var likes="<div class='col-lg-12'>";

                for(var i=0;i<res.length;i++){
                    likes+="<h5 class='col-lg-12' style='display:block;'><a href='/EventDetails.html?event="+res[i].eventID+"'>"+res[i].eventName+"</a></h5>";
                }
                console.log(likes);
                likes+="</div>"
                $("#likesRow").html(likes);
                $("#likeModal").modal("show");
            }
        }
    })
}
/*Getting Likes Ends*/

// Getting User preferences
function getPref(elem) {
    newuserPreferences = localStorage.getItem("userPref");
    if (newuserPreferences != null) {
        console.log(newuserPreferences.length);

        if (newuserPreferences.length > 0) {
            var music = $(elem).toggleClass('clicked');
            var id = $(elem).attr('id');
            console.log(id);
            console.log($(elem).hasClass('clicked'));
            if (music.hasClass('clicked')) {
                newPref=newuserPreferences.split(",");
                newPref.push(id);
                console.log(newPref);
                $("#green_check_" + id).show();
                $("#" + id).css({"opacity": "0.3"});
                $("#green_check_" + id).attr("src", "images/green_check.png");
            }

            else {
                $("#" + id).css({"opacity": "1"});
                $("#green_check_" + id).hide();
                newPref=newuserPreferences.split(",");
                delete newPref[id];
                var newerPref= [];
                console.log("newPref ->" + newPref.length);
                for(var i=0;i<newPref.length;i++){
                    if(i!=newPref.indexOf(id)){
                        newerPref.push(newPref[i]);
                    }
                }
                newPref=newerPref;

                console.log(newPref);
            }

        }else{
            var music = $(elem).toggleClass('clicked');
            var id = $(elem).attr('id');
            console.log(id);
           // newPref[id] = 1;
            newPref.push(id);
            console.log(userPreferences);
            console.log(music.hasClass('clicked'));
            if (music.hasClass('clicked')) {
                $("#green_check_" + id).show();
                $("#" + id).css({"opacity": "0.3"});
                $("#green_check_" + id).attr("src", "images/green_check.png");
            }
            else {
                $("#" + id).css({"opacity": "1"});
                $("#green_check_" + id).hide();
                delete newPref[id];
                console.log(userPreferences);
            }
        }
    }
    else {
        var music = $(elem).toggleClass('clicked');
        var id = $(elem).attr('id');
        console.log(id);
        userPreferences[id] = 1;

        console.log(userPreferences);
        console.log(music.hasClass('clicked'));
        if (music.hasClass('clicked')) {
            $("#green_check_" + id).show();
            $("#" + id).css({"opacity": "0.3"});
            $("#green_check_" + id).attr("src", "images/green_check.png");
        }
        else {
            $("#" + id).css({"opacity": "1"});
            $("#green_check_" + id).hide();
            delete userPreferences[id];
            console.log(userPreferences);
        }
    }

}
// End of user preferences

// Get the list of preferences
function getListPref(){
    var user=localStorage.getItem('currentUser');
    user = JSON.parse(user);
    console.log("Inside Saved");
    var i = 0;
    var j = 0 ;
    if(newPref != null) {
        if (newPref.length >= 0 ) {
            console.log(newPref);
            userPreferencesList = newPref;
            if(newPref.length == 0){
               for(var k in userPreferences){
                   userPreferencesList.push(k);
               }
            }

            console.log("New edited preferences ->" + userPreferencesList)
            keywords = userPreferencesList.toString().replace(","," || ");
        }
    }
    else{
        for (var k in userPreferences) {
            prefString += k + " ";
            userPreferencesList.push(k);
            console.log(userPreferencesList);
            j++;
        }
    }
    if(userPreferencesList.length == 0){
        userPreferencesList = [];
    }
    console.log(user.userName);
    var userPref = {
        preference : userPreferencesList,
        username : user.userName
    };
    //console.log("Before Ajax" + userPref);

    // Update preferences on the backend.
    $.ajax({
        url : '/updatePreferences',
        data : userPref,
        type: 'POST',
        traditional : true,
        success : function(response){
            console.log(response);

        },
    });

    $('#myModal').modal('hide');
    initMap();

}

// Edit Preferences
function editPreferences(elem) {
    var user = localStorage.getItem('currentUser');
    user = JSON.parse(user);

    console.log(user.userName);
    var username = {
        username : user.userName
    };
    var prefList;
    $.ajax({
       url : '/getPreferences',
       data : username,
       type : 'POST',
       success : function(response){
           prefList = response.preferences;
           console.log(prefList);
           localStorage.setItem("userPref",prefList);
           console.log(localStorage.getItem("userPref"));
           if (prefList==null) {
               $('#myModal').modal('show');
           }else{
               for (var i=0; i < prefList.length ; i++){
                   $("#" + prefList[i]).attr("class","img-responsive img-circle circular-images clicked");
                   $("#green_check_"+ prefList[i]).show();
                   $("#"+prefList[i]).css({"opacity" : "0.3"});
                   $("#green_check_"+prefList[i]).attr("src", "images/green_check.png");
               }
               $('#myModal').modal('show');
           }
       }

    });
}


// Logout user
function logout(){
    $.ajax({
        url:'/logout',
        type:'POST' ,
        success:function(response){
            console.log(response);
            var data= localStorage.getItem('currentUser');
            var data= localStorage.getItem('currentUser');
            var dislikes= localStorage.getItem('dislikes');
            var likes= localStorage.getItem('likes');
            var pages=localStorage.getItem("page");
            localStorage.clear(data);
            localStorage.clear(dislikes);
            localStorage.clear(likes);
            localStorage.clear(pages);
             data= localStorage.getItem('currentUser');
            console.log(data);
            var url='/';
            window.location.href=url;
        }
    });

}

/*Function to load the map*/

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
        listing+= "<div style='border-bottom: 1px solid white; padding-top: 10px;' id=list"+i+" >"+
            "<a href=EventDetails.html?event="+obj.id +"  style='color: #676767' id="+obj.id+"><div class='listImg col-lg-1 pull-left'>" +
            img +
            "</div>" + "<div class='col-lg-pull-3'> " +
            "<div class='listTitle'><p class='markerText' style='font-size: x-small ; text-align: center ;font-weight: bold'>"+obj.title +
            " | "+obj.add+
            "</p><p style='text-align: center ; font-size: x-small' class='listCity'>"+obj.city+"</p></div></div></div></a></div>";

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


function showPosition(position) {

    $.ajax({
        url : "https://maps.googleapis.com/maps/api/geocode/json?latlng="+position.coords.latitude + "," + position.coords.longitude + "&key=AIzaSyBfNltjhmSnvABXT0FTvqmjM0bcoQWMZ6U",
        type : 'GET',
        dataType : 'json',
        success : function(response) {
            if (response != null) {
                console.log(response.results[1].formatted_address);
                $("#locationSign").show();

                $("#locationDetector").html(response.results[1].formatted_address);
                $("#locationDetector").show();
                var user = localStorage.getItem('currentUser');
                user = JSON.parse(user);
                console.log(user);


                $("#current").html("Hi, " + user.firstName + " " + user.lastName);
                $("#current").show();
            }
        }
    });
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: position.coords.latitude, lng: position.coords.longitude},
        zoom: 12
    });
    infowindow = new google.maps.InfoWindow({
        maxWidth: 200
    });

    //var mypos = '{"lat":' + position.coords.latitude + ',"lng":' + position.coords.longitude + ',"title":"' + "Your Are Here !!!" + '","city":"","add":"","id":"#","img":"#"}';
    var mypos = '{"lat":' + position.coords.latitude + ',"lng":' + position.coords.longitude+'}';

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
    var Markers = '';


    currentlocation = position.coords.latitude + "," + position.coords.longitude;
    var date = "This Week";
    $.ajax({
        /*url: "http://api.eventful.com/jsonp/events/search?&keywords="+keywords+"&where=" + currentlocation + "&within=5&units=mi&date=" + date + "&app_key=hPRCcBGTQJrVwC6K",
        */
        url: "http://api.eventful.com/jsonp/events/search?&keywords="+keywords+"&where=" + currentlocation +"&within=5&units=mi&app_key=hPRCcBGTQJrVwC6K",
        dataType: 'jsonp',
        contentType: 'charset=UTF-8',
        success: function (response) {
            var pages=response.page_count;
            localStorage.setItem("page",1);
            // for(var p=0;p<pages;p++){
            // console.log(response.total_items);
            var events=response.events.event;
            globalResponse=response;
            // for(var p=0;p<pages;p++){
            var events = response.events.event;
            for (var e in events) {
                var event = events[e];
                var lat = event.latitude;
                var long = event.longitude;
                var title = event.title;
                var city = event.city_name;
                var add = event.venue_address;
                var event_id = event.id;
                var img = "#";
                if (event.image != null) {
                    img = event.image.thumb.url;
                }
                var url = event.url;
                Markers = Markers + '{"lat":' + lat + ',"lng":' + long + ',"title":"' + title.replace(/"/g, '') + '","city":"' + city + '","add":"' + add + '","id":"' + event_id + '","img":"' + img + '"},';
            }
            Markers=Markers.slice(0,Markers.length-1);
            //Markers = Markers + mypos;
            Markers = "[" + Markers + "]";
            console.log(Markers);

            var obj = $.parseJSON(Markers);
            /*console.log("Before Filtered"+obj.length);

            console.log("Filtered"+obj.length);

            console.log("####"+obj.length);*/


            populateListings(obj);
            //alert(obj.length);
            console.log(dislikesList);
            console.log(likesArray);
            for (var i = 0; i < obj.length; i++) {
                //   alert(obj[i].lat+"  "+obj[i].lng+" "+obj[i].title+ marker);
                var icon="";
                if($.inArray((obj[i].id),dislikesList) != -1){
                    console.log("In Dislikesss");
                    icon=iconBase+"paddle/red-circle.png";

                }
                else if($.inArray((obj[i].id),likesArray) != -1){
                    console.log("In likesss");
                    icon=iconBase+"paddle/grn-circle.png";

                }
                else{
                    icon=iconBase+"paddle/ylw-blank.png";
                }
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(obj[i].lat, obj[i].lng),
                    map: map,
                    title: obj[i].title,
                    content: obj[i].title,
                    animation: google.maps.Animation.DROP,
                    icon:icon

                });
                google.maps.event.addListener(marker, 'click', (function (marker, i) {

                    return function () {
                        infowindow.setContent(getMarkerDisp(obj[i], i));
                        infowindow.open(map, marker);
                    }
                })(marker, i));
            }


        }
    });

}


function search(){
    category=$("#cat").val();
    loc=$("#loc").val();
    console.log("In search"+category+" "+loc);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showNewPositions);
    } else {
        document.getElementById('map').html("Geolocation is not supported by this browser.");
    }
}





/*
function populateListings(obj){
    var listing= $("#listings").html();
    console.log(obj);
    for(var i=0;i<obj.length;i++){
        var img;
        var eventTitle = "";
        var eventAdd = "";
//        console.log(obj[i].add.length);
        if (obj[i].add.length > 22){
            eventAdd = obj[i].add.substring(0,22) + "...";

        }else{
            eventAdd = obj[i].add ;
        }

        if (obj[i].title.length > 30){
            eventTitle = obj[i].title.substring(0,30) + "...";

        }else{
            eventTitle = obj[i].title ;
        }
        if(obj[i].img != "#"){
            img =  "<img src="+obj[i].img+" class='markImg' style='height: 40px ; width: 40px;'>" ;
        }else{
            img = "<img class='markImg' style='height: 40px ; width: 40px' src=images/no-image.png>" ;
        }
        listing+="<div style='border-bottom: 1px solid white; padding-top: 10px;' id=list"+i+" class='row'>"+
            "<a href=EventDetails.html?event="+obj[i].id +"  style='color: #676767' id="+obj[i].id+" class='listing'><div class='listImg col-lg-1 pull-left'>" +
            img +
            "</div>" + "<div class='col-lg-pull-3'> " +
            "<div class='listTitle'><p style='font-size: x-small ; text-align: center ;font-weight: bold'>"+eventTitle +
            " | "+eventAdd+
            "</p><p style='text-align: center ; font-size: x-small' class='listCity'>"+obj[i].city+"</p></div></div></div></a></div>";
    }
    $("#listings").html(listing);
}*/


function showNewPositions(position){
    $("#locationSign").show();
    $("#locationDetector").show();
    $("#current").show();



    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: position.coords.latitude, lng: position.coords.longitude},
        zoom: 12
    });

    bounds = new google.maps.LatLngBounds();
   // var mypos ='{"lat":'+position.coords.latitude+',"lng":'+position.coords.longitude+',"title":"'+"Your Are Here"+'","city":"","add":"","id":"#","img":"#"}';
    var mypos = '{"lat":' + position.coords.latitude + ',"lng":' + position.coords.longitude+'}';

    //var mypos = '{'+position.coords.latitude+','+ position.coords.longitude+'}';

    var marker = new google.maps.Marker({
        position: {lat: position.coords.latitude, lng: position.coords.longitude},
        map: map,
        icon: iconBase + 'paddle/go-lv.png',
     /*   icon: iconBase1 + 'library.png',*/
        title: 'You Are Here !'
    });
    var Markers ='';
    var keywords='';
    var currentlocation=position.coords.latitude+","+position.coords.longitude;
    var date="This Week";
    if(loc == ""){
        console.log(loc);
        loc = currentlocation;
    }
    $.ajax({
        /*url:"http://api.eventful.com/jsonp/events/search?&keywords="+category+"&location="+loc+"&where="+currentlocation+"&within=5&units=mi&date="+date+"&app_key=hPRCcBGTQJrVwC6K",
        */
        url:"http://api.eventful.com/jsonp/events/search?&keywords="+category+"&location="+loc+"&where="+currentlocation+"&within=5&units=mi&app_key=hPRCcBGTQJrVwC6K",

        dataType:'jsonp',
        contentType: 'charset=UTF-8',
        success: function(response){
            console.log(response);
            var pages="";
            //for(var p=0;p<pages;p++){
            var events="";

            if (response.total_items == "0"){
                $("#listings").html("No Events Found! Try Again.");
            }else if(response.total_items == "1"){
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
                    var icon="";
                    if($.inArray((obj[i].id),dislikesList) != -1){
                        icon=iconBase+"paddle/red-circle.png";
                    }
                    else if($.inArray((obj[i].id),likesArray) != -1){
                        icon=iconBase+"paddle/grn-circle.png";

                    }
                    else{
                        icon=iconBase+"paddle/ylw-blank.png";
                    }

                    var marker = new google.maps.Marker({
                        position:new google.maps.LatLng(obj[i].lat,obj[i].lng),
                        map:map,
                        title: obj[i].title,
                        content: obj[i].title,
                        animation: google.maps.Animation.DROP,
                        icon:icon
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
                var Markers = "";
                pages=response.page_count;
                //for(var p=0;p<pages;p++){
                events=response.events.event;
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
                //  }
                Markers=Markers.slice(0,Markers.length-1);
                // Markers=Markers+mypos;
                Markers="["+Markers+"]";
                console.log(Markers);
                var infowindow = new google.maps.InfoWindow({
                    maxWidth:200
                });
                //var obj=Markers;
                var obj=jQuery.parseJSON(Markers);

                populateNewListings(obj);
                //alert(obj.length);
                for(var i=0;i<obj.length;i++){

                    var icon="";
                    if($.inArray((obj[i].id),dislikesList) != -1){
                        icon=iconBase+"paddle/red-circle.png";
                    }
                    else if($.inArray((obj[i].id),likesArray) != -1){
                        icon=iconBase+"paddle/grn-circle.png";

                    }
                    else{
                        icon=iconBase+"paddle/ylw-blank.png";
                    }
                    var marker = new google.maps.Marker({
                        position:new google.maps.LatLng(obj[i].lat,obj[i].lng),
                        map:map,
                        title: obj[i].title,
                        content: obj[i].title,
                        animation: google.maps.Animation.DROP,
                        icon:icon
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
                        console.log(dislikesList);
                        console.log(likesArray);
                        for(var i=0;i<obj.length;i++){
                            var icon="";

                            if($.inArray((obj[i].id),dislikesList) != -1){
                                icon=iconBase+"paddle/red-circle.png";
                            }
                            else if($.inArray((obj[i].id),likesArray) != -1){
                                icon=iconBase+"paddle/grn-circle.png";

                            }
                            else{
                                icon=iconBase+"paddle/ylw-blank.png";
                            }
                            var marker = new google.maps.Marker({
                                position:new google.maps.LatLng(obj[i].lat,obj[i].lng),
                                map:map,
                                animation: google.maps.Animation.DROP,
                                title: obj[i].title,
                                content: obj[i].title,
                                icon: icon
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

function setLikesDislikes(user){
    $.ajax({
        type : 'POST',
        url : '/getLikes',
        data : user,
        success : function (response){

            likesList=response.likes;
            dislikes=response.dislikes;
            /*dislikes= JSON.parse(dislikes);
            likesList=JSON.parse(likesList);*/

            console.log("dislikes"+ dislikes + dislikes.length);
            console.log("likes"+ likesList + likesList.length);

            for(var i=0;i<dislikes.length;i++){
                dislikesList.push(dislikes[i].eventID);
            }
            for(var i=0;i<likesList.length;i++){
                likesArray.push(likesList[i].eventID);
            }
            console.log(dislikesList.length);
            console.log(likesArray.length);

        }
    })
}




/*Function to load the map ends*/

