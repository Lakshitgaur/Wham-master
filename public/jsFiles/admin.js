/**
 * Created by Vikas on 12/3/15.
 */
// Logout user
function logout(){
    $.ajax({
        url:'/logout',
        type:'POST' ,
        success:function(response){
            console.log(response);
            var data= localStorage.getItem('currentUser');
            localStorage.clear(data);
            data= localStorage.getItem('currentUser');
            console.log(data);
            var url='/';
            window.location.href=url;
        }
    });
}

$(document).ready(function() {
    $("#userDetailsHeader").hide();
    $("#userTable").hide();
    $("#moreDetailsHeader").hide();
    $("#getUserProfiles").click(function () {
        console.log("Inside Click");
        $.ajax({
            url: '/getProfiles',
            type: 'POST',
            success: function (response) {
                console.log(response);
                if (response.length == 0) {
                    $("#userDetailsHeader").html("No Users exists");
                    $("#userDetailsHeader").css("display", "block");
                } else {
                    var userProfiles = response;
                    var userTable = $("#userTable");
                    var userHeadersRow = "<thead> <tr>";
                    userHeadersRow = userHeadersRow + "<th>" + "#" + "</th>"
                    userHeadersRow = userHeadersRow + "<th>" + "First Name" + "</th>";
                    userHeadersRow = userHeadersRow + "<th>" + "Last Name" + "</th>";
                    userHeadersRow = userHeadersRow + "<th>" + "Email" + "</th>";
                    userHeadersRow = userHeadersRow + "<th>" + "Gender" + "</th>";
                    userHeadersRow = userHeadersRow + "<th>" + "Password" + "</th> </tr> </thead>";
                    $("#userTable").empty();
                    $("#userTable").append(userHeadersRow);
                    $.each(userProfiles, function (index, val) {
                        var user = val;
                        var tr = '<tr id=userRow' + index + '>';
                        tr = tr + "<td>" + (index + 1) + "</td>"
                        tr = tr + "<td>" + user.firstName + "</td>";
                        tr = tr + "<td>" + user.lastName + "</td>";
                        tr = tr + "<td>" + user.email + "</td>";
                        tr = tr + "<td>" + user.gender + "</td>";
                        tr = tr + "<td>" + "******" + "</td>";
                        tr = tr + "<td>" + '<button class=btn ' + " id=user" + index + '>More Details >></button>' + "</td>";
                        tr = tr + "<td>" + '<button class=btn' + " id=userDelete" + index + '>Delete User</button>' + "</td><tr/>";
                        $("#userTable").append(tr);
                        $("#userDelete" + index).click(function () {//------------------- To delete a user ---------------//
                            $("#userRow" + index).hide();
                            $("#preferenceTable").hide();
                            console.log(user.email);
                            var email = user.email;
                            var userData = {user: email};
                            $.ajax({
                                type: 'POST',
                                data: userData,
                                url: '/deleteUser',
                                success: function (response) {
                                    console.log(response);
                                }
                            });
                        });
                        $("#user" + index).click(function () {
                            var preferenceDetails = "<thead><tr>";
                            preferenceDetails = preferenceDetails + "<th>" + "#" + "</th>";
                            preferenceDetails = preferenceDetails + "<th>" + "Preferences" + "</th></tr></thead>";
                            $("#preferenceTable").empty();
                            $("#preferenceTable").append(preferenceDetails);
                            $.each(user.preferences, function (index, val) {
                                var preference = val;
                                console.log(preference);
                                var tr = "<tr>";
                                tr = tr + "<td>" + (index + 1) + "</td>";
                                tr = tr + "<td>" + preference + "</td></tr>";
                                $("#preferenceTable").append(tr);
                            });
                            $("#moreDetailsHeader").show();
                            $("#preferenceTable").show();
                        });
                        $("#userDetailsHeader").show();
                        $("#userTable").show();
                    });
                }
            }
        });
    });

    $("#hideProfiles").click(function () {
        $("#userDetailsHeader").hide();
        $("#moreDetailsHeader").hide();
        $("#preferenceTable").hide();
        $("#userTable").hide();
    })
});
