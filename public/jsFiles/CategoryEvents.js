/**
 * Created by Vikas on 11/21/15.
 */
var categoryType;
var date="This Week";
$("#footer").hide();

window.onload =  function () {
    $("#footer").hide();
    $("#loader-pitch").show();

    // Get category type from QueryString
    var getQueryString = function (field, url) {
        var href = url ? url : window.location.href;
        var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;
    };
    categoryType = getQueryString('category');
    console.log(categoryType);
    getLocation();  // Get user's current location
}
var x;
function getLocation() {
        $("#categoryTitle").html("Popular Events on " + categoryType);
        console.log("Inside getLocation");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
}

// Get list of events based on category and position.
function showPosition(position) {
        console.log(position);
        var currentLocation=position.coords.latitude+","+position.coords.longitude;
        $.ajax({
            url : "http://api.eventful.com/jsonp/events/search?&keywords="+categoryType+"&where="+currentLocation+"&within=5&units=mi&date="+date+"&app_key=hPRCcBGTQJrVwC6K",
            dataType:'jsonp',
            contentType: 'charset=UTF-8',
            success : getEventList
        });
}

//  Success function of AJAX call
function getEventList(data){
    $("#categoryTitle").html("Popular Events on " + categoryType);
    if(data != null){
        $("#loader-pitch").hide();
        var events = data.events.event;
        console.log(events);
        var i =0 ;
        for(var e in events){
            var event=events[e];
            if(event.image != null){
                $("#event_img" + i).attr("src" , event.image.medium.url);
                $("#event_img" + i).css("height", "239px");
                console.log(event.image.medium.url);
            }else{
                $("#event_img" + i).attr("src" , "/images/no-image-big.png");
                $("#event_img" + i).css("height", "239px");

                console.log(event.image);
            }
            $("#eventURL"+ i).attr("href", "EventDetails.html?event="+event.id);
            $("#event_div" + i).show();
            $("#event_date" + i).html(event.start_time);
            $("#event_title" + i).html(event.title);
            $("#event_location" + i).html(event.venue_address);

            i++;
        }
        $("#footer").show();
    }


}
