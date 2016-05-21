/**
 * Created by Vikas on 11/26/15.
 */

var endLat="";
var endLong="";
var startLat="";
var startLng="";
var dest="";
var eventId="";
var eventName="";
var eventAddress = "";
var likesList="";
var disLikesList="";

$("document").ready(function(){
    var loggedInUser=localStorage.getItem("currentUser");

    if(loggedInUser == null){
        $('#likeButton').css("display","none");
        $('#eventTicketButton').css("display","none");
        $('#logoutButton').css("display","none");
        $("#disLikeButton").css("display","none");
        $("#fb-share-button").css("display","none");
    }
    console.log(loggedInUser);

});

$("document").ready(function (){
    console.log("Inside")
    var event;
    // Get category type from QueryString
    var getQueryString = function (field, url) {
        var href = url ? url : window.location.href;
        var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;
    };
    event = getQueryString('event');
    console.log(event);

    $.ajax({
        url : "http://api.eventful.com/jsonp/events/get?id="+event+"&app_key=hPRCcBGTQJrVwC6K",
        dataType:'jsonp',
        contentType: 'charset=UTF-8',
        success : function (response){
            console.log(response);
            dest=response.title;
            eventId=response.id;
            eventName=response.title;

            $("#eventTitle").html(response.title);
            $("#eventTime").html(response.start_time);
            $("#eventAddress").html(response.address);
            $("#eventCity").html(response.city);
            $("#eventRegion").html(response.region);
            $("#eventCountry").html(response.country_abbr);
            $("#eventDescription").html(response.description);
            $("#eventURL").attr("href", response.url);
            $("#eventURL").html(response.title);
            $("#eventOrganizer").html(response.venue_name);
            $("#eventURL2").attr("href", response.url);
            $("#eventURLTitle").html(response.venue_name);
            $("#eventURLTime").html(response.start_time);
            $("#eventAddress2").html(response.address);
            $("#eventCity2").html(response.city);
            $("#eventRegion2").html(response.region);
            $("#eventCountry2").html(response.country_abbr);

            eventAddress = response.address + " " + response.city + " " + response.region + " " + response.country_abbr;


            var fburl= $("div#fb-share-button").attr("data-href");
            $("div#fb-share-button").attr("data-href",fburl+eventId);
            console.log(fburl);


            window.fbAsyncInit = function() {
                FB.init({
                    appId      : '418800194986795',
                    xfbml      : true,
                    version    : 'v2.5'
                });
            };

            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

           /* $.ajax({
                url : '//platform.twitter.com/widgets.js',
                success : function(response){
                    console.log(response)
                }
            })*/
            var loggedInUser = localStorage.getItem("currentUser");
            loggedInUser = JSON.parse(loggedInUser);
            // Show LIKED or UNLIKED
            $.ajax({
                url : '/getUserDetails',
                data : loggedInUser,
                type : 'POST',
                success : function(response){
                    console.log(response);
                    if (response != null){
                        var likes = response.likes;
                        var dislikes=response.dislikes;

                        for(var i = 0; i < likes.length ; i++){
                            if(eventId == likes[i].eventID){
                                var span = "<span class='glyphicon glyphicon-thumbs-up'></span> Liked";
                                $("#likeButton").html("");
                                $("#likeButton").html(span);
                                /*  $("#likeButton").html(" Liked");*/
                                $("#likeButton").css("font-weight", "bold");
                                $("#likeButton").attr("disabled","disabled");
                            }
                        }
                        for(var i = 0; i < dislikes.length ; i++) {
                            if (eventId == dislikes[i].eventID) {
                                console.log(eventId + "  " + dislikes[i].eventID);
                                var span = "<span class='glyphicon glyphicon-thumbs-down'></span> Disliked";
                                $("#disLikeButton").html("");
                                $("#disLikeButton").html(span);

                                $("#disLikeButton").css("font-weight", "bold");
                                $("#disLikeButton").attr("disabled", "disabled");
                            }

                        }

                        console.log(eventId);

                    }else{
                        $("#disLikeButton").hide();
                        $("#fb-share-button").hide();
                    }
                }
            })
            if(response.links != null) {
                console.log(response.links.link[0].url);
                $("#eventTicketURL").attr("href", response.links.link[0].url);
                $("#eventTicketURL").attr("target", "_blank");

            }else{
                $("#eventTicketButton").hide();

            }
            if(response.images != null && response.images.image.size == 1 ) {
                $("#eventImage").attr("src", response.images.image.medium.url);
            }else if(response.images != null && response.images.image.size > 1){
                $("#eventImage").attr("src", response.images.image[0].medium.url);
            }
            endLat=response.latitude;
            endLong=response.longitude;
            var mypos=JSON.parse(localStorage.getItem("mypos"));
            console.log(mypos);
            startLat=mypos.lat;
            startLng=mypos.lng;
           console.log(startLat+" "+startLng+"    "+endLat+" "+endLong);

            $.ajax({
                url : "https://maps.googleapis.com/maps/api/js?key=AIzaSyBtI7AN64cEY4OHkRyaPJd_RwiuDe_pA-o",
                jsonp: "callback",
                // Tell jQuery we're expecting JSONP
                dataType: "jsonp",
                json_callback: 'JSON_CALLBACK',
                success : initMap
            });
            var map;
            function initMap() {
                map = new google.maps.Map(document.getElementById('map'), {
                    center: {lat: parseInt(response.latitude),lng: parseInt(response.longitude)},
                    zoom: 17
                });

                var mypos = {lat: parseInt(response.latitude), lng: parseInt(response.longitude)};
                var markers = new google.maps.Marker({
                    position:mypos,
                    map:map,
                    title : 'Event'
                });
            }
        }
    });

  /*  $("#uber").click(function(){
        var data={"start_latitude":startLat,"start_longitude":startLng,"end_latitude":endLat,"end_longitude":endLong,"server_token":"0naxWCER_iSe_XMcm9EYLMFXkzNQtPyF55SDsLGv"};
        $.ajax({
            url:'https://api.uber.com/v1/estimates/price',
            data:data,
            method:'GET',
            success:function(response){
                console.log(response);
                var res=response.prices;
                console.log(res);

                for(var i=0;i<res.length;i++){
                    console.log(res[i].display_name);
                    $('#ride'+i).attr("class",res[i].product_id);
                    $("#disp"+i).html(res[i].display_name);
                    $("#est"+i).html(res[i].estimate);
                    $("#dura"+i).html(res[i].duration/60 +" minutes");

                }
                $("#myModal").modal("show");
            }
        })
    });*/

    /*Like Button Functionality*/
    $("#likeButton").click(function(){
        var user=localStorage.getItem("currentUser");
        user=JSON.parse(user);

        if(eventId != ""){
            var userDetails = {
                email : user.userName,
                id : eventId,
                name : eventName
            };
            var like={
                "eventId":eventId,
                "eventName":eventName
            }
            console.log(userDetails);

          /*  var likes=localStorage.getItem("likes");

            likes=JSON.parse(likes);
           /!* console.log(likes);
            console.log(likes.length);*!/
            likes.push(like);
          /!*  console.log(likes.length);
            console.log(likes);*!/
            localStorage.setItem("likes",JSON.stringify(likes));

            disLikesList=JSON.parse(localStorage.getItem("dislikes"));*/



            if($.inArray(like.eventId,disLikesList) != -1){
                disLikesList.splice(like.eventId);
                /*disLikesList=jQuery.grep(dislikesList,function(val){
                   return value != like.eventId;
                });*/
            }

            localStorage.setItem("dislikes",JSON.stringify(disLikesList));

            $.ajax({
                url : '/updateLikes',
                type : 'POST',
                data :  userDetails,
                success : function(response){
                    console.log(response);
                    var span = "<span class='glyphicon glyphicon-thumbs-up'></span> Liked";
                    var disSpan = "<span class='glyphicon glyphicon-thumbs-down'></span> Dislike";
                    $("#disLikeButton").html(disSpan);
                    $("#disLikeButton").removeAttr('disabled');

                    $("#likeButton").html("");
                    $("#likeButton").html(span);
                  /*  $("#likeButton").html(" Liked");*/
                    $("#likeButton").css("font-weight", "bold");
                    $("#likeButton").attr("disabled","disabled");
                }
            });
        }

    });
    /*Like Button Functionality ends*/

    /*DisLike Button FUnctionality*/
    $("#disLikeButton").click(function(){
        var user=localStorage.getItem("currentUser");
        user=JSON.parse(user);

        if(eventId != "") {
            var userDetails = {
                email: user.userName,
                id: eventId,
                name: eventName
            };
            console.log(userDetails);
            var dislike={
                "eventId":eventId,
                "eventName":eventName
            }

          /*  var dislikes=localStorage.getItem("dislikes");
            dislikes=JSON.parse(dislikes);*/
          /*  console.log(dislikes.length);*/
           /* dislikes.push(dislike);*/
           /* console.log(dislikes.length);
            console.log(dislikes);*/
           /* localStorage.setItem("dislikes",JSON.stringify(dislikes));

            likesList=JSON.parse(localStorage.getItem("likes"));*/


          /*  if($.inArray(dislike.eventId,likesList) != -1){
                likesList.splice(dislike.eventId,1);
               /!* likesList=jQuery.grep(likesList,function(val){
                    return value != dislike.eventId;
                });*!/
            }
            localStorage.setItem("likes",JSON.stringify(likesList));*/

            $.ajax({
               url : '/updateDislikes',
               data : userDetails,
               type : 'POST',
               success : function(response){
                   console.log(response)
                   $("#disLikeButton").attr("disabled","disabled");
                   var span = "<span class='glyphicon glyphicon-thumbs-up'></span> Like";
                   var disSpan = "<span class='glyphicon glyphicon-thumbs-down'></span> Disliked";
                   $("#disLikeButton").html(disSpan);
                   $("#disLikeButton").attr("disabled","disabled");
                   $("#likeButton").html(span);
                   $("#likeButton").removeAttr('disabled');
               }
            });
        }
    });
    /*DIslike Button Functionality ends*/

$("#uber").click(function(event){
// Redirect to Uber API via deep-linking to the mobile web-app
        var uberURL = "https://m.uber.com/?";

// Add parameters
        uberURL += "client_id=" + "a4nBAD1ys1KPto6JNuD3auPr-3voYGK1";
        if (typeof startLat != typeof undefined) uberURL += "&" + "pickup_latitude=" + startLat;
        if (typeof startLng != typeof undefined) uberURL += "&" + "pickup_longitude=" + startLng;
        uberURL += "&" + "dropoff_latitude=" + endLat;
        uberURL += "&" + "dropoff_longitude=" + endLong;
        uberURL += "&" + "dropoff_nickname=" + dest;

// Redirect to Uber
       /* window.location.href = uberURL;*/
        window.open(
            uberURL,
            '_blank' // <- This is what makes it open in a new window.
        );
    });

    $("#getDir").click(function(){
        console.log("Inside Get Directions");
        // Redirect to Google maps URL
        var googlemapsURL = "https://www.google.com/maps/place/";

        // Add Parameters
        googlemapsURL +=  eventAddress + "/";
        console.log(googlemapsURL);

        // Redirect to google
        window.open(
            googlemapsURL,
            '_blank' // <- This is what makes it open in a new window.
        );

    });
});



function goBack() {
    window.history.back();
}


function hideButtons(){
    var loggedInUser=localstorage.getItem("currentUser");

    if(loggedInUser == null){
        $('.hideButton').attr("display","none");
    }
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

function shareThis(){
    
}


