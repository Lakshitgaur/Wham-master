/**
 * Created by sanjiv on 11/11/2015.
 */

window.onload =  function () {
    $.ajax({
       url :  'https://www.eventbriteapi.com/v3/events/search/?location.within=1mi&location.latitude=42.340075&location.longitude=-71.089537&token=6Y6EZZR55M7G7XOAVAJD',
        dataType: 'json',
        //jsonp: 'callback',
        //contentType : 'application/json',
        //type: 'GET',
        crossDomain : true,
       success : function (data) {
          //  if (!error && response.statusCode == 200) {
                console.log(data); // Print the webpage
            //}
        }});
};
