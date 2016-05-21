/**
 * Created by Nitin on 11/13/2015.
 */
//alert('Before Ajax');
$(document).ready(function(){
    $("#registerUser").click(function(event){
        //alert('In Login,js');
        var flag= true;
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        var firstName=$('#register_first_name').val();
        var lastName= $('#register_last_name').val();
        var email=$('#register_email').val();
        var year_of_birth=$('#register_yob').val();
       /* var gender=document.forms['register-form'].gender.value;*/
        var gender=$("label.active").find("input").val();
        console.log(gender);
        var password=$('#register_password').val();
        var cnf_password=$('#register_confirm_password').val();

        if(!firstName.match('^[a-zA-Z]{1,16}$')){
            flag=false;
            $('#errorDiv').html('Invalid First Name');
            $('#register_first_name').focus();
            return;
        }
        if(!lastName.match('^[a-zA-Z]{1,16}$')){
            flag=false;
            $('#errorDiv').html('Invalid Last Name');
            $('#register_last_name').focus();
            return;
        }
        if( !regex.test(email)){
            flag=false;
            $('#errorDiv').html('Invalid Email Format');
            $('#register_email').focus();
            return;
        }

        if(year_of_birth == '') {
            flag = false;
            $('#errorDiv').html('Please select a year of birth');
            $('#register_yob').focus();
            return;
        }

        if(password.length < 6 || !password.length > 30 ){
            flag=false;
            $('#errorDiv').html('Password can be of length between 6 and 30');
            $('#register_password').focus();
            return;
        }


        if(cnf_password.length < 6 || !cnf_password.length > 30 ){
            flag=false;
            $('#errorDiv').html('Password can be of length between 6 and 30');
            $('#register_confirm_password').focus();
            return;
        }

        if (password != cnf_password) {
            flag=false;
            $('#errorDiv').html('Passwords dont match. Try again');
            $('#register_password').val('');
            $('#register_confirm_password').val('');
            $('#register_password').focus();
            return;
        }
       /*Add validation here*/
        if(flag){
            var newUser = {firstName:firstName,lastName:lastName ,email:email,year_of_birth:year_of_birth ,gender:gender,password:password};
            console.log(newUser);
            $.ajax({
                url:'/register',
                type:'POST',
                data:newUser,
                success:function(response){
                    $('#errorDiv').html("");
                    if(response!='A user exists with this email id.'){
                        var currentUser={
                            userName:response.email,
                            firstName: response.firstName,
                            lastName:response.lastName,
                            age:response.age,
                            gender: response.gender,
                            prefFlag : response.prefFlag
                        };
                        localStorage.setItem("currentUser",JSON.stringify(currentUser));
                        var url='Profile.html';
                        window.location.href=url;
                    }
                    else{
                        $('#errorDiv').html("Error while registering.Please try again");

                    }

                },
            });
        }


    });

//login
    $("#loginButton").click(function(event){

        var username=$('#login_username').val();
        var password=$('#login_password').val();
        var flag= true;

        if(username==null || username==""){
            flag=false;
            $('#errorDiv_login').html('Enter UserName');
            $('#login_username').focus();
            return;
        }

        if(password=="" || password==null){
            flag=false;
            $('#errorDiv_login').html('Enter Password');
            $('#login_password').focus();
            return;
        }

        if(username == "admin" && password == "admin"){
            window.location.href="adminProfile.html"
        }

        if(flag){
            var oldUser = {username:username,password:password};
            console.log(oldUser);

            $.ajax({
                url:'/login',
                type:'POST',
                data:oldUser,
                success:function(response){
                        var currentUser={
                            userName:response.email,
                            firstName: response.firstName,
                            lastName:response.lastName,
                            age:response.age,
                            gender: response.gender,
                            prefFlag : response.prefFlag,
                            preferences : response.preferences,
                            dislikes:response.dislikes,
                            likes:response.likes
                        };
                    var dislikes=currentUser.dislikes;
                    var likes=currentUser.likes;
                    localStorage.setItem("currentUser",JSON.stringify(currentUser));
                    localStorage.setItem("dislikes",JSON.stringify(dislikes));
                    localStorage.setItem("likes",JSON.stringify(likes));

                        var url='Profile.html';
                       window.location.href=url;
                },
                error:function(jqXHR,exception){
                    if(jqXHR.status=== 401){
                        $('#errorDiv_login').html("Incorrect Username/Password Combination. Try Again.");
                    }
                }
            });
        }

    });

});



//forget password
$("#lostPassword").click(function(event){
    console.log("Inside Lost password");
    var lost_email=$('#lost_email').val();
    var flag= true;
    if(lost_email==null || lost_email==""){
        flag=false;
        $('#errorDiv_login').html('Enter emailID');
        $('#lost_email').focus();
        return;
    }
    if(flag){
        var oldUser = {lost_email:lost_email};
        console.log(oldUser);

        $.ajax({
            url:'/forgetPass',
            type:'POST',
            data:oldUser,
            success:function(response){
                $("#divLostPassMsg").html("Password was sent to your email successfully");
            },
            error:function(jqXHR,exception){
                $("#divLostPassMsg").html("No user exists with this email id");
            }
        });
    }
});


function changeAttr() {
    $("#male").attr("class", "btn btn-default");
}