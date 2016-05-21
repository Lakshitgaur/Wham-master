# Whats Happening Around Me!! (WHAM)
MSD Project (CS 5500) : Fall 2015

Team Details:
# Team Name: Tech Patriots<br/>

# Team Members:
1) Lakshit Gaur<br/>
2) Nitin Shetty<br/>
3) Sandeep Lagisetty<br/>
4) Sanjiv Kumar<br/>
5) Vikas Shriyan<br/>

*****************************************************************************************************************************
# Description:
*****************************************************************************************************************************
Whats Happening Around Me AKA WHAM is a web platform connecting users with local events, entertainment, movies, sports etc. WHAM can be used to find out what's happening around you and decide what to do; from movies, concerts and local events to family fun and night life. With so many events to choose from, WHAM provides a comprehensive selection of local entertainment content. 

WHAM is unique in many sense, it helps in finding you the local events happening around you i.e. wherever you go, WHAM will follow you !! 

The moment you open our application, we will ask for your location (Don't worry, we will not visit you!!) , It will be used to provide a map view of local events happeninng around you. You can then search for events either by location or by keyword.

--------------------------------------------Discover events, Like and Away you go!!--------------------------------------

*****************************************************************************************************************************
# Technology Stack:
*****************************************************************************************************************************
Frontend : HTML5, JavaScript, JQuery<br/>
Backend : MEN Stack (MongoDB, Express and Node.js)<br/>
Testing Framework: Mocha.js and Chai.js<br/>

API's:
Eventful API for getting list of events and everything else.<br/>
Google API's for Maps, places etc.<br/>
UBER API for integrating UBER with our application<br/>

IDE : WebStorm 11.0<br/>
Version Control: Github<br/> 

*****************************************************************************************************************************
# How to use WHAM:
*****************************************************************************************************************************
Using our WHAM application is very easy (Thanks to our team for making such user-friendly and simple user-interface). As you might guess, to show events happening near you, the application needs to know your location. WHAM does exactly the same, it asks for your location, once you allow it, it provides a map view of the events. 

WHAM provides you two ways for searching an event:<br/>
i) By Location : Give any location (city) and you will see a list of events filtered by location.<br/>
ii) By category: Search by providing a keyword for category and you will see a list of events filtered by category.<br/>

The event markers on map are clickable and when clicked they provide a brief detail about the event as well as you can go to event details page by clicking. Beside the map, there is also a listing of events (they refer to the same events that are shown on map). They are also clickable and take you to the event details page.

On home page, you will also find category of events , you can directly click on any category and look through the events related to that category. 

On the home page, a guest user has the option to signup/rgister and a member has the option to login. 

There are some additonal features that Logged in member enjoys:<br/>
i) Can set/edit preferences and events will be filtered as per the preferences of the user. <br/>
ii) Can Like/Dislike any events.<br/>
iii)  Dislike events will not be shown in the search results i.e. on the map as well as in the listing.<br/>

WHAM has a event details page for every events. Event details page has following contents:<br/>
i) Brief Description of event.<br/>
ii) Organizer, location of event, event date, etc.<br/>
iii) location of the event shown on map.<br/>
iv) Option to book a UBER to the destination.<br/>
v) Sharing option on facebook.<br/>
vi) If that particular event requires ticket, we have link to the ticket vendor too!<br/>

With these many features and options, we have build a technology to allow anyone to share, find and attend new things to do that fuel their passions and enrich their lives. Music festivals, marathons, conferences, hackathons, air guitar competitions, political rallies, fundraisers, gaming competitions - you name it, we power it. Our mission? To bring the world together through live experiences.

*****************************************************************************************************************************
# Management Instructions(how to install the system plus what to do for different error conditions):
*****************************************************************************************************************************
## System Requirements:<br/>

### Operating System:<br/>
* *Windows 8.1/10*<br/>
* *OSX*<br/>

* *Node.js* - <a href="http://nodejs.org">Download</a> and Install Node.js, nodeschool has free <a href="http://nodeschool.io/#workshoppers">node tutorials</a> to get you started.
* *MongoDB* - Follow the great tutorial from the mongodb site - <a href="https://docs.mongodb.org">"Install Mongodb"</a>
* *Git* - The easiest way to install git and then run the rest of the commands through the *git bash* application (via command prompt) is by downloading and installing <a href="http://git-scm.com/download">Git</a>
* *WebStorm IDE* - Install <a href="https://www.jetbrains.com/webstorm/download/">WebStorm IDE</a>
 

## Installation: <br/>

i) Clone the WHAM repository into your local system using following commands:<br/>
```
git clone https://github.ccs.neu.edu/sandeep9/WHAM.git
```
* *Possible errors*:<br/>
While cloning repository you might get an error saying 'git.exe' not found:<br/>
*Solution*:<br/>Make sure you download <a href="http://git-scm.com/download">Git</a> and set path in the environment variables. Please check <a href="http://windowsitpro.com/systems-management/how-can-i-add-new-folder-my-system-path ">How to set path</a>

ii) Import the cloned project into WebStorm IDE<br/>

iii) Install and Integrate the MongoDB plugin into WebStorm IDE using the following steps:<br/>
* *Go to Webstorm --> Preferences on MacOSX/Settings on Windows*
* *Click on Plugins --> Browse Repository and search for Mongo plugin on the search bar*
* *Click on Install*
* *Go to Preferences/Setttings --> Other Settings --> Choose Mongo Servers*
* *Set up path to Mongo executable and then click on 'Test' to check if MongoDB has been correctly integrated into WebStorm*

* *Possible errors*:<br/>
If Testing the MongoDB instance fails:<br/>
*Solution*:<br/>check if whether the MongoDB is correctly installed on your system and then check if MongoDB plugin has been correctly integrated with WebStorm.

## Running WHAM:<br/>

i) Open WebStorm Terminal and go to the location where MongoDB instance is located and run following command:<br/>
Location Ex: MongoDB\Server\3.0\bin><br/>
```
mongod
```
* *Possible errors*:<br/>
mongod instance fails to start:<br/>
*Solution*:<br/>check if whether the MongoDB is correctly installed on your system and then check if MongoDB plugin has been correctly integrated with WebStorm.<br/>

ii) Open WebStorm Terminal and run the following command:
```
node app.js
```
* *Possible errors*:<br/>
Node was not found in your system<br/>
*Solution*:<br/> check whether node was properly installed in your system. If correctly installed, check node settings on WebStorm. Go to --> Preferences/Settings --> Node.js and NPM and check Node interpreter path is correctly set to not.<br/>

ii) Open your favorite browser and give the following URL:
```
localhost:8000
```

### WHAM!!! You are all set to experience the rich life experience through our application!!
